import React from 'react';
import { Gauge, Radio, Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export const CockpitTelemetryHUD: React.FC = () => {
  const { telemetry, toggleEmergencyBrakes } = useEmergency();

  // Speed angle calculation (0 to 180 km/h mapped to -120 deg to +120 deg)
  const maxSpeed = 160;
  const speed = Math.min(maxSpeed, Math.max(0, telemetry.currentSpeedKmph));
  const speedAngle = -120 + (speed / maxSpeed) * 240;

  // Brake pressure: 5.0 is normal, 0.0 is emergency dump
  const brakePressure = telemetry.emergencyBrakingStatus === 'emergency_stop_engaged' ? 0.0 : 5.0;
  const brakeAngle = -90 + (brakePressure / 6.0) * 180;

  return (
    <div id="cockpit-hud-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Locomotive Glass Cockpit &amp; Traction Telemetry
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                WAP-7 Microprocessor HUD
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Real-time velocity vector, electro-pneumatic brake pipe pressure, and track radar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleEmergencyBrakes}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
            telemetry.emergencyBrakingStatus === 'emergency_stop_engaged'
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {telemetry.emergencyBrakingStatus === 'emergency_stop_engaged'
              ? 'BRAKES ENGAGED (RELEASE)'
              : 'ENGAGE EMERGENCY BRAKES'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Gauge 1: High-Tech Speedometer */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
            LOCO SPEEDOMETER
          </span>
          <svg viewBox="0 0 200 140" className="w-40 h-28 select-none">
            <defs>
              <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#38bdf8" />
                <stop offset="85%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Dial Arc Track */}
            <path
              d="M 30 115 A 70 70 0 1 1 170 115"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Active Colored Arc */}
            <path
              d="M 30 115 A 70 70 0 1 1 170 115"
              fill="none"
              stroke="url(#speedGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Dial Tick Marks */}
            {[0, 40, 80, 120, 160].map((val) => {
              const angle = -120 + (val / 160) * 240;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + Math.sin(rad) * 62;
              const y1 = 100 - Math.cos(rad) * 62;
              const x2 = 100 + Math.sin(rad) * 52;
              const y2 = 100 - Math.cos(rad) * 52;
              return (
                <line
                  key={val}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth="2"
                />
              );
            })}

            {/* Speed Needle */}
            <g transform={`rotate(${speedAngle} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="38" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
            </g>

            {/* Digital Speed Readout */}
            <text x="100" y="98" fill="white" fontSize="22" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {Math.round(speed)}
            </text>
            <text x="100" y="112" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              KM / H
            </text>
          </svg>
        </div>

        {/* Gauge 2: Brake Pipe Pressure Gauge */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex flex-col items-center justify-center relative">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
            BRAKE PIPE (BP) PRESSURE
          </span>
          <svg viewBox="0 0 200 140" className="w-40 h-28 select-none">
            {/* Dial Arc */}
            <path
              d="M 40 100 A 60 60 0 1 1 160 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 40 100 A 60 60 0 1 1 160 100"
              fill="none"
              stroke={brakePressure > 3 ? '#10b981' : '#ef4444'}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Needle */}
            <g transform={`rotate(${brakeAngle} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="45" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            </g>

            <text x="100" y="96" fill="white" fontSize="20" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {brakePressure.toFixed(1)}
            </text>
            <text x="100" y="110" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              BAR (NORMAL 5.0)
            </text>
          </svg>
        </div>

        {/* Gauge 3: Track Obstacle & Signal Radar Scanner */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex flex-col items-center justify-center relative">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
            TRACK RADAR &amp; CAVITY SCAN
          </span>
          <div className="relative w-28 h-28 rounded-full border-2 border-emerald-500/40 bg-emerald-950/20 flex items-center justify-center overflow-hidden">
            {/* Concentric rings */}
            <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20"></div>
            <div className="absolute w-12 h-12 rounded-full border border-emerald-500/30"></div>
            <div className="absolute w-full h-[1px] bg-emerald-500/30"></div>
            <div className="absolute h-full w-[1px] bg-emerald-500/30"></div>

            {/* Rotating radar sweep beam */}
            <div
              className="absolute inset-0 origin-center animate-[spin_3s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, rgba(16,185,129,0.4) 0deg, transparent 60deg, transparent 360deg)',
              }}
            ></div>

            {/* Blips */}
            <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
            <div className="absolute bottom-8 left-9 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>

            <span className="text-[9px] font-mono font-bold text-emerald-300 z-10 bg-slate-950/80 px-1 rounded">
              CLEAR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
