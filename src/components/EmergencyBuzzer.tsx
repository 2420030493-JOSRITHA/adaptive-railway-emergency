import React, { useState } from 'react';
import {
  BellRing,
  AlertOctagon,
  ShieldCheck,
  Radio,
  Siren,
  PhoneCall,
  VolumeX,
  Volume2,
  Users,
  CheckCircle2,
  Ambulance,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export const EmergencyBuzzer: React.FC = () => {
  const {
    currentCoach,
    currentSeat,
    isBuzzerActive,
    activeBuzzerIncident,
    triggerExtremeBuzzer,
    silenceBuzzer,
    soundEnabled,
    rescueUnits,
  } = useEmergency();

  const [isPressing, setIsPressing] = useState(false);

  const activeUnitsForBuzzer = rescueUnits.filter(
    (u) => activeBuzzerIncident && u.incidentId === activeBuzzerIncident.id
  );

  const handleBuzzerClick = () => {
    triggerExtremeBuzzer();
  };

  return (
    <div
      id="emergency-buzzer-container"
      className={`rounded-2xl p-5 md:p-6 border transition-all duration-300 ${
        isBuzzerActive
          ? 'bg-rose-950/90 border-rose-600 shadow-2xl shadow-rose-950/80 ring-2 ring-rose-500'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-slate-800 shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Siren className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
              Extreme Emergency SOS Buzzer
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            For critical accidents, severe fires, medical collapses, or immediate danger where you have no time to fill a report. One click alerts the loco pilot, guard, and dispatches rescue immediately.
          </p>
        </div>
      </div>

      {/* Main Buzzer Button Area */}
      {!isBuzzerActive ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
          <div className="relative group">
            {/* Pulsing Outer Rings */}
            <div className="absolute -inset-4 rounded-full bg-rose-600/20 animate-ping duration-1000 group-hover:bg-rose-600/30 pointer-events-none" />
            <div className="absolute -inset-2 rounded-full bg-rose-600/30 blur-md group-hover:bg-rose-500/50 transition-all pointer-events-none" />

            <button
              type="button"
              id="btn-extreme-sos-buzzer"
              onClick={handleBuzzerClick}
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center text-center p-4 transition-all transform active:scale-95 cursor-pointer shadow-2xl ${
                isPressing
                  ? 'bg-gradient-to-b from-rose-700 to-red-900 ring-8 ring-rose-500'
                  : 'bg-gradient-to-b from-rose-500 via-red-600 to-rose-900 hover:from-rose-400 hover:to-red-700 ring-4 ring-rose-400/50 shadow-rose-900/60'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner">
                <BellRing className="w-9 h-9 sm:w-11 sm:h-11 text-white animate-bounce" />
              </div>
              <span className="text-white text-xl sm:text-2xl font-black tracking-wider drop-shadow-md">
                PRESS SOS
              </span>
              <span className="text-rose-100 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mt-0.5">
                Coach {currentCoach}
              </span>
              <span className="text-amber-200 text-[10px] font-medium opacity-90 mt-1">
                Instant Staff Alarm
              </span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-400" />
              Transmits to: Loco Pilot &amp; Guard
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Railway Protection Force (RPF)
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Ambulance className="w-4 h-4 text-emerald-400" />
              Auto-Dispatches Nearest Rescue
            </span>
          </div>
        </div>
      ) : (
        /* Active Buzzer State Banner & Live Response */
        <div id="buzzer-active-live-panel" className="bg-slate-900/90 rounded-xl p-5 border border-rose-500/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white animate-pulse">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-rose-400">
                    EMERGENCY SOS BUZZER ACTIVATED
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold animate-pulse">
                    PRIORITY 1
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Location: <span className="text-amber-300 font-bold">Coach {currentCoach}</span> ({currentSeat}) &bull; Alert transmitted to Central Train Control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-silence-buzzer"
                onClick={silenceBuzzer}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <VolumeX className="w-4 h-4 text-amber-400" />
                Silence Buzzer / Mark Safe
              </button>
            </div>
          </div>

          {/* Rescue units status */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Train Master &amp; Guard</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-slate-200">Alert Confirmed on Driver Console</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Emergency protocol initialized</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>RPF Security &amp; Quick Squad</span>
                <span className="text-[11px] text-amber-400 font-bold">ETA ~1 Min</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Moving toward Coach {currentCoach}</p>
              <p className="text-[11px] text-sky-400 mt-0.5">Clearing vestibule corridors</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Railway Medical Helpline</span>
                <PhoneCall className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-slate-200">Direct Line: 139 / 182</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Next stop ambulance on standby</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
