import React from 'react';
import {
  Bell,
  AlertTriangle,
  Flame,
  HeartPulse,
  Users,
  ShieldAlert,
  DoorOpen,
  Volume2,
  X,
  Radio,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { audioService } from '../utils/audioAlert';

interface PassengerAlertPopupProps {
  onFocusExitMap?: () => void;
}

export const PassengerAlertPopup: React.FC<PassengerAlertPopupProps> = ({ onFocusExitMap }) => {
  const {
    activeBroadcast,
    dismissBroadcastForPassenger,
    currentCoach,
    soundEnabled,
  } = useEmergency();

  if (!activeBroadcast) return null;

  const isCurrentCoachAffected =
    activeBroadcast.affectedCoaches.includes('ALL') ||
    activeBroadcast.affectedCoaches.includes(currentCoach);

  const getIcon = () => {
    switch (activeBroadcast.type) {
      case 'fire':
        return Flame;
      case 'medical':
        return HeartPulse;
      case 'overcrowding':
        return Users;
      case 'suspicious':
        return ShieldAlert;
      default:
        return AlertTriangle;
    }
  };

  const IconComponent = getIcon();

  const handleReplayVoice = () => {
    if (soundEnabled) {
      audioService.playIntercomChime();
      setTimeout(() => {
        audioService.speakAnnouncement(
          `Attention passengers in coach ${currentCoach}. ${activeBroadcast.title}. ${activeBroadcast.exitGuidance}`
        );
      }, 500);
    }
  };

  const handleViewExits = () => {
    if (onFocusExitMap) {
      onFocusExitMap();
    }
    const mapEl = document.getElementById('safety-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="passenger-mobile-alert-popup"
      className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[480px] z-50 animate-bounce-short"
    >
      <div
        className={`rounded-2xl p-4 md:p-5 shadow-2xl border backdrop-blur-md transition-all ${
          activeBroadcast.severity === 'critical'
            ? 'bg-rose-950/95 border-rose-500 text-white shadow-rose-950/80 ring-2 ring-rose-500'
            : activeBroadcast.severity === 'high'
            ? 'bg-amber-950/95 border-amber-500 text-white shadow-amber-950/80 ring-2 ring-amber-500'
            : 'bg-slate-900/95 border-sky-500 text-white shadow-sky-950/80'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl flex items-center justify-center animate-pulse ${
                activeBroadcast.severity === 'critical'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              <IconComponent className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 border border-white/20">
                  Railway Staff Broadcast
                </span>
                {isCurrentCoachAffected && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white animate-ping">
                    YOUR COACH AFFECTED
                  </span>
                )}
              </div>
              <h4 className="text-base font-black text-white mt-1 leading-snug">
                {activeBroadcast.title}
              </h4>
            </div>
          </div>

          <button
            type="button"
            id="btn-dismiss-alert-popup"
            onClick={dismissBroadcastForPassenger}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Acknowledge and Dismiss Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Broadcast Body */}
        <div className="mt-3 text-xs text-slate-200 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10">
          <p>{activeBroadcast.message}</p>
          {activeBroadcast.exitGuidance && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-start gap-2 text-amber-300 font-semibold">
              <DoorOpen className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>Safety Exit Order: {activeBroadcast.exitGuidance}</span>
            </div>
          )}
        </div>

        {/* Affected Coaches info & Voice button */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Affected: {activeBroadcast.affectedCoaches.join(', ')}
          </span>
          <button
            type="button"
            id="btn-replay-voice-alert"
            onClick={handleReplayVoice}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Hear Audio Broadcast
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            id="btn-view-nearest-exits"
            onClick={handleViewExits}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <DoorOpen className="w-4 h-4" />
            <span>Show Nearest Exit Doors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="btn-ack-safe-dismiss"
            onClick={dismissBroadcastForPassenger}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
