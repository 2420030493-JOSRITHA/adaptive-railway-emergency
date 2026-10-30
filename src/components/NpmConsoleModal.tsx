import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  FileCode,
} from 'lucide-react';

interface NpmScriptItem {
  command: string;
  description: string;
  type: string;
}

interface CommandLog {
  id: string;
  command: string;
  exitCode: number;
  durationMs: number;
  stdout: string;
  stderr: string;
  timestamp: number;
  success: boolean;
}

interface NpmConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NpmConsoleModal: React.FC<NpmConsoleModalProps> = ({ isOpen, onClose }) => {
  const [scripts, setScripts] = useState<NpmScriptItem[]>([
    { command: 'npm run lint', description: 'Run TypeScript compiler type check without emitting output', type: 'script' },
    { command: 'npm run build', description: 'Compile React production bundle and esbuild Node backend', type: 'build' },
    { command: 'npm list --depth=0', description: 'Inspect installed npm packages & top-level dependency tree', type: 'query' },
    { command: 'npm --version', description: 'Inspect running NPM runtime engine version', type: 'info' },
    { command: 'node --version', description: 'Inspect running Node.js host engine version', type: 'info' },
  ]);

  const [selectedCommand, setSelectedCommand] = useState<string>('npm run lint');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/npm/scripts')
      .then((res) => res.json())
      .then((data) => {
        if (data?.availableScripts?.length) {
          setScripts(data.availableScripts);
        }
      })
      .catch(() => {
        // fallback to predefined scripts
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || selectedCommand;
    if (isRunning) return;

    setIsRunning(true);
    const tempId = `cmd-${Date.now()}`;

    try {
      const res = await fetch('/api/npm/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();

      const newLog: CommandLog = {
        id: tempId,
        command: cmd,
        exitCode: data.exitCode !== undefined ? data.exitCode : (data.success ? 0 : 1),
        durationMs: data.durationMs || 0,
        stdout: data.stdout || '',
        stderr: data.stderr || (data.error ? String(data.error) : ''),
        timestamp: data.timestamp || Date.now(),
        success: !!data.success,
      };

      setLogs((prev) => [newLog, ...prev]);
      setActiveLogIndex(0);
    } catch (err: any) {
      const failLog: CommandLog = {
        id: tempId,
        command: cmd,
        exitCode: 1,
        durationMs: 0,
        stdout: '',
        stderr: `Execution failed to reach server: ${err?.message || 'Network error'}`,
        timestamp: Date.now(),
        success: false,
      };
      setLogs((prev) => [failLog, ...prev]);
      setActiveLogIndex(0);
    } finally {
      setIsRunning(false);
    }
  };

  const currentLog = logs[activeLogIndex];

  const handleCopyOutput = () => {
    if (!currentLog) return;
    const textToCopy = `${currentLog.command}\nExit code: ${currentLog.exitCode} (${currentLog.durationMs}ms)\n\n--- STDOUT ---\n${currentLog.stdout}\n\n--- STDERR ---\n${currentLog.stderr}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                NPM Command Center &amp; Frontend Build Runner
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Live Server Shell
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute build scripts, TypeScript typechecks, and package dependency inspections directly from the browser UI.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar / Quick Run Buttons */}
        <div className="bg-slate-950/60 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Available NPM Commands:
            </span>
            {scripts.map((s) => (
              <button
                key={s.command}
                type="button"
                onClick={() => {
                  setSelectedCommand(s.command);
                  handleRunCommand(s.command);
                }}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                  selectedCommand === s.command
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={s.description}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{s.command}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleRunCommand(selectedCommand)}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all ml-auto"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing {selectedCommand}...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run "{selectedCommand}"</span>
              </>
            )}
          </button>
        </div>

        {/* Main Terminal Output & History Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-[380px] overflow-hidden">
          {/* Left Column: Command Execution History */}
          <div className="bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto space-y-2 lg:col-span-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Run History ({logs.length})
              </span>
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                >
                  Clear
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No commands executed yet.</p>
                <p className="text-[10px] mt-1 text-slate-600">Click any command above to run live on the server.</p>
              </div>
            ) : (
              logs.map((l, idx) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLogIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 ${
                    activeLogIndex === idx
                      ? 'bg-slate-800/90 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold text-white truncate max-w-[140px]">
                      {l.command}
                    </span>
                    {l.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{l.durationMs}ms</span>
                    <span>exit {l.exitCode}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right Column: High-Tech Terminal Output */}
          <div className="lg:col-span-3 flex flex-col bg-slate-950 p-4 font-mono text-xs overflow-hidden">
            {/* Terminal Window Topbar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-slate-300 font-bold ml-2">
                  bash console &bull; {currentLog ? currentLog.command : selectedCommand}
                </span>
              </div>

              {currentLog && (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentLog.durationMs} ms
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentLog.success
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    STATUS: {currentLog.exitCode === 0 ? 'EXIT 0 (SUCCESS)' : `EXIT ${currentLog.exitCode} (FAILED)`}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOutput}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] px-2"
                    title="Copy full console output"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Terminal Screen Body */}
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto rounded-xl bg-black/70 border border-slate-800/80 p-4 space-y-3 font-mono text-[12px] text-slate-300 selection:bg-amber-500 selection:text-slate-950"
            >
              {isRunning && (
                <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Executing `$ {selectedCommand}` in project container...</span>
                </div>
              )}

              {!isRunning && !currentLog && (
                <div className="text-slate-500 space-y-2 py-4">
                  <p className="text-emerald-400">$ node --version &amp;&amp; npm --version</p>
                  <p className="text-slate-400">
                    Welcome to the Railway Safety Emergency Portal interactive NPM runner.
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Select any command above (such as <code className="text-amber-400">npm run lint</code>, <code className="text-sky-400">npm run build</code>, or <code className="text-emerald-400">npm list --depth=0</code>) to trigger live real-time compilation and inspection in the workspace container.
                  </p>
                </div>
              )}

              {currentLog && (
                <>
                  <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-900 pb-2">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">{currentLog.command}</span>
                  </div>

                  {currentLog.stdout && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                        STDOUT
                      </span>
                      <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono">
                        {currentLog.stdout}
                      </pre>
                    </div>
                  )}

                  {currentLog.stderr && (
                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      <span className="text-[10px] uppercase tracking-wider text-rose-400 block">
                        {currentLog.success ? 'STDERR / NOTICES' : 'ERROR OUTPUT'}
                      </span>
                      <pre className="whitespace-pre-wrap text-rose-300 leading-relaxed font-mono">
                        {currentLog.stderr}
                      </pre>
                    </div>
                  )}

                  {!currentLog.stdout && !currentLog.stderr && (
                    <div className="text-slate-500 italic">
                      Command completed with no text output (clean exit code {currentLog.exitCode}).
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono">
            Direct Process Execution: <code className="text-emerald-400">npm run lint</code> &bull; <code className="text-sky-400">npm run build</code> &bull; <code className="text-purple-400">npm list</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
