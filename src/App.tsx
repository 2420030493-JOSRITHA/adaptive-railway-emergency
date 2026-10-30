import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { Header } from './components/Header';
import { PassengerDashboard } from './components/PassengerDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { SplitViewDemo } from './components/SplitViewDemo';
import { PassengerAlertPopup } from './components/PassengerAlertPopup';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { ReportEmergencyModal } from './components/ReportEmergencyModal';
import { Train, ShieldAlert, PhoneCall, HeartPulse, Flame, Globe, FileCode } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole, currentCoach } = useEmergency();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div id="app-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Real-Time Push Notification Popup (Rings on passenger view when staff broadcasts) */}
      <PassengerAlertPopup
        onFocusExitMap={() => {
          if (role === 'staff') {
            setRole('passenger');
          }
        }}
      />

      {/* Main Content View Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'passenger' && (
          <PassengerDashboard onOpenGuide={() => setIsGuideOpen(true)} />
        )}

        {role === 'staff' && <StaffDashboard />}

        {role === 'split' && <SplitViewDemo />}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">
              Adaptive Railway Emergency Management System
            </span>
            <span className="text-slate-600">•</span>
            <span>Train Security &amp; Safety Portal</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="/kiosk.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-mono transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Station Kiosk Display &rarr;</span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="/passenger-card.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Evacuation Pocket Pass &rarr;</span>
            </a>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Railway Helpline: <strong className="text-white">139</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              RPF Security: <strong className="text-white">182</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SafetyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ReportEmergencyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <EmergencyProvider>
      <MainContent />
    </EmergencyProvider>
  );
}
