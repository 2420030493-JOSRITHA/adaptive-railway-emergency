import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EmergencyReport,
  StaffBroadcastAlert,
  EmergencyType,
  SeverityLevel,
  RescueUnit,
  TrainTelemetry,
} from '../types';
import { INITIAL_TRAIN_TELEMETRY, TRAIN_COACHES } from '../data/mockTrainData';
import { audioService } from '../utils/audioAlert';

interface EmergencyContextType {
  // Passenger state
  currentCoach: string;
  setCurrentCoach: (coach: string) => void;
  currentSeat: string;
  setCurrentSeat: (seat: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  role: 'passenger' | 'staff' | 'split';
  setRole: (role: 'passenger' | 'staff' | 'split') => void;

  // Emergency & Buzzer State
  isBuzzerActive: boolean;
  activeBuzzerIncident: EmergencyReport | null;
  triggerExtremeBuzzer: (customCoach?: string) => void;
  silenceBuzzer: () => void;

  // Reports
  reports: EmergencyReport[];
  submitEmergencyReport: (data: {
    type: EmergencyType;
    coach: string;
    seatOrLocation: string;
    description: string;
    severity?: SeverityLevel;
    affectedCount?: string;
  }) => EmergencyReport;
  updateReportStatus: (reportId: string, status: EmergencyReport['status'], assignedTeam?: string) => void;

  // Staff Broadcasts (Push Notifications to Passengers)
  activeBroadcast: StaffBroadcastAlert | null;
  broadcastHistory: StaffBroadcastAlert[];
  sendStaffBroadcast: (alertData: Omit<StaffBroadcastAlert, 'id' | 'timestamp' | 'isActive'>) => void;
  dismissBroadcastForPassenger: () => void;

  // Rescue Units
  rescueUnits: RescueUnit[];
  dispatchRescueUnit: (incidentId: string, unitType: RescueUnit['type'], unitName: string) => void;

  // Train Telemetry
  telemetry: TrainTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<TrainTelemetry>>;
  toggleEmergencyBrakes: () => void;

  // Simulated quick actions
  triggerSimulatedScenario: (scenario: 'fire_b6' | 'medical_a2' | 'stampede_s1' | 'suspicious_pantry') => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCoach, setCurrentCoach] = useState<string>('B6');
  const [currentSeat, setCurrentSeat] = useState<string>('Berth 28 (Middle)');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [role, setRole] = useState<'passenger' | 'staff' | 'split'>('passenger');

  const [isBuzzerActive, setIsBuzzerActive] = useState<boolean>(false);
  const [activeBuzzerIncident, setActiveBuzzerIncident] = useState<EmergencyReport | null>(null);

  const [reports, setReports] = useState<EmergencyReport[]>([
    {
      id: 'rep-init-1',
      type: 'medical',
      coach: 'A2',
      seatOrLocation: 'Berth 14 (Lower)',
      description: 'Senior citizen experiencing sudden shortness of breath and chest discomfort.',
      severity: 'high',
      timestamp: Date.now() - 6 * 60 * 1000,
      status: 'dispatched',
      isBuzzer: false,
      affectedCount: '1 person',
      assignedTeam: 'Dr. R. Sharma & Paramedic Unit 1',
    },
  ]);

  const [activeBroadcast, setActiveBroadcast] = useState<StaffBroadcastAlert | null>(null);
  const [broadcastHistory, setBroadcastHistory] = useState<StaffBroadcastAlert[]>([]);

  const [rescueUnits, setRescueUnits] = useState<RescueUnit[]>([
    {
      id: 'ru-1',
      incidentId: 'rep-init-1',
      name: 'On-Board Medical Emergency Rapid Response',
      type: 'medical_rapid',
      status: 'en_route',
      etaMinutes: 2,
      contactNumber: '+91 98450 11223',
    },
  ]);

  const [telemetry, setTelemetry] = useState<TrainTelemetry>(INITIAL_TRAIN_TELEMETRY);

