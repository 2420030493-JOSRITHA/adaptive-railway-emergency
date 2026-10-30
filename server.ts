import express from 'express';
import path from 'path';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Railway Emergency State Store (Synced across clients & SSE)
interface EmergencyReport {
  id: string;
  type: string;
  coach: string;
  seatOrLocation: string;
  description: string;
  severity: string;
  timestamp: number;
  status: string;
  isBuzzer: boolean;
  affectedCount?: string;
  assignedTeam?: string;
  reporterContact?: string;
}

interface StaffBroadcastAlert {
  id: string;
  title: string;
  type: string;
  message: string;
  affectedCoaches: string[];
  severity: string;
  timestamp: number;
  exitGuidance: string;
  isActive: boolean;
  soundAlarm: boolean;
  evacuationRecommended: boolean;
}

interface RescueUnit {
  id: string;
  incidentId: string;
  name: string;
  type: string;
  status: string;
  etaMinutes: number;
  contactNumber: string;
}

let reports: EmergencyReport[] = [
  {
    id: 'RPT-101',
    type: 'medical',
    coach: 'A2',
    seatOrLocation: 'Berth 14 (Lower)',
    description: 'Elderly passenger experiencing acute shortness of breath and chest pain.',
    severity: 'high',
    timestamp: Date.now() - 1000 * 60 * 12,
    status: 'dispatched',
    isBuzzer: false,
    affectedCount: '1 person',
    assignedTeam: 'Rapid Medical First-Responder Unit (Coach A1)',
    reporterContact: '+91 98765 43210',
  },
  {
    id: 'RPT-102',
    type: 'suspicious',
    coach: 'Pantry',
    seatOrLocation: 'Aisle near dry food rack',
    description: 'Unattended metallic suitcase without tag for 45+ minutes.',
    severity: 'medium',
    timestamp: Date.now() - 1000 * 60 * 25,
    status: 'acknowledged',
    isBuzzer: false,
    affectedCount: 'Coach area',
    assignedTeam: 'RPF Rail Security Wing',
  },
];

let activeBroadcast: StaffBroadcastAlert | null = null;
let broadcastHistory: StaffBroadcastAlert[] = [];
let isBuzzerActive = false;
let activeBuzzerIncident: EmergencyReport | null = null;

let telemetry = {
  trainNumber: '12952',
  trainName: 'New Delhi - Mumbai Tejas Rajdhani Express',
  currentSpeedKmph: 118,
  targetSpeedKmph: 130,
  nextStation: 'Kota Junction (KOTA)',
  etaNextStationMin: 22,
  totalCoaches: 22,
  currentLocation: 'Section 481-B (Mathura - Kota High-Speed Corridor)',
  lastUpdated: Date.now(),
  emergencyBrakingStatus: 'normal' as 'normal' | 'caution' | 'emergency_stop_engaged',
  brakeLinePressureBar: 5.0,
  trackGradient: '+0.2% (Gentle Ascent)',
  catenaryVoltageKV: 25.1,
  locoPilot: 'Rajesh Sharma (Chief Loco Pilot)',
  guard: 'Sunil Verma (Head Guard)',
};

let rescueUnits: RescueUnit[] = [
  {
    id: 'UNIT-MED-1',
    incidentId: 'RPT-101',
    name: 'Coach A1 Paramedic Response Kit',
    type: 'medical_rapid',
    status: 'en_route',
    etaMinutes: 2,
    contactNumber: '+91 94250 11223',
  },
  {
    id: 'UNIT-SEC-1',
    incidentId: 'RPT-102',
    name: 'RPF Train Security Escort Squad',
    type: 'rpf_security',
    status: 'on_scene',
    etaMinutes: 0,
    contactNumber: '+91 94250 88990',
  },
];

// Server-Sent Events (SSE) Client List for Live Real-Time Multi-Device Sync
type SSEClient = express.Response;
let sseClients: SSEClient[] = [];

function notifySSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Health check & Backend Architecture Info
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    runtime: 'Node.js + Express.js',
    flaskCompanion: 'Supported at /backend_flask/app.py (Port 5000)',
    version: '2.0.0-adaptive-emergency',
    timestamp: Date.now(),
    train: telemetry.trainNumber,
    activeIncidents: reports.filter((r) => r.status !== 'resolved').length,
    activeBroadcast: !!activeBroadcast,
    isBuzzerActive,
    connectedSSEClients: sseClients.length,
  });
});

