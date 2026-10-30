import React, { useState } from 'react';
import {
  X,
  Flame,
  AlertTriangle,
  HeartPulse,
  Users,
  ShieldAlert,
  HelpCircle,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { EmergencyType, SeverityLevel } from '../types';
import { useEmergency } from '../context/EmergencyContext';
import { TRAIN_COACHES } from '../data/mockTrainData';

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: EmergencyType;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
  isOpen,
  onClose,
  initialType = 'fire',
}) => {
  const { currentCoach, currentSeat, submitEmergencyReport } = useEmergency();

  const [emergencyType, setEmergencyType] = useState<EmergencyType>(initialType);
  const [coach, setCoach] = useState<string>(currentCoach || 'B6');
  const [locationDetail, setLocationDetail] = useState<string>(currentSeat || 'Berth 28');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [affectedCount, setAffectedCount] = useState<string>('1-3 passengers');
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  if (!isOpen) return null;

  const emergencyTypesList = [
    {
      id: 'fire' as EmergencyType,
      label: 'Fire & Smoke',
      sub: 'Open flame, dense smoke, spark',
      icon: Flame,
      color: 'bg-red-500/10 text-red-500 border-red-500/30 hover:border-red-500 hover:bg-red-500/20',
      activeColor: 'bg-red-500/20 text-red-400 border-red-500 ring-2 ring-red-500',
    },
    {
      id: 'accident' as EmergencyType,
      label: 'Accident / Impact',
      sub: 'Derailment, track shock, collision',
      icon: AlertTriangle,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/20',
      activeColor: 'bg-amber-500/20 text-amber-400 border-amber-500 ring-2 ring-amber-500',
    },
    {
      id: 'medical' as EmergencyType,
      label: 'Medical Emergency',
      sub: 'Heart attack, unconsciousness, injury',
      icon: HeartPulse,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/20',
      activeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500',
    },
    {
      id: 'overcrowding' as EmergencyType,
      label: 'Overcrowding / Stampede',
      sub: 'Blocked doorway, crush risk',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/20',
      activeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500 ring-2 ring-indigo-500',
    },
    {
      id: 'suspicious' as EmergencyType,
      label: 'Suspicious Activity',
      sub: 'Unattended bag, harassment, threat',
      icon: ShieldAlert,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/20',
      activeColor: 'bg-purple-500/20 text-purple-400 border-purple-500 ring-2 ring-purple-500',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDesc =
      description.trim() ||
      `${emergencyType.toUpperCase()} incident reported in Coach ${coach} near ${locationDetail}. Rapid assistance requested.`;

    const report = submitEmergencyReport({
      type: emergencyType,
      coach,
      seatOrLocation: locationDetail,
      description: finalDesc,
      severity,
      affectedCount,
    });

    setSubmittedReportId(report.id);
  };

  const handleResetAndClose = () => {
    setSubmittedReportId(null);
    setDescription('');
    onClose();
  };

  return (
    <div
      id="modal-report-emergency-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="modal-report-emergency-card"
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-7 text-slate-100 shadow-2xl relative my-6"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-report-modal"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedReportId ? (
          /* Confirmation Screen */
          <div id="report-submitted-success" className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Emergency Report Transmitted to Staff
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
              Your report for <strong className="text-amber-400">{emergencyType.toUpperCase()}</strong> in <strong className="text-amber-400">Coach {coach}</strong> ({locationDetail}) has been prioritized on the Main Train Staff &amp; RPF Console.
            </p>

            <div className="bg-slate-800/80 rounded-xl p-4 max-w-md mx-auto my-5 text-left border border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Incident Ticket:</span>
                <span className="font-mono text-amber-300 font-bold">{submittedReportId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Team:</span>
                <span className="text-emerald-400 font-semibold">RPF Rapid Response &amp; Guard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Response:</span>
                <span className="text-sky-300 font-semibold">&lt; 2 Minutes</span>
              </div>
              <div className="pt-2 border-t border-slate-700 text-slate-300">
                <strong>Next Safety Step:</strong> Check the safety exit map on your screen to identify the closest unblocked exit doors.
              </div>
            </div>

            <button
              type="button"
              id="btn-done-submitted-report"
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-colors"
            >
              View Coach Safety Exit Doors
            </button>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Report Railway Emergency
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Provide quick details so the railway command staff and on-board emergency teams can arrive at your exact coach location immediately.
              </p>
            </div>

            {/* Step 1: Emergency Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Choose Emergency Type <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {emergencyTypesList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = emergencyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`btn-type-${item.id}`}
                      onClick={() => setEmergencyType(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected ? item.activeColor : item.color
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5 leading-snug">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location (Coach & Berth) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  2. Coach Location (e.g. B6, A2) <span className="text-rose-400">*</span>
                </label>
                <select
                  id="report-coach-select"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="w-full bg-slate-800 text-amber-300 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                  required
                >
                  {TRAIN_COACHES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Specific Spot / Berth / Seat
                </label>
                <input
                  type="text"
                  id="report-berth-input"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="e.g. Berth 28 / Lavatory 1 / Vestibule"
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Step 3: Severity & Affected Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Severity Level
                </label>
                <div className="flex items-center gap-2">
                  {(['critical', 'high', 'medium', 'low'] as SeverityLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      id={`btn-severity-${level}`}
                      onClick={() => setSeverity(level)}
                      className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all ${
                        severity === level
                          ? level === 'critical'
                            ? 'bg-rose-600 text-white border-rose-500'
                            : level === 'high'
                            ? 'bg-amber-600 text-white border-amber-500'
                            : level === 'medium'
                            ? 'bg-sky-600 text-white border-sky-500'
                            : 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estimated People Affected
                </label>
                <select
                  id="report-affected-select"
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 text-sm focus:border-amber-400 outline-none"
                >
                  <option value="1 person">1 Person (Isolated)</option>
                  <option value="2-5 passengers">2-5 Passengers</option>
                  <option value="Entire Bay / Half Coach">Entire Bay (10-20 People)</option>
                  <option value="Entire Coach Risk">Entire Coach / Spreading</option>
                </select>
              </div>
            </div>

            {/* Step 4: Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>3. Details / Message for Rescue Staff (Optional)</span>
                <span className="text-[10px] text-slate-500 font-normal">Keep brief for fastest action</span>
              </label>
              <textarea
                id="report-description-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Smoke coming from AC vent near berth 30, passenger has difficulty breathing. Extinguisher needed."
                className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="btn-cancel-report"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-emergency-report"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/50 flex items-center gap-2 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                Submit Report to Railway Staff
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