  // Handle extreme 1-click buzzer
  const triggerExtremeBuzzer = (customCoach?: string) => {
    const targetCoach = customCoach || currentCoach;
    const newReport: EmergencyReport = {
      id: `buzzer-${Date.now()}`,
      type: 'extreme_buzzer',
      coach: targetCoach,
      seatOrLocation: `${currentSeat || 'General Area'} (CRITICAL 1-TAP SOS BUZZER)`,
      description: `🚨 CRITICAL EMERGENCY BUZZER PRESSED in Coach ${targetCoach}! Immediate rescue dispatch requested by passenger.`,
      severity: 'critical',
      timestamp: Date.now(),
      status: 'pending',
      isBuzzer: true,
      affectedCount: 'Immediate Risk',
      assignedTeam: 'RPF Quick Reaction Force & Guard',
    };

    setReports((prev) => [newReport, ...prev]);
    setIsBuzzerActive(true);
    setActiveBuzzerIncident(newReport);

    // Also auto-dispatch urgent units
    const newUnit: RescueUnit = {
      id: `ru-buzz-${Date.now()}`,
      incidentId: newReport.id,
      name: `Emergency Rescue Squad -> Coach ${targetCoach}`,
      type: 'quick_evacuation',
      status: 'deploying',
      etaMinutes: 1,
      contactNumber: 'Railway Control: 139 / +91 11 2334 0000',
    };
    setRescueUnits((prev) => [newUnit, ...prev]);

    if (soundEnabled) {
      audioService.playBuzzerSound();
      audioService.startContinuousSiren();
    }
  };

  const silenceBuzzer = () => {
    setIsBuzzerActive(false);
    audioService.stopContinuousSiren();
  };

  // Submit standard passenger emergency report
  const submitEmergencyReport = (data: {
    type: EmergencyType;
    coach: string;
    seatOrLocation: string;
    description: string;
    severity?: SeverityLevel;
    affectedCount?: string;
  }) => {
    const newReport: EmergencyReport = {
      id: `rep-${Date.now()}`,
      type: data.type,
      coach: data.coach,
      seatOrLocation: data.seatOrLocation,
      description: data.description,
      severity: data.severity || 'high',
      timestamp: Date.now(),
      status: 'pending',
      isBuzzer: false,
      affectedCount: data.affectedCount || 'Multiple passengers',
    };

    setReports((prev) => [newReport, ...prev]);

    if (soundEnabled) {
      audioService.playBuzzerSound();
    }

    return newReport;
  };