// 2. Server-Sent Events (SSE) for Real-Time Mobile & Kiosk Sync
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial snapshot
  res.write(`event: init\ndata: ${JSON.stringify({
    telemetry,
    reports,
    activeBroadcast,
    isBuzzerActive,
    rescueUnits,
  })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// 3. Train Telemetry & Emergency Braking
app.get('/api/telemetry', (_req, res) => {
  res.json({
    success: true,
    data: telemetry,
  });
});

app.post('/api/telemetry/brakes', (req, res) => {
  const { action } = req.body; // 'engage' | 'release'
  if (action === 'engage') {
    telemetry.emergencyBrakingStatus = 'emergency_stop_engaged';
    telemetry.brakeLinePressureBar = 0.0;
    telemetry.currentSpeedKmph = Math.max(0, telemetry.currentSpeedKmph - 45);
  } else {
    telemetry.emergencyBrakingStatus = 'normal';
    telemetry.brakeLinePressureBar = 5.0;
    telemetry.currentSpeedKmph = 90;
  }
  telemetry.lastUpdated = Date.now();

  notifySSE('telemetry_update', telemetry);
  res.json({ success: true, data: telemetry });
});

// 4. Emergency Reports API
app.get('/api/emergency/reports', (_req, res) => {
  res.json({
    success: true,
    total: reports.length,
    data: reports,
  });
});

app.post('/api/emergency/reports', (req, res) => {
  const { type, coach, seatOrLocation, description, severity, affectedCount, reporterContact } = req.body;

  if (!type || !coach || !description) {
    return res.status(400).json({ success: false, error: 'Missing required report fields' });
  }

  const newReport: EmergencyReport = {
    id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
    type,
    coach: coach.toUpperCase(),
    seatOrLocation: seatOrLocation || 'Unspecified Berth',
    description,
    severity: severity || 'high',
    timestamp: Date.now(),
    status: 'pending',
    isBuzzer: false,
    affectedCount: affectedCount || '1 person',
    reporterContact: reporterContact || '',
  };

  reports = [newReport, ...reports];
  notifySSE('new_report', newReport);

  res.status(201).json({ success: true, data: newReport });
});

app.patch('/api/emergency/reports/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, assignedTeam } = req.body;

  const rpt = reports.find((r) => r.id === id);
  if (!rpt) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }

  if (status) rpt.status = status;
  if (assignedTeam) rpt.assignedTeam = assignedTeam;

  notifySSE('report_status_changed', rpt);
  res.json({ success: true, data: rpt });
});

// 5. 1-Tap Extreme SOS Buzzer API
app.post('/api/emergency/buzzer', (req, res) => {
  const { coach = 'B6', seat = 'Berth 28' } = req.body;

  const buzzerReport: EmergencyReport = {
    id: `SOS-BUZZER-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'extreme_buzzer',
    coach,
    seatOrLocation: seat,
    description: `EMERGENCY 1-TAP PASSENGER SOS BUZZER ACTIVATED in Coach ${coach}, ${seat}! Immediate train guard, loco pilot, and security intervention required.`,
    severity: 'critical',
    timestamp: Date.now(),
    status: 'pending',
    isBuzzer: true,
    affectedCount: 'Coach Passengers',
    assignedTeam: 'Train Guard & Immediate RPF Escort',
  };

  reports = [buzzerReport, ...reports];
  isBuzzerActive = true;
  activeBuzzerIncident = buzzerReport;

  // Create an automatic high-priority broadcast for affected coach
  activeBroadcast = {
    id: `BCST-SOS-${Date.now()}`,
    title: `🚨 EMERGENCY ALARM IN COACH ${coach}`,
    type: 'extreme_buzzer',
    message: `A high-priority passenger SOS alarm was activated at Coach ${coach}, ${seat}. Train crew and security dispatched. Remain seated and check nearest safe exit doors.`,
    affectedCoaches: [coach, 'ALL'],
    severity: 'critical',
    timestamp: Date.now(),
    exitGuidance: `Locate primary exit doors or vestibule gangways. Wait for staff instructions.`,
    isActive: true,
    soundAlarm: true,
    evacuationRecommended: false,
  };

  notifySSE('buzzer_triggered', {
    incident: buzzerReport,
    broadcast: activeBroadcast,
  });

  res.json({
    success: true,
    message: 'Extreme SOS buzzer broadcasted train-wide',
    incident: buzzerReport,
    broadcast: activeBroadcast,
  });
});

app.post('/api/emergency/silence', (_req, res) => {
  isBuzzerActive = false;
  if (activeBuzzerIncident) {
    activeBuzzerIncident.status = 'resolving';
  }
  notifySSE('buzzer_silenced', { timestamp: Date.now() });
  res.json({ success: true, message: 'Emergency alarm silenced' });
});

// 6. Staff Broadcast Notifications API
app.get('/api/broadcasts', (_req, res) => {
  res.json({
    success: true,
    activeBroadcast,
    history: broadcastHistory,
  });
});

