export type EmergencyType =
  | 'fire'
  | 'accident'
  | 'medical'
  | 'overcrowding'
  | 'suspicious'
  | 'extreme_buzzer';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'pending' | 'acknowledged' | 'dispatched' | 'resolving' | 'resolved';

export interface ExitDoor {
  id: string;
  name: string;
  location: 'front-left' | 'front-right' | 'rear-left' | 'rear-right' | 'vestibule-forward' | 'vestibule-rear';
  isBlocked?: boolean;
  blockReason?: string;
  distanceMeters: number;
  nearestToBerths: string[];
}

export interface SafetyEquipment {
  id: string;
  name: string;
  type: 'fire_extinguisher' | 'first_aid' | 'emergency_window' | 'alarm_chain' | 'smoke_detector' | 'evacuation_hammer';
  locationDesc: string;
  gridX: number; // 0 - 100%
  gridY: number; // 0 - 100%
}

export interface CoachData {
  id: string; // e.g. "B6", "A2"
  label: string; // "B6 (AC 3-Tier)"
  classType: '1AC' | '2AC' | '3AC' | 'Sleeper' | 'General' | 'Pantry' | 'Guard';
  totalBerths: number;
  exits: ExitDoor[];
  equipments: SafetyEquipment[];
  currentPassengerCount?: number;
  capacity?: number;
  hasActiveHazard?: boolean;
  hazardType?: EmergencyType;
}

export interface EmergencyReport {
  id: string;
  type: EmergencyType;
  coach: string;
  seatOrLocation: string;
  description: string;
  severity: SeverityLevel;
  timestamp: number;
  status: ReportStatus;
  isBuzzer: boolean;
  affectedCount?: string;
  assignedTeam?: string;
  reporterContact?: string;
  mediaNote?: string;
}

export interface StaffBroadcastAlert {
  id: string;
  title: string;
  type: EmergencyType;
  message: string;
  affectedCoaches: string[]; // ['ALL'] or ['B6', 'B5']
  severity: SeverityLevel;
  timestamp: number;
  exitGuidance: string;
  isActive: boolean;
  soundAlarm: boolean;
  evacuationRecommended: boolean;
}

export interface RescueUnit {
  id: string;
  incidentId: string;
  name: string;
  type: 'medical_rapid' | 'fire_combat' | 'rpf_security' | 'quick_evacuation' | 'train_guard';
  status: 'deploying' | 'en_route' | 'on_scene' | 'resolved';
  etaMinutes: number;
  contactNumber: string;
}

export interface TrainTelemetry {
  trainNumber: string;
  trainName: string;
  currentSpeedKmph: number;
  nextStation: string;
  etaNextStationMin: number;
  totalCoaches: number;
  lastUpdated: number;
  emergencyBrakingStatus: 'normal' | 'caution' | 'emergency_stop_engaged';
}