  const updateReportStatus = (reportId: string, status: EmergencyReport['status'], assignedTeam?: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              status,
              assignedTeam: assignedTeam !== undefined ? assignedTeam : rep.assignedTeam,
            }
          : rep
      )
    );
  };

  // Staff Sends Emergency Broadcast (Pushes directly to passenger view!)
  const sendStaffBroadcast = (alertData: Omit<StaffBroadcastAlert, 'id' | 'timestamp' | 'isActive'>) => {
    const newBroadcast: StaffBroadcastAlert = {
      ...alertData,
      id: `bc-${Date.now()}`,
      timestamp: Date.now(),
      isActive: true,
    };

    setActiveBroadcast(newBroadcast);
    setBroadcastHistory((prev) => [newBroadcast, ...prev]);

    if (soundEnabled && newBroadcast.soundAlarm) {
      audioService.playIntercomChime();
      setTimeout(() => {
        audioService.speakAnnouncement(
          `Attention all passengers. Emergency alert in ${
            newBroadcast.affectedCoaches.includes('ALL') ? 'all coaches' : newBroadcast.affectedCoaches.join(', ')
          }. ${newBroadcast.title}. ${newBroadcast.exitGuidance || 'Please follow instructions and move toward safety exit doors.'}`
        );
      }, 700);
    }
  };

  const dismissBroadcastForPassenger = () => {
    setActiveBroadcast(null);
  };

  const dispatchRescueUnit = (incidentId: string, unitType: RescueUnit['type'], unitName: string) => {
    const newUnit: RescueUnit = {
      id: `ru-${Date.now()}`,
      incidentId,
      name: unitName,
      type: unitType,
      status: 'en_route',
      etaMinutes: 3,
      contactNumber: 'Train Control Comms: CH-4',
    };
    setRescueUnits((prev) => [newUnit, ...prev]);
    updateReportStatus(incidentId, 'dispatched', unitName);
  };

  const toggleEmergencyBrakes = () => {
    setTelemetry((prev) => {
      const isCurrentlyBraking = prev.emergencyBrakingStatus === 'emergency_stop_engaged';
      return {
        ...prev,
        emergencyBrakingStatus: isCurrentlyBraking ? 'normal' : 'emergency_stop_engaged',
        currentSpeedKmph: isCurrentlyBraking ? 110 : 0,
      };
    });
  };

  // Quick Scenarios for Demonstration / Testing
  const triggerSimulatedScenario = (scenario: 'fire_b6' | 'medical_a2' | 'stampede_s1' | 'suspicious_pantry') => {
    if (scenario === 'fire_b6') {
      sendStaffBroadcast({
        title: '🔥 SMOKE & FIRE DETECTED IN COACH B6',
        type: 'fire',
        severity: 'critical',
        affectedCoaches: ['B6', 'B5'],
        message: 'Dense smoke reported near forward vestibule of Coach B6. Train fire squad has been deployed.',
        exitGuidance: 'Evacuate toward Rear Exit Doors (Door 3 & Door 4) or move back into Coach S1. Cover mouth with wet cloth.',
        soundAlarm: true,
        evacuationRecommended: true,
      });
    } else if (scenario === 'medical_a2') {
      sendStaffBroadcast({
        title: '⚕️ MEDICAL EMERGENCY CALL: COACH A2',
        type: 'medical',
        severity: 'high',
        affectedCoaches: ['A2', 'A1', 'B1'],
        message: 'Doctor / Medical professional urgently required in Coach A2, Berth 14. First aid response deployed.',
        exitGuidance: 'Please keep central corridor unobstructed for paramedic staff with stretcher.',
        soundAlarm: true,
        evacuationRecommended: false,
      });
    } else if (scenario === 'stampede_s1') {
      sendStaffBroadcast({
        title: '⚠️ OVERCROWDING & BOTTLENECK ALERT: COACH S1',
        type: 'overcrowding',
        severity: 'medium',
        affectedCoaches: ['S1', 'S2'],
        message: 'Excess crowd accumulation near S1 doorway. RPF staff moving in for crowd dispersal.',
        exitGuidance: 'Do not rush exit gates. Distribute evenly into seating bays.',
        soundAlarm: true,
        evacuationRecommended: false,
      });
    } else if (scenario === 'suspicious_pantry') {
      sendStaffBroadcast({
        title: '🛡️ SECURITY ALERT: UNATTENDED PACKAGE IN PANTRY',
        type: 'suspicious',
        severity: 'high',
        affectedCoaches: ['PANTRY', 'S1'],
        message: 'Unattended parcel found in Pantry Car vestibule. RPF Security team conducting immediate inspection.',
        exitGuidance: 'Avoid visiting pantry car. Remain seated in your designated berths.',
        soundAlarm: true,
        evacuationRecommended: false,
      });
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        currentCoach,
        setCurrentCoach,
        currentSeat,
        setCurrentSeat,
        soundEnabled,
        setSoundEnabled,
        role,
        setRole,
        isBuzzerActive,
        activeBuzzerIncident,
        triggerExtremeBuzzer,
        silenceBuzzer,
        reports,
        submitEmergencyReport,
        updateReportStatus,
        activeBroadcast,
        broadcastHistory,
        sendStaffBroadcast,
        dismissBroadcastForPassenger,
        rescueUnits,
        dispatchRescueUnit,
        telemetry,
        setTelemetry,
        toggleEmergencyBrakes,
        triggerSimulatedScenario,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