app.post('/api/broadcasts', (req, res) => {
  const {
    title,
    type = 'fire',
    message,
    affectedCoaches = ['ALL'],
    severity = 'critical',
    exitGuidance,
    soundAlarm = true,
    evacuationRecommended = true,
  } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'Title and message required' });
  }

  const newBroadcast: StaffBroadcastAlert = {
    id: `BCST-${Date.now()}`,
    title,
    type,
    message,
    affectedCoaches,
    severity,
    timestamp: Date.now(),
    exitGuidance: exitGuidance || 'Follow neon green exit signs towards unblocked coach vestibules.',
    isActive: true,
    soundAlarm,
    evacuationRecommended,
  };

  if (activeBroadcast) {
    broadcastHistory.unshift(activeBroadcast);
  }
  activeBroadcast = newBroadcast;

  notifySSE('staff_broadcast', newBroadcast);
  res.status(201).json({ success: true, data: newBroadcast });
});

app.post('/api/broadcasts/dismiss', (_req, res) => {
  if (activeBroadcast) {
    activeBroadcast.isActive = false;
    broadcastHistory.unshift(activeBroadcast);
    activeBroadcast = null;
  }
  notifySSE('broadcast_dismissed', { timestamp: Date.now() });
  res.json({ success: true, message: 'Broadcast cleared' });
});

// 7. Rescue Units API
app.get('/api/rescue/units', (_req, res) => {
  res.json({ success: true, data: rescueUnits });
});

app.post('/api/rescue/dispatch', (req, res) => {
  const { incidentId, unitType, unitName } = req.body;
  const newUnit: RescueUnit = {
    id: `UNIT-${Math.floor(1000 + Math.random() * 9000)}`,
    incidentId: incidentId || 'GENERAL',
    name: unitName || 'Rapid Intervention Response Team',
    type: unitType || 'medical_rapid',
    status: 'deploying',
    etaMinutes: 3,
    contactNumber: '+91 94250 44556',
  };

  rescueUnits.push(newUnit);

  // Update corresponding report status
  const rpt = reports.find((r) => r.id === incidentId);
  if (rpt) {
    rpt.status = 'dispatched';
    rpt.assignedTeam = newUnit.name;
  }

  notifySSE('rescue_dispatched', newUnit);
  res.status(201).json({ success: true, data: newUnit });
});

// 8. NPM Command Runner API (Safe execution of project npm scripts & package inspections)
const ALLOWED_NPM_COMMANDS: Record<string, string> = {
  'npm run lint': 'tsc --noEmit',
  'npm run build': 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
  'npm list --depth=0': 'npm list --depth=0 --json',
  'npm outdated': 'npm outdated --json',
  'npm --version': 'npm --version',
  'node --version': 'node --version',
  'npm run preview': 'vite preview --help',
};

app.get('/api/npm/scripts', (_req, res) => {
  res.json({
    success: true,
    availableScripts: [
      { command: 'npm run lint', description: 'Run TypeScript compiler type check without emitting output', type: 'script' },
      { command: 'npm run build', description: 'Compile React production bundle and esbuild Node backend', type: 'build' },
      { command: 'npm list --depth=0', description: 'Inspect installed npm packages & top-level dependency tree', type: 'query' },
      { command: 'npm --version', description: 'Inspect running NPM runtime engine version', type: 'info' },
      { command: 'node --version', description: 'Inspect running Node.js host engine version', type: 'info' },
      { command: 'npm outdated', description: 'Check for outdated npm dependencies in package.json', type: 'audit' },
    ],
  });
});

app.post('/api/npm/run', (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ success: false, error: 'Command string is required' });
  }

  const trimmed = command.trim();
  const allowed = Object.keys(ALLOWED_NPM_COMMANDS).includes(trimmed);

  if (!allowed) {
    return res.status(403).json({
      success: false,
      error: `Command "${trimmed}" is not in the authorized npm execution whitelist. Allowed commands: ${Object.keys(ALLOWED_NPM_COMMANDS).join(', ')}`,
    });
  }

  const startTime = Date.now();
  // Execute within current project root directory
  exec(trimmed, { cwd: process.cwd(), timeout: 45000, maxBuffer: 1024 * 1024 * 4 }, (error, stdout, stderr) => {
    const durationMs = Date.now() - startTime;
    const exitCode = error ? (error.code ?? 1) : 0;

    res.json({
      success: exitCode === 0,
      command: trimmed,
      exitCode,
      durationMs,
      stdout: stdout ? stdout.toString() : '',
      stderr: stderr ? stderr.toString() : (error ? error.message : ''),
      timestamp: Date.now(),
    });
  });
});

// -------------------------------------------------------------
// VITE / STATIC SERVING INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailSafe Adaptive Emergency Server running on http://localhost:${PORT}`);
  });
}

startServer();
