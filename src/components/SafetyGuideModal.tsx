import React, { useState } from 'react';
import {
  X,
  BookOpen,
  BellRing,
  DoorOpen,
  Radio,
  Ambulance,
  Flame,
  HeartPulse,
  AlertTriangle,
  Users,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SAFETY_PROTOCOLS } from '../data/mockTrainData';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'protocols'>('workflow');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('fire');

  if (!isOpen) return null;

  const currentProtocol = SAFETY_PROTOCOLS.find((p) => p.id === selectedProtocolId) || SAFETY_PROTOCOLS[0];

  const steps = [
    {
      number: '01',
      title: 'Report Incident or Press 1-Tap SOS Buzzer',
      desc: 'If time permits, click "Report Emergency", choose the type (Fire, Medical, Accident, Overcrowding, Suspicious), enter your Coach (e.g. B6, A2), and submit. In extreme life-or-death situations, click the Red SOS Buzzer for instant 1-tap transmission.',
      icon: BellRing,
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    },
    {
      number: '02',
      title: 'Instant Mobile Alert & Voice Broadcast',
      desc: 'When railway staff sends an emergency message or an SOS is triggered, a high-priority push notification pops up on passenger mobile screens with an audible siren and voice announcement.',
      icon: Radio,
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    },
    {
      number: '03',
      title: 'Follow Adaptive Nearest Exit Door Navigator',
      desc: 'The portal computes the shortest unobstructed evacuation path from your berth to the closest exit doors (Front/Rear doors or breakout windows). Dynamic hazards automatically re-route you.',
      icon: DoorOpen,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    },
    {
      number: '04',
      title: 'Rapid Rescue & Medical Unit Dispatch',
      desc: 'Train Loco Pilot, Guard, and Railway Protection Force (RPF) receive your exact coach coordinates. On-board doctors and fire squads are dispatched within 1-2 minutes, and city ambulances await at the next station.',
      icon: Ambulance,
      color: 'text-sky-400 bg-sky-500/20 border-sky-500/30',
    },
  ];

  return (
    <div
      id="modal-safety-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="modal-safety-guide-card"
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-5 sm:p-7 text-slate-100 shadow-2xl relative my-6 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          id="btn-close-safety-guide"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Railway Emergency Operating Process
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Standard safety protocols, step-by-step reporting guide, and passenger evacuation instructions.
        </p>

        {/* Tabs: Step-by-Step Workflow vs Specific Hazard Protocols */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
          <button
            type="button"
            id="tab-workflow"
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'workflow'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            Step-by-Step Emergency Process (From Start to Rescue)
          </button>
          <button
            type="button"
            id="tab-protocols"
            onClick={() => setActiveTab('protocols')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'protocols'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            Safety Protocols by Hazard Type
          </button>
        </div>

        {activeTab === 'workflow' ? (
          /* Step-by-Step Process */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`p-2 rounded-lg border ${step.color}`}>
                          <StepIcon className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-mono font-black text-slate-500">
                          STEP {step.number}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <strong className="text-amber-300 font-bold block mb-1">
                Important Railway Helpline Numbers:
              </strong>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <span>Integrated All-India Railway Helpline: <strong>139</strong></span>
                <span>Security / RPF Emergency: <strong>182</strong></span>
                <span>National Emergency: <strong>112</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* Hazard-Specific Protocols */
          <div>
            {/* Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SAFETY_PROTOCOLS.map((proto) => (
                <button
                  key={proto.id}
                  type="button"
                  id={`btn-proto-tab-${proto.id}`}
                  onClick={() => setSelectedProtocolId(proto.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedProtocolId === proto.id
                      ? 'bg-slate-100 text-slate-900 shadow'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {proto.title.split('/')[0]}
                </button>
              ))}
            </div>

            {/* Selected Protocol Card */}
            <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Action Steps for {currentProtocol.title}
              </h3>
              <ol className="space-y-2.5 text-xs text-slate-200">
                {currentProtocol.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            id="btn-close-guide-footer"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close Safety Guide
          </button>
        </div>
      </div>
    </div>
  );
};
