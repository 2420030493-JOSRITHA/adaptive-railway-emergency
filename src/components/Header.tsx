import React, { useState } from 'react';
import {
  Train,
  Volume2,
  VolumeX,
  Radio,
  HelpCircle,
  Smartphone,
  LayoutDashboard,
  Columns,
  Gauge,
  MapPin,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { TRAIN_COACHES } from '../data/mockTrainData';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onOpenReport }) => {
  const {
    currentCoach,
    setCurrentCoach,
    currentSeat,
    setCurrentSeat,
    soundEnabled,
    setSoundEnabled,
    role,
    setRole,
    isBuzzerActive,
    activeBroadcast,
    reports,
    telemetry,
  } = useEmergency();

  const [isEditingSeat, setIsEditingSeat] = useState(false);
  const [tempSeat, setTempSeat] = useState(currentSeat);

  const activeReportsCount = reports.filter((r) => r.status !== 'resolved').length;
  const hasCriticalEmergency = isBuzzerActive || (activeBroadcast && activeBroadcast.severity === 'critical');

  const handleSeatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSeat.trim()) {
      setCurrentSeat(tempSeat.trim());
      setIsEditingSeat(false);
    }
  };

  return (
    <header id="main-header" className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top emergency ticker bar if active */}
      {hasCriticalEmergency && (
        <div id="emergency-banner-ticker" className="bg-rose-600 text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 shrink-0 text-amber-300 animate-bounce" />
            <span>
              CRITICAL EMERGENCY IN PROGRESS &bull; Train # {telemetry.trainNumber} &bull; Check Coach Safety Exit Doors &amp; Follow Staff Instructions
            </span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">
            Live Alert Active
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and Train Metadata */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  RailSafe <span className="text-amber-400 font-normal text-sm">Adaptive Railway Emergency Portal</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="text-slate-200 font-medium">{telemetry.trainName} ({telemetry.trainNumber})</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  {telemetry.emergencyBrakingStatus === 'emergency_stop_engaged' ? (
                    <span className="text-rose-400 font-bold">EMERGENCY BRAKE ENGAGED (0 km/h)</span>
                  ) : (
                    <span>{telemetry.currentSpeedKmph} km/h</span>
                  )}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Next: {telemetry.nextStation} (~{telemetry.etaNextStationMin}m)
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Role switch, Coach & Seat picker, Sound & Guide */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Passenger Coach & Seat Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs">
              <span className="text-slate-400 font-medium">My Coach:</span>
              <select
                id="header-coach-select"
                aria-label="Select your train coach"
                value={currentCoach}
                onChange={(e) => setCurrentCoach(e.target.value)}
                className="bg-slate-900 text-amber-300 font-bold px-2 py-0.5 rounded border border-slate-600 text-xs focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
              >
                {TRAIN_COACHES.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.label}
                  </option>
                ))}
              </select>

              {isEditingSeat ? (
                <form onSubmit={handleSeatSubmit} className="flex items-center gap-1 ml-1">
                  <input
                    type="text"
                    value={tempSeat}
                    onChange={(e) => setTempSeat(e.target.value)}
                    placeholder="e.g. Berth 18"
                    className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-xs border border-amber-500 w-24 outline-none"
                    autoFocus
                  />
                  <button type="submit" className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold">
                    OK
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  id="btn-edit-seat"
                  onClick={() => setIsEditingSeat(true)}
                  className="text-slate-300 hover:text-white underline decoration-dotted text-xs ml-1"
                  title="Click to change your berth/seat location"
                >
                  {currentSeat}
                </button>
              )}
            </div>

            {/* Role Mode Selector */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
              <button
                type="button"
                id="btn-role-passenger"
                onClick={() => setRole('passenger')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  role === 'passenger'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Passenger Mobile Interface"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Passenger App</span>
                <span className="sm:hidden">Passenger</span>
              </button>

              <button
                type="button"
                id="btn-role-staff"
                onClick={() => setRole('staff')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all relative ${
                  role === 'staff'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Railway Staff / Loco Pilot Command Station"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Staff Command</span>
                <span className="sm:hidden">Staff</span>
                {activeReportsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeReportsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="btn-role-split"
                onClick={() => setRole('split')}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  role === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Dual Split View (Staff Broadcast & Passenger Mobile side-by-side)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Dual Demo</span>
              </button>
            </div>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              id="btn-toggle-sound"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
              }`}
              title={soundEnabled ? 'Siren & Voice Alarm Enabled' : 'Siren Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Guide modal button */}
            <button
              type="button"
              id="btn-open-safety-guide"
              onClick={onOpenGuide}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
              title="Railway Emergency Protocols & Safety Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
