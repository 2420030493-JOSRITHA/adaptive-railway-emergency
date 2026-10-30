import React, { useState } from 'react';
import {
  Radio,
  Send,
  AlertOctagon,
  Flame,
  HeartPulse,
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Ambulance,
  Gauge,
  Volume2,
  Clock,
  MapPin,
  Sparkles,
  RefreshCw,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyType, SeverityLevel, RescueUnit } from '../types';
import { TRAIN_COACHES } from '../data/mockTrainData';
import { CockpitTelemetryHUD } from './CockpitTelemetryHUD';

export const StaffDashboard: React.FC = () => {
  const {
    reports,
    updateReportStatus,
    sendStaffBroadcast,
    activeBroadcast,
    rescueUnits,
    dispatchRescueUnit,
    telemetry,
    toggleEmergencyBrakes,
    isBuzzerActive,
    silenceBuzzer,
  } = useEmergency();

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('🔥 CRITICAL FIRE WARNING: COACH B6');
  const [broadcastType, setBroadcastType] = useState<EmergencyType>('fire');
  const [selectedCoach, setSelectedCoach] = useState<string>('B6');
  const [broadcastMsg, setBroadcastMsg] = useState(
    'Dense smoke detected in Coach B6 near forward vestibule. Fire combat team deployed. Evacuate immediately.'
  );
  const [exitInstruction, setExitInstruction] = useState(
    'Proceed to Rear Exit Doors 3 & 4 or move towards Coach S1. Cover face with wet cloth.'
  );
  const [broadcastSeverity, setBroadcastSeverity] = useState<SeverityLevel>('critical');
  const [soundAlarm, setSoundAlarm] = useState(true);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const activeReports = reports.filter((r) => r.status !== 'resolved');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sendStaffBroadcast({
      title: broadcastTitle,
      type: broadcastType,
      message: broadcastMsg,
      affectedCoaches: selectedCoach === 'ALL' ? ['ALL'] : [selectedCoach],
      severity: broadcastSeverity,
      exitGuidance: exitInstruction,
      soundAlarm,
      evacuationRecommended: broadcastSeverity === 'critical' || broadcastSeverity === 'high',
    });

    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleTypeSelect = (t: EmergencyType) => {
    setBroadcastType(t);
    if (t === 'fire') {
      setBroadcastTitle(`🔥 FIRE ALERT: COACH ${selectedCoach}`);
      setBroadcastMsg(`Smoke and heat detected in Coach ${selectedCoach}. Fire containment active.`);
      setExitInstruction('Move toward opposite exit doors away from smoke. Follow coach attendants.');
      setBroadcastSeverity('critical');
    } else if (t === 'medical') {
      setBroadcastTitle(`⚕️ MEDICAL EMERGENCY CALL: COACH ${selectedCoach}`);
      setBroadcastMsg(`Medical emergency in progress in Coach ${selectedCoach}. Paramedic responding.`);
      setExitInstruction('Please keep central aisle clear for medical stretcher.');
      setBroadcastSeverity('high');
    } else if (t === 'accident') {
      setBroadcastTitle(`⚠️ ACCIDENT & BRACE ALERT: TRAIN SPEED REDUCING`);
      setBroadcastMsg(`Emergency braking initiated. All passengers brace and hold handrails.`);
      setExitInstruction('Remain in coach until full stop. Locate emergency breakout windows.');
      setBroadcastSeverity('critical');
    } else if (t === 'overcrowding') {
      setBroadcastTitle(`⚠️ OVERCROWDING MANAGEMENT: COACH ${selectedCoach}`);
      setBroadcastMsg(`Heavy congestion at doorways. RPF squad regulating passenger flow.`);
      setExitInstruction('Distribute into seating bays. Do not block vestibule gangways.');
      setBroadcastSeverity('medium');
    } else if (t === 'suspicious') {
      setBroadcastTitle(`🛡️ SECURITY INSPECTION IN PROGRESS`);
      setBroadcastMsg(`RPF Security is inspecting coach ${selectedCoach}. Please remain calm.`);
      setExitInstruction('Stay at your seats and follow RPF officer directions.');
      setBroadcastSeverity('high');
    }
  };

  return (
    <div id="staff-dashboard-root" className="space-y-6">
      {/* Top Banner: Train Master Telemetry & Emergency Brake Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Staff Master Console
              </span>
              <span className="text-xs text-slate-400">Train # {telemetry.trainNumber} (Rajdhani Exp)</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Railway Emergency Response &amp; Broadcast Command
            </h2>
            <p className="text-xs text-slate-300">
              Live communication link with Loco Pilot, Guard, RPF, and all passenger mobile interfaces.
            </p>
          </div>
        </div>

        {/* Emergency Brake Toggle & Quick Telemetry */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs">
            <div className="text-slate-400">Current Speed:</div>
            <div className="text-base font-black text-amber-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              {telemetry.currentSpeedKmph} km/h
            </div>
          </div>

          <button
            type="button"
            id="btn-staff-emergency-brake"
            onClick={toggleEmergencyBrakes}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
              telemetry.emergencyBrakingStatus === 'emergency_stop_engaged'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400'
                : 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-500 shadow-rose-950/60'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>
              {telemetry.emergencyBrakingStatus === 'emergency_stop_engaged'
                ? 'RELEASE EMERGENCY BRAKES'
                : 'ENGAGE EMERGENCY TRAIN STOP'}
            </span>
          </button>
        </div>
      </div>

      {/* Advanced Cockpit Glass HUD & Telemetry */}
      <CockpitTelemetryHUD />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Broadcast to Passengers Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                Broadcast Live Notification to Passenger Mobiles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instantly pops emergency modal on passenger devices with audio siren and exit navigation.
              </p>
            </div>
            {broadcastSuccess && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-pulse flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pushed to Mobiles!
              </span>
            )}
          </div>

          <form onSubmit={handleSendBroadcast} className="mt-4 space-y-4">
            {/* Target Coach & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Coach(es)
                </label>
                <select
                  id="broadcast-target-coach"
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="w-full bg-slate-800 text-amber-300 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:border-amber-400 outline-none"
                >
                  <option value="ALL">🚨 ALL COACHES (Train-wide Broadcast)</option>
                  {TRAIN_COACHES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Severity Level
                </label>
                <select
                  id="broadcast-severity"
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value as SeverityLevel)}
                  className="w-full bg-slate-800 text-slate-200 font-semibold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:border-amber-400 outline-none"
                >
                  <option value="critical">🔴 CRITICAL (Immediate Evacuation)</option>
                  <option value="high">🟠 HIGH (Urgent Caution)</option>
                  <option value="medium">🟡 MEDIUM (Advisory Notice)</option>
                  <option value="low">🟢 LOW (Informational)</option>
                </select>
              </div>
            </div>

            {/* Quick Emergency Type Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Emergency Category
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'fire', label: 'Fire', icon: Flame },
                  { id: 'medical', label: 'Medical', icon: HeartPulse },
                  { id: 'accident', label: 'Accident', icon: AlertTriangle },
                  { id: 'overcrowding', label: 'Overcrowding', icon: Users },
                  { id: 'suspicious', label: 'Suspicious', icon: ShieldAlert },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = broadcastType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`btn-staff-type-${item.id}`}
                      onClick={() => handleTypeSelect(item.id as EmergencyType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Broadcast Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Broadcast Headline
              </label>
              <input
                type="text"
                id="broadcast-title-input"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-800 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:border-amber-400 outline-none"
                required
              />
            </div>

            {/* Broadcast Message */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Message Body for Passengers
              </label>
              <textarea
                id="broadcast-msg-input"
                rows={2}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full bg-slate-800 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:border-amber-400 outline-none resize-none"
                required
              />
            </div>

            {/* Exit / Safety Order */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Specific Exit Door Safety Order
              </label>
              <input
                type="text"
                id="broadcast-exit-order-input"
                value={exitInstruction}
                onChange={(e) => setExitInstruction(e.target.value)}
                placeholder="e.g. Move to Rear Doors 3 & 4. Do not jump."
                className="w-full bg-slate-800 text-amber-300 px-3 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:border-amber-400 outline-none"
              />
            </div>

            {/* Audio alarm checkbox & Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlarm}
                  onChange={(e) => setSoundAlarm(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 w-4 h-4 bg-slate-800"
                />
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Play Intercom Chime &amp; Text-to-Speech Audio to Passengers</span>
              </label>

              <button
                type="submit"
                id="btn-send-staff-broadcast"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST TO MOBILES</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Incoming Reports & SOS Buzzer Alerts Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Buzzer Priority Alert */}
          {isBuzzerActive && (
            <div id="staff-buzzer-alert-card" className="bg-rose-950/90 border-2 border-rose-500 rounded-2xl p-4 text-white shadow-xl animate-pulse">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-mono font-black text-rose-300">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  EMERGENCY SOS BUZZER ACTIVATED
                </span>
                <button
                  type="button"
                  id="btn-staff-silence-buzzer"
                  onClick={silenceBuzzer}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-semibold"
                >
                  Silence Alert
                </button>
              </div>
              <p className="text-xs font-bold mt-1 text-white">
                Passenger pressed instant 1-Click SOS Buzzer!
              </p>
              <p className="text-[11px] text-rose-200 mt-0.5">
                Priority rescue squad dispatched to investigate immediately.
              </p>
            </div>
          )}

          {/* Incident Queue Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Incoming Incident Reports ({activeReports.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Live Feed</span>
            </div>

            <div className="mt-3 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activeReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                  No pending emergency reports. All coaches normal.
                </div>
              ) : (
                activeReports.map((report) => {
                  const isBuzzer = report.isBuzzer;
                  return (
                    <div
                      key={report.id}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        isBuzzer
                          ? 'bg-rose-950/60 border-rose-500 text-slate-100'
                          : report.severity === 'high' || report.severity === 'critical'
                          ? 'bg-slate-800/90 border-amber-500/60 text-slate-200'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                isBuzzer
                                  ? 'bg-rose-600 text-white'
                                  : report.type === 'fire'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : report.type === 'medical'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {report.type.toUpperCase()}
                            </span>
                            <span className="font-bold text-amber-300">
                              Coach {report.coach}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({report.seatOrLocation})
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(report.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-200 leading-snug">
                        {report.description}
                      </p>

                      {report.assignedTeam && (
                        <div className="mt-2 text-[11px] text-sky-300 font-medium flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assigned: {report.assignedTeam}</span>
                        </div>
                      )}

                      {/* Staff Action Buttons for this ticket */}
                      <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {report.status !== 'dispatched' && (
                            <button
                              type="button"
                              id={`btn-dispatch-${report.id}`}
                              onClick={() =>
                                dispatchRescueUnit(
                                  report.id,
                                  report.type === 'medical' ? 'medical_rapid' : 'quick_evacuation',
                                  `Rapid Squad -> Coach ${report.coach}`
                                )
                              }
                              className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] flex items-center gap-1"
                            >
                              <Ambulance className="w-3 h-3" />
                              Dispatch Unit
                            </button>
                          )}

                          <button
                            type="button"
                            id={`btn-resolve-${report.id}`}
                            onClick={() => updateReportStatus(report.id, 'resolved')}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-emerald-700 text-slate-200 hover:text-white font-semibold text-[11px] flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Mark Resolved
                          </button>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 capitalize">
                          Status: {report.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
