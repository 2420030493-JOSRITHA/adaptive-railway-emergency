import React from 'react';
import { Train, Flame, AlertCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

interface TrainRakeGraphicProps {
  onSelectCoach?: (coachId: string) => void;
}

export const TrainRakeGraphic: React.FC<TrainRakeGraphicProps> = ({ onSelectCoach }) => {
  const { currentCoach, setCurrentCoach, reports, activeBroadcast } = useEmergency();

  // Full 22-coach train composition
  const coachRake = [
    { id: 'ENG', label: 'WAP-7 Engine', type: 'loco', isSpecial: true },
    { id: 'EOG1', label: 'Power Car 1', type: 'power', isSpecial: true },
    { id: 'H1', label: 'First AC (H1)', type: 'ac1' },
    { id: 'A1', label: '2-Tier AC (A1)', type: 'ac2' },
    { id: 'A2', label: '2-Tier AC (A2)', type: 'ac2' },
    { id: 'A3', label: '2-Tier AC (A3)', type: 'ac2' },
    { id: 'B1', label: '3-Tier AC (B1)', type: 'ac3' },
    { id: 'B2', label: '3-Tier AC (B2)', type: 'ac3' },
    { id: 'B3', label: '3-Tier AC (B3)', type: 'ac3' },
    { id: 'B4', label: '3-Tier AC (B4)', type: 'ac3' },
    { id: 'B5', label: '3-Tier AC (B5)', type: 'ac3' },
    { id: 'B6', label: '3-Tier AC (B6)', type: 'ac3' },
    { id: 'B7', label: '3-Tier AC (B7)', type: 'ac3' },
    { id: 'B8', label: '3-Tier AC (B8)', type: 'ac3' },
    { id: 'PC', label: 'Pantry Car', type: 'pantry', isSpecial: true },
    { id: 'S1', label: 'Sleeper (S1)', type: 'sleeper' },
    { id: 'S2', label: 'Sleeper (S2)', type: 'sleeper' },
    { id: 'S3', label: 'Sleeper (S3)', type: 'sleeper' },
    { id: 'S4', label: 'Sleeper (S4)', type: 'sleeper' },
    { id: 'S5', label: 'Sleeper (S5)', type: 'sleeper' },
    { id: 'EOG2', label: 'Power Car 2', type: 'power', isSpecial: true },
    { id: 'GRD', label: 'Guard Brake Van', type: 'guard', isSpecial: true },
  ];

  const getCoachStatus = (coachId: string) => {
    const hasActiveReport = reports.some(
      (r) => r.coach === coachId && r.status !== 'resolved'
    );
    const hasBroadcast =
      activeBroadcast &&
      (activeBroadcast.affectedCoaches.includes('ALL') ||
        activeBroadcast.affectedCoaches.includes(coachId));

    if (hasBroadcast || (hasActiveReport && reports.some((r) => r.coach === coachId && (r.type === 'fire' || r.type === 'extreme_buzzer')))) {
      return 'hazard';
    }
    if (hasActiveReport) {
      return 'caution';
    }
    return 'normal';
  };

  return (
    <div id="train-rake-graphic-container" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Longitudinal Train Silhouette &amp; Coach Rake Map
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono">
                Train 12952 (22 Cars)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Live heat-map of emergency events and passenger density across the full rake.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Alert
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Hazard
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Scrollable Rake Visualization */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="min-w-[980px] flex items-end gap-1.5 px-1">
          {coachRake.map((c) => {
            const status = getCoachStatus(c.id);
            const isSelected = currentCoach === c.id;
            const isLoco = c.id === 'ENG';

            return (
              <button
                key={c.id}
                type="button"
                id={`btn-rake-coach-${c.id}`}
                onClick={() => {
                  if (!c.isSpecial || c.id === 'PC') {
                    setCurrentCoach(c.id);
                    onSelectCoach?.(c.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-between rounded-t-xl transition-all duration-200 select-none group ${
                  isLoco
                    ? 'w-24 h-24 bg-gradient-to-b from-sky-800 to-slate-900 border-2 border-sky-400 text-white shadow-lg cursor-default'
                    : 'w-16 h-20 border text-xs cursor-pointer ' +
                      (status === 'hazard'
                        ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                        : status === 'caution'
                        ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                        : isSelected
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750')
                }`}
              >
                {/* Pantograph / Roof detail for Locomotive */}
                {isLoco && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 border-t-2 border-x-2 border-amber-400 rounded-t-sm">
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-amber-300"></span>
                  </div>
                )}

                {/* Coach Roof Strip */}
                <div className="w-full h-2 bg-slate-700/50 rounded-t-lg border-b border-slate-600/40"></div>

                {/* Status Indicator Icon */}
                <div className="my-auto flex flex-col items-center">
                  {status === 'hazard' ? (
                    <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                  ) : status === 'caution' ? (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  ) : isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-400"></div>
                  )}

                  <span className="font-bold text-[11px] mt-1 tracking-tight">
                    {c.id}
                  </span>
                  <span className="text-[9px] opacity-70 font-mono truncate max-w-[55px]">
                    {c.type.toUpperCase()}
                  </span>
                </div>

                {/* Bogie Wheels at bottom */}
                <div className="w-full flex justify-around px-1 py-1 border-t border-slate-700/50 bg-slate-950/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400"></div>
                </div>

                {/* "Current" badge if selected */}
                {isSelected && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded shadow">
                    YOU
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rail Track Graphic underneath */}
      <div className="relative h-2 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#475569,#475569_8px,#1e293b_8px,#1e293b_18px)] opacity-60"></div>
      </div>
    </div>
  );
};
