import { CoachData, TrainTelemetry } from '../types';

export const INITIAL_TRAIN_TELEMETRY: TrainTelemetry = {
  trainNumber: '12951',
  trainName: 'Rajdhani Express Superfast',
  currentSpeedKmph: 110,
  nextStation: 'Kota Junction (Platform 1)',
  etaNextStationMin: 14,
  totalCoaches: 12,
  lastUpdated: Date.now(),
  emergencyBrakingStatus: 'normal',
};

export const TRAIN_COACHES: CoachData[] = [
  {
    id: 'ENG',
    label: 'Locomotive WAP-7',
    classType: 'Guard',
    totalBerths: 0,
    exits: [
      { id: 'e1', name: 'Cabin Left Door', location: 'front-left', distanceMeters: 2, nearestToBerths: [] },
      { id: 'e2', name: 'Cabin Right Door', location: 'front-right', distanceMeters: 2, nearestToBerths: [] },
    ],
    equipments: [
      { id: 'eq1', name: 'CO2 Fire Extinguisher', type: 'fire_extinguisher', locationDesc: 'Behind Driver Console', gridX: 20, gridY: 30 },
      { id: 'eq2', name: 'Main Emergency Brake Valve', type: 'alarm_chain', locationDesc: 'Pilot Panel', gridX: 50, gridY: 20 },
    ],
  },
  {
    id: 'A1',
    label: 'A1 (AC 1st Class)',
    classType: '1AC',
    totalBerths: 24,
    exits: [
      { id: 'e-a1-1', name: 'Forward Vestibule Exit', location: 'vestibule-forward', distanceMeters: 4, nearestToBerths: ['1-8'] },
      { id: 'e-a1-2', name: 'Front Left Platform Door', location: 'front-left', distanceMeters: 3, nearestToBerths: ['1-10'] },
      { id: 'e-a1-3', name: 'Rear Right Platform Door', location: 'rear-right', distanceMeters: 16, nearestToBerths: ['15-24'] },
      { id: 'e-a1-4', name: 'Rear Vestibule Exit to A2', location: 'vestibule-rear', distanceMeters: 18, nearestToBerths: ['18-24'] },
    ],
    equipments: [
      { id: 'eq-a1-1', name: 'Dry Chemical ABC Extinguisher', type: 'fire_extinguisher', locationDesc: 'Near Berth 4 Cabin', gridX: 18, gridY: 15 },
      { id: 'eq-a1-2', name: 'Emergency Window Exit & Hammer', type: 'emergency_window', locationDesc: 'Berth 11-12 Window', gridX: 52, gridY: 82 },
      { id: 'eq-a1-3', name: 'First Aid Trauma Kit', type: 'first_aid', locationDesc: 'Attendant Booth', gridX: 8, gridY: 50 },
      { id: 'eq-a1-4', name: 'Emergency Alarm Chain', type: 'alarm_chain', locationDesc: 'Near Berth 6 & 18', gridX: 65, gridY: 15 },
    ],
  },
  {
    id: 'A2',
    label: 'A2 (AC 2-Tier)',
    classType: '2AC',
    totalBerths: 48,
    exits: [
      { id: 'e-a2-1', name: 'Forward Left Exit Door', location: 'front-left', distanceMeters: 3, nearestToBerths: ['1-12'] },
      { id: 'e-a2-2', name: 'Forward Right Exit Door', location: 'front-right', distanceMeters: 3, nearestToBerths: ['1-12'] },
      { id: 'e-a2-3', name: 'Rear Left Exit Door', location: 'rear-left', distanceMeters: 18, nearestToBerths: ['37-48'] },
      { id: 'e-a2-4', name: 'Rear Right Exit Door', location: 'rear-right', distanceMeters: 18, nearestToBerths: ['37-48'] },
      { id: 'e-a2-5', name: 'Gangway to A1', location: 'vestibule-forward', distanceMeters: 2, nearestToBerths: ['1-6'] },
      { id: 'e-a2-6', name: 'Gangway to B1', location: 'vestibule-rear', distanceMeters: 19, nearestToBerths: ['43-48'] },
    ],
    equipments: [
      { id: 'eq-a2-1', name: 'Fire Extinguisher ABC Type', type: 'fire_extinguisher', locationDesc: 'Front Lavatory Passage', gridX: 12, gridY: 20 },
      { id: 'eq-a2-2', name: 'Emergency Breaker Hammer & Window', type: 'emergency_window', locationDesc: 'Bay 4 (Berth 25-30)', gridX: 55, gridY: 85 },
      { id: 'eq-a2-3', name: 'First Aid Medical Box', type: 'first_aid', locationDesc: 'Coach Manager Panel', gridX: 10, gridY: 78 },
      { id: 'eq-a2-4', name: 'Alarm Chain Pull', type: 'alarm_chain', locationDesc: 'Central Corridor Ceiling', gridX: 50, gridY: 48 },
    ],
  },
  {
    id: 'B1',
    label: 'B1 (AC 3-Tier)',
    classType: '3AC',
    totalBerths: 72,
    exits: [
      { id: 'e-b1-1', name: 'Front Left Main Exit', location: 'front-left', distanceMeters: 2.5, nearestToBerths: ['1-18'] },
      { id: 'e-b1-2', name: 'Front Right Main Exit', location: 'front-right', distanceMeters: 2.5, nearestToBerths: ['1-18'] },
      { id: 'e-b1-3', name: 'Rear Left Main Exit', location: 'rear-left', distanceMeters: 19, nearestToBerths: ['55-72'] },
      { id: 'e-b1-4', name: 'Rear Right Main Exit', location: 'rear-right', distanceMeters: 19, nearestToBerths: ['55-72'] },
    ],
    equipments: [
      { id: 'eq-b1-1', name: 'Fire Extinguisher ABC', type: 'fire_extinguisher', locationDesc: 'Near Door 1', gridX: 14, gridY: 15 },
      { id: 'eq-b1-2', name: 'Emergency Breakout Window', type: 'emergency_window', locationDesc: 'Middle Compartment Bay 5', gridX: 50, gridY: 85 },
      { id: 'eq-b1-3', name: 'First Aid Station', type: 'first_aid', locationDesc: 'Near Conductor Seat', gridX: 10, gridY: 80 },
    ],
  },
  {
    id: 'B5',
    label: 'B5 (AC 3-Tier)',
    classType: '3AC',
    totalBerths: 72,
    exits: [
      { id: 'e-b5-1', name: 'Front Left Door (Near B4)', location: 'front-left', distanceMeters: 3, nearestToBerths: ['1-16'] },
      { id: 'e-b5-2', name: 'Front Right Door (Near B4)', location: 'front-right', distanceMeters: 3, nearestToBerths: ['1-16'] },
      { id: 'e-b5-3', name: 'Rear Left Door (Near B6)', location: 'rear-left', distanceMeters: 18, nearestToBerths: ['56-72'] },
      { id: 'e-b5-4', name: 'Rear Right Door (Near B6)', location: 'rear-right', distanceMeters: 18, nearestToBerths: ['56-72'] },
    ],
    equipments: [
      { id: 'eq-b5-1', name: 'Fire Extinguisher ABC', type: 'fire_extinguisher', locationDesc: 'Front Entrance Wall', gridX: 12, gridY: 15 },
      { id: 'eq-b5-2', name: 'Emergency Window Exit', type: 'emergency_window', locationDesc: 'Berth 33-36 Window', gridX: 50, gridY: 85 },
      { id: 'eq-b5-3', name: 'Alarm Chain', type: 'alarm_chain', locationDesc: 'Mid aisle', gridX: 50, gridY: 50 },
    ],
  },
  {
    id: 'B6',
    label: 'B6 (AC 3-Tier - Priority)',
    classType: '3AC',
    totalBerths: 72,
    currentPassengerCount: 68,
    capacity: 72,
    exits: [
      { id: 'e-b6-1', name: 'Front Left Exit Door', location: 'front-left', distanceMeters: 2.8, nearestToBerths: ['1-16', '1-8 UB/MB/LB'] },
      { id: 'e-b6-2', name: 'Front Right Exit Door', location: 'front-right', distanceMeters: 2.8, nearestToBerths: ['1-16', 'Side Upper/Lower'] },
      { id: 'e-b6-3', name: 'Rear Left Exit Door', location: 'rear-left', distanceMeters: 18.5, nearestToBerths: ['57-72'] },
      { id: 'e-b6-4', name: 'Rear Right Exit Door', location: 'rear-right', distanceMeters: 18.5, nearestToBerths: ['57-72'] },
      { id: 'e-b6-5', name: 'Forward Vestibule Passage (to B5)', location: 'vestibule-forward', distanceMeters: 1.5, nearestToBerths: ['1-6'] },
      { id: 'e-b6-6', name: 'Rear Vestibule Passage (to S1)', location: 'vestibule-rear', distanceMeters: 19.5, nearestToBerths: ['65-72'] },
    ],
    equipments: [
      { id: 'eq-b6-1', name: 'Fire Extinguisher ABC 6kg', type: 'fire_extinguisher', locationDesc: 'Mounted at Forward Vestibule Entry', gridX: 12, gridY: 18 },
      { id: 'eq-b6-2', name: 'Fire Extinguisher ABC 6kg', type: 'fire_extinguisher', locationDesc: 'Mounted at Rear Washroom Area', gridX: 88, gridY: 18 },
      { id: 'eq-b6-3', name: 'Emergency Breakout Window with Hammer', type: 'emergency_window', locationDesc: 'Bay 4 (Berths 25-30)', gridX: 42, gridY: 88 },
      { id: 'eq-b6-4', name: 'Emergency Breakout Window with Hammer', type: 'emergency_window', locationDesc: 'Bay 7 (Berths 49-54)', gridX: 68, gridY: 88 },
      { id: 'eq-b6-5', name: 'First Aid Emergency Trauma Kit', type: 'first_aid', locationDesc: 'Coach Attendant Cabinet near Door 1', gridX: 14, gridY: 80 },
      { id: 'eq-b6-6', name: 'Emergency Alarm Chain Valve', type: 'alarm_chain', locationDesc: 'Ceiling mounted over Bay 3 & Bay 6', gridX: 52, gridY: 48 },
    ],
  },
  {
    id: 'S1',
    label: 'S1 (Sleeper Coach)',
    classType: 'Sleeper',
    totalBerths: 72,
    exits: [
      { id: 'e-s1-1', name: 'Forward Left Door', location: 'front-left', distanceMeters: 3, nearestToBerths: ['1-18'] },
      { id: 'e-s1-2', name: 'Forward Right Door', location: 'front-right', distanceMeters: 3, nearestToBerths: ['1-18'] },
      { id: 'e-s1-3', name: 'Rear Left Door', location: 'rear-left', distanceMeters: 19, nearestToBerths: ['55-72'] },
      { id: 'e-s1-4', name: 'Rear Right Door', location: 'rear-right', distanceMeters: 19, nearestToBerths: ['55-72'] },
    ],
    equipments: [
      { id: 'eq-s1-1', name: 'Fire Extinguisher ABC', type: 'fire_extinguisher', locationDesc: 'Doorway 1 Pillar', gridX: 12, gridY: 18 },
      { id: 'eq-s1-2', name: 'Emergency Alarm Pull Cord', type: 'alarm_chain', locationDesc: 'Overhead Bay 2 & 5', gridX: 45, gridY: 48 },
      { id: 'eq-s1-3', name: 'First Aid Box', type: 'first_aid', locationDesc: 'TTE Desk', gridX: 10, gridY: 78 },
    ],
  },
  {
    id: 'S2',
    label: 'S2 (Sleeper Coach)',
    classType: 'Sleeper',
    totalBerths: 72,
    exits: [
      { id: 'e-s2-1', name: 'Forward Left Door', location: 'front-left', distanceMeters: 3, nearestToBerths: ['1-18'] },
      { id: 'e-s2-2', name: 'Forward Right Door', location: 'front-right', distanceMeters: 3, nearestToBerths: ['1-18'] },
      { id: 'e-s2-3', name: 'Rear Left Door', location: 'rear-left', distanceMeters: 19, nearestToBerths: ['55-72'] },
      { id: 'e-s2-4', name: 'Rear Right Door', location: 'rear-right', distanceMeters: 19, nearestToBerths: ['55-72'] },
    ],
    equipments: [
      { id: 'eq-s2-1', name: 'Fire Extinguisher ABC', type: 'fire_extinguisher', locationDesc: 'Doorway 1 Pillar', gridX: 12, gridY: 18 },
      { id: 'eq-s2-2', name: 'First Aid Box', type: 'first_aid', locationDesc: 'TTE Desk', gridX: 10, gridY: 78 },
    ],
  },
  {
    id: 'PANTRY',
    label: 'PC (Pantry Car)',
    classType: 'Pantry',
    totalBerths: 0,
    exits: [
      { id: 'e-p-1', name: 'Service Door Left', location: 'front-left', distanceMeters: 2, nearestToBerths: [] },
      { id: 'e-p-2', name: 'Service Door Right', location: 'front-right', distanceMeters: 2, nearestToBerths: [] },
      { id: 'e-p-3', name: 'Rear Exit to Sleeper', location: 'vestibule-rear', distanceMeters: 15, nearestToBerths: [] },
    ],
    equipments: [
      { id: 'eq-p-1', name: 'Heavy Duty Kitchen Fire Extinguisher (Wet Chemical)', type: 'fire_extinguisher', locationDesc: 'Galley Stove Zone', gridX: 35, gridY: 20 },
      { id: 'eq-p-2', name: 'CO2 Electrical Fire Extinguisher', type: 'fire_extinguisher', locationDesc: 'Main Power Distribution Panel', gridX: 70, gridY: 20 },
      { id: 'eq-p-3', name: 'Burn Care First Aid Kit', type: 'first_aid', locationDesc: 'Manager Desk', gridX: 15, gridY: 75 },
    ],
  },
  {
    id: 'GUARD',
    label: 'SLR (Guard & Luggage)',
    classType: 'Guard',
    totalBerths: 0,
    exits: [
      { id: 'e-g-1', name: 'Guard Cabin Side Door', location: 'rear-right', distanceMeters: 2, nearestToBerths: [] },
      { id: 'e-g-2', name: 'Luggage Compartment Roll-up Door', location: 'front-left', distanceMeters: 6, nearestToBerths: [] },
    ],
    equipments: [
      { id: 'eq-g-1', name: 'Heavy Emergency Stretcher & Medical Bag', type: 'first_aid', locationDesc: 'Guard Locker', gridX: 30, gridY: 40 },
      { id: 'eq-g-2', name: 'Emergency Signal Flares & Detonator Fog Signals', type: 'alarm_chain', locationDesc: 'Safety Case', gridX: 60, gridY: 40 },
    ],
  },
];

