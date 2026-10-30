import React, { useState } from 'react';
import {
  DoorOpen,
  ShieldCheck,
  Flame,
  AlertTriangle,
  HeartPulse,
  Hammer,
  Compass,
  CheckCircle2,
  XCircle,
  LocateFixed,
  ArrowRight,
  Sparkles,
  Train,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { TRAIN_COACHES } from '../data/mockTrainData';
import { ExitDoor, SafetyEquipment } from '../types';
import { CoachBlueprintGraphic } from './CoachBlueprintGraphic';
import { TrainRakeGraphic } from './TrainRakeGraphic';

export const SafetyMapViewer: React.FC = () => {
  const { currentCoach, setCurrentCoach, currentSeat, setCurrentSeat, activeBroadcast, reports } = useEmergency();

  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    type: string;
    description: string;
    action: string;
  } | null>(null);

  const [simulatedBlockDoorId, setSimulatedBlockDoorId] = useState<string | null>(null);

  const activeCoachData = TRAIN_COACHES.find((c) => c.id === currentCoach) || TRAIN_COACHES[4]; // default B6

  // Check if there is active fire or hazard in this coach
  const coachHasHazard =
    (activeBroadcast && (activeBroadcast.affectedCoaches.includes('ALL') || activeBroadcast.affectedCoaches.includes(currentCoach))) ||
    reports.some((r) => r.coach === currentCoach && r.status !== 'resolved' && (r.type === 'fire' || r.type === 'accident'));

  // Calculate nearest exit based on passenger seat position
  const getExitDistances = () => {
    return activeCoachData.exits.map((exit) => {
      const isBlocked =
        exit.isBlocked ||
        simulatedBlockDoorId === exit.id ||
        (coachHasHazard && activeBroadcast?.type === 'fire' && exit.location.includes('front'));

      let effectiveDistance = exit.distanceMeters;
      const isRearSeat = currentSeat.includes('5') || currentSeat.includes('6') || currentSeat.includes('7');
      if (isRearSeat && exit.location.includes('front')) {
        effectiveDistance += 12;
      } else if (!isRearSeat && exit.location.includes('rear')) {
        effectiveDistance += 12;
      }

      return {
        ...exit,
        isBlocked,
        effectiveDistance,
      };
    });
  };

  const processedExits = getExitDistances();
  const safeExits = processedExits.filter((e) => !e.isBlocked);
  const nearestExit = safeExits.sort((a, b) => a.effectiveDistance - b.effectiveDistance)[0] || processedExits[0];

  return (
    <section
      id="safety-map-section"
      className="bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl relative space-y-4"
    >
      {/* Header with Coach Selector & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Adaptive Safety Locations &amp; Exit Door Navigator
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Laser Escape Vector
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Vector-precision coach schematic with animated escape path, breakout windows, and 22-car train rake map.
          </p>
        </div>

        {/* Coach Selector Tab pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Switch Coach:</span>
          {TRAIN_COACHES.map((coach) => (
            <button
              key={coach.id}
              type="button"
              id={`btn-select-coach-${coach.id}`}
              onClick={() => setCurrentCoach(coach.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                currentCoach === coach.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {coach.id}
            </button>
          ))}
        </div>
      </div>

      {/* Longitudinal 22-Car Train Silhouette Heatmap Graphic */}
      <TrainRakeGraphic onSelectCoach={(id) => setCurrentCoach(id)} />

      {/* Nearest Exit Recommendation Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-600/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
            <DoorOpen className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Active Escape Vector
              </span>
              <span className="text-xs text-slate-300 font-mono">
                From: <strong className="text-amber-300">{currentSeat}</strong> in Coach <strong className="text-white">{currentCoach}</strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Nearest Safe Exit: <span className="text-emerald-300">{nearestExit?.name}</span> ({nearestExit?.location})
            </h3>
            <p className="text-xs text-slate-300">
              Distance: <strong className="text-emerald-400">{nearestExit?.effectiveDistance.toFixed(1)} Meters</strong> (~{Math.ceil(nearestExit?.effectiveDistance * 1.4)} steps away). Corridor unobstructed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            id="btn-toggle-door-block-sim"
            onClick={() =>
              setSimulatedBlockDoorId(
                simulatedBlockDoorId === nearestExit?.id ? null : nearestExit?.id
              )
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              simulatedBlockDoorId === nearestExit?.id
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Simulate door hazard to test adaptive re-routing"
          >
            {simulatedBlockDoorId === nearestExit?.id ? 'Clear Simulated Hazard' : 'Simulate Door Blockage'}
          </button>
        </div>
      </div>

      {/* Render Coach High-Precision Vector Blueprint */}
      <CoachBlueprintGraphic
        coachId={activeCoachData.id}
        coachLabel={activeCoachData.label}
        currentSeat={currentSeat}
        onSelectSeat={(seat) => setCurrentSeat(seat)}
        exits={activeCoachData.exits}
        equipments={activeCoachData.equipments}
        hasHazard={!!coachHasHazard}
        hazardType={activeBroadcast?.type || 'fire'}
        simulatedBlockedDoorId={simulatedBlockDoorId}
        onToggleDoorBlock={(doorId) =>
          setSimulatedBlockDoorId(simulatedBlockDoorId === doorId ? null : doorId)
        }
        onSelectEquipment={(eq) =>
          setSelectedItem({
            title: eq.name,
            type: eq.type.replace('_', ' ').toUpperCase(),
            description: eq.locationDesc,
            action:
              eq.type === 'fire_extinguisher'
                ? 'Pull safety pin, aim nozzle at fire base, squeeze handle.'
                : eq.type === 'evacuation_hammer'
                ? 'Strike red tip against tempered window corner firmly to shatter.'
                : 'Open latch to access sterile bandage, antiseptic, and tourniquet.',
          })
        }
      />

      {/* Selected Item Detail Inspector Modal/Drawer */}
      {selectedItem && (
        <div id="inspector-selected-item" className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-xs animate-in fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                {selectedItem.type}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{selectedItem.title}</h4>
              <p className="text-slate-300 mt-1">{selectedItem.description}</p>
              <p className="text-emerald-400 font-semibold mt-1">
                <strong>Emergency Operating Procedure:</strong> {selectedItem.action}
              </p>
            </div>
            <button
              type="button"
              id="btn-close-inspector"
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white px-2.5 py-1 bg-slate-700 rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
