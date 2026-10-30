import React, { useState } from 'react';
import {
  Flame,
  HeartPulse,
  AlertTriangle,
  Users,
  ShieldAlert,
  Send,
  DoorOpen,
  PhoneCall,
  BellRing,
  HelpCircle,
  ShieldCheck,
  Radio,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyBuzzer } from './EmergencyBuzzer';
import { SafetyMapViewer } from './SafetyMapViewer';
import { ReportEmergencyModal } from './ReportEmergencyModal';
import { EmergencyType } from '../types';

interface PassengerDashboardProps {
  onOpenGuide: () => void;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ onOpenGuide }) => {
  const { currentCoach, currentSeat, reports, activeBroadcast } = useEmergency();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedInitialType, setSelectedInitialType] = useState<EmergencyType>('fire');

  const handleOpenReportWithType = (type: EmergencyType) => {
    setSelectedInitialType(type);
    setIsReportModalOpen(true);
  };

  const activeReportsInCoach = reports.filter(
    (r) => r.coach === currentCoach && r.status !== 'resolved'
  );

  return (
    <div id="passenger-dashboard-root" className="space-y-6">
      {/* Passenger Context Greeting Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Passenger Emergency Security Portal
            </span>
            <span className="text-xs text-slate-400">Train # 12951</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Welcome to Coach <span className="text-amber-400">{currentCoach}</span>
          </h2>
          <p className="text-xs text-slate-300">
            Assigned Location: <strong className="text-slate-100">{currentSeat}</strong>. Real-time safety exit monitoring is active.
          </p>
        </div>

        {/* Big Report Button */}
        <button
          type="button"
          id="btn-passenger-main-report"
          onClick={() => {
            setSelectedInitialType('fire');
            setIsReportModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>REPORT EMERGENCY TO STAFF</span>
        </button>
      </div>

      {/* Extreme Emergency 1-Click Buzzer Component */}
      <EmergencyBuzzer />

      {/* Quick Report Emergency Shortcuts by Category */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Report Specific Emergency to Railway Staff
            </h3>
            <p className="text-xs text-slate-400">
              Select category to report details, coach number, and request immediate on-board squad.
            </p>
          </div>
          <button
            type="button"
            id="btn-safety-guide-link"
            onClick={onOpenGuide}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Safety Protocols
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'fire' as EmergencyType, label: 'Fire & Smoke', icon: Flame, color: 'hover:border-red-500 bg-red-500/10 text-red-400 border-red-500/30' },
            { id: 'accident' as EmergencyType, label: 'Accident / Impact', icon: AlertTriangle, color: 'hover:border-amber-500 bg-amber-500/10 text-amber-400 border-amber-500/30' },
            { id: 'medical' as EmergencyType, label: 'Medical Crisis', icon: HeartPulse, color: 'hover:border-emerald-500 bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
            { id: 'overcrowding' as EmergencyType, label: 'Overcrowding', icon: Users, color: 'hover:border-indigo-500 bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
            { id: 'suspicious' as EmergencyType, label: 'Suspicious Activity', icon: ShieldAlert, color: 'hover:border-purple-500 bg-purple-500/10 text-purple-400 border-purple-500/30' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                id={`btn-quick-report-${item.id}`}
                onClick={() => handleOpenReportWithType(item.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all group ${item.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase font-mono font-bold opacity-75">Report</span>
                </div>
                <div className="text-xs font-bold text-white">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Locations & Nearest Exit Door Schematic */}
      <SafetyMapViewer />

      {/* Emergency Contacts & Train Help Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Railway All-India Helpline</div>
            <div className="text-sm font-black text-amber-400 font-mono">139 (Toll Free)</div>
            <div className="text-[11px] text-slate-400">Medical, security, &amp; general distress</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">RPF Train Security Post</div>
            <div className="text-sm font-black text-sky-400 font-mono">182 / CH-4 Intercom</div>
            <div className="text-[11px] text-slate-400">On-board security escort squad</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Coach Manager / TTE</div>
            <div className="text-sm font-black text-slate-200 font-mono">Coach B6 / Berth 7</div>
            <div className="text-[11px] text-slate-400">Trauma kit &amp; key holder</div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportEmergencyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialType={selectedInitialType}
      />
    </div>
  );
};