export const SAFETY_PROTOCOLS = [
  {
    id: 'fire',
    title: 'Fire & Smoke Emergency',
    color: 'red',
    icon: 'Flame',
    steps: [
      'Pull the emergency alarm chain immediately if train is moving.',
      'Cover nose and mouth with a wet cloth or handkerchief to avoid toxic smoke inhalation.',
      'Crawl low under smoke toward the nearest exit doors (Front or Rear vestibules).',
      'Never attempt to jump from a speeding train. Locate the emergency breakout window and hammer.',
      'Use the ABC Dry Powder extinguisher mounted near the coach entrance if fire is small.',
    ],
  },
  {
    id: 'medical',
    title: 'Medical Crisis / Heart Attack / Injury',
    color: 'emerald',
    icon: 'HeartPulse',
    steps: [
      'Press the Emergency Buzzer or report emergency with Coach & Berth number.',
      'Check if any on-board doctor or passenger is available via train PA call.',
      'Retrieve the First Aid Kit located at the Coach Attendant / TTE counter.',
      'Keep patient lying down with airway open and feet slightly elevated if conscious.',
      'Railway staff will coordinate immediate ambulance arrival at next station (Kota Jn).',
    ],
  },
  {
    id: 'accident',
    title: 'Derailment / Collision / Impact',
    color: 'amber',
    icon: 'AlertTriangle',
    steps: [
      'Brace yourself: Tuck head between knees or hold firmly onto heavy structural fixtures.',
      'After impact, check yourself and co-passengers for injury before moving.',
      'Do not turn on open flames or lighters due to potential fuel/gas leaks.',
      'Locate emergency exit windows marked with red reflective labels and smash seal using the hammer.',
      'Assist children, elderly, and mobility-impaired passengers first through exit doors.',
    ],
  },
  {
    id: 'overcrowding',
    title: 'Severe Overcrowding / Stampede Risk',
    color: 'indigo',
    icon: 'Users',
    steps: [
      'Report overcrowding so RPF personnel can de-escalate and manage coach vestibules.',
      'Keep your arms folded across your chest in a boxer stance to protect breathing space.',
      'Stay on your feet; if you drop something, do NOT bend down in a packed crowd.',
      'Move diagonally with the flow of the crowd toward open doorways or adjacent coaches.',
    ],
  },
  {
    id: 'suspicious',
    title: 'Unattended Baggage / Suspicious Activity',
    color: 'purple',
    icon: 'ShieldAlert',
    steps: [
      'Do not touch, open, shake, or move any suspicious bag, box, or wire.',
      'Silently report the location (Coach, Berth, under seat) via the app to Railway Police (RPF).',
      'Quietly ask passengers in immediate vicinity to move 2 bays away without causing panic.',
      'Wait for RPF/Bomb Detection Squad stationed on-board to inspect the package.',
    ],
  },
];
