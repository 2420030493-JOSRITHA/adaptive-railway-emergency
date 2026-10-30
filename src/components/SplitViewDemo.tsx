import React, { useState } from 'react';
import {
  Smartphone,
  LayoutDashboard,
  Radio,
  Send,
  BellRing,
  Flame,
  DoorOpen,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { StaffDashboard } from './StaffDashboard';
import { PassengerDashboard } from './PassengerDashboard';
import { SafetyGuideModal } from './SafetyGuideModal';

export const SplitViewDemo: React.FC = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { currentCoach } = useEmergency();

  return (
    <div id="split-view-demo-root" className="space-y-4">
      {/* Top Banner explaining the Dual Live Simulation */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-100 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Dual-Role Live Interaction Simulator
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono">
                Staff Broadcast &harr; Passenger Mobile
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Test how an emergency broadcast sent by Railway Staff immediately pops on the passenger's mobile phone screen with alarm sirens and exit directions!
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Railway Staff Station */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Railway Staff / Loco Pilot Command Console</span>
          </div>
          <StaffDashboard />
        </div>

        {/* Right Side: Passenger Mobile View */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>2. Passenger Mobile Device (Coach {currentCoach})</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Live In-App Sync</span>
          </div>
          <PassengerDashboard onOpenGuide={() => setIsGuideOpen(true)} />
        </div>
      </div>

      <SafetyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};
