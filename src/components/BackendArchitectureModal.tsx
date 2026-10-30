import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Code2,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  FileCode,
  Globe,
  Radio,
  X,
  Play,
  Package,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface BackendArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendArchitectureModal: React.FC<BackendArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-tester' | 'npm-runner' | 'flask-code' | 'html-files'>('overview');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);
  const [npmRunning, setNpmRunning] = useState<boolean>(false);
  const [npmResult, setNpmResult] = useState<{ command: string; exitCode: number; durationMs: number; stdout: string; stderr: string } | null>(null);

  if (!isOpen) return null;

  const testEndpoint = async (url: string) => {
    setLoadingEndpoint(url);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(`Error calling ${url}: ${err?.message || 'Failed'}`);
    } finally {
      setLoadingEndpoint(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Dual-Backend Architecture &amp; Static HTML Suites
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Node/Express + Python Flask
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Full-stack Node.js/Express (Port 3000) &bull; Standalone Python Flask (Port 5000) &bull; Static HTML Portals
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            System Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api-tester')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'api-tester'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live API Console
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('npm-runner')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'npm-runner'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            NPM Command Runner
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('html-files')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'html-files'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Standalone HTML Portals (3)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flask-code')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'flask-code'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Flask Python Code
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node.js Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      Node.js + Express.js
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded">
                      PORT 3000 (ACTIVE)
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Integrated full-stack server running live in <code className="text-sky-300">/server.ts</code>. Serves Vite client and mounts Express REST API + Server-Sent Events (SSE) stream for instantaneous push alerts.
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside pt-1">
                    <li>Production bundled via esbuild to <code className="text-amber-300">dist/server.cjs</code></li>
                    <li>Live in-memory railway event store &amp; broadcaster</li>
                    <li>SSE push notification channel at <code className="text-emerald-400">/api/events</code></li>
                  </ul>
                </div>

                {/* Flask Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-sky-400" />
                      Python 3 + Flask
                    </span>
                    <span className="bg-sky-500/20 text-sky-300 font-mono text-[10px] px-2 py-0.5 rounded">
                      PORT 5000 (READY)
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Located in <code className="text-sky-300">/backend_flask/app.py</code> with full Flask-CORS and identical payload contracts.
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside pt-1">
                    <li>Complete REST routes &amp; SSE event generator</li>
                    <li>Built-in interactive HTML dashboard at root <code className="text-amber-300">/</code></li>
                    <li>Includes <code className="text-sky-300">requirements.txt</code> &amp; README guide</li>
                  </ul>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">Unified REST API Contract</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="pb-1.5">Method</th>
                        <th className="pb-1.5">Route</th>
                        <th className="pb-1.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-1 text-emerald-400">GET</td>
                        <td className="py-1 text-sky-300">/api/health</td>
                        <td className="py-1 text-slate-300 font-sans">Health, telemetry summary &amp; server status</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-emerald-400">GET</td>
                        <td className="py-1 text-sky-300">/api/telemetry</td>
                        <td className="py-1 text-slate-300 font-sans">Speed, line pressure, train location</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-amber-400">POST</td>
                        <td className="py-1 text-sky-300">/api/telemetry/brakes</td>
                        <td className="py-1 text-slate-300 font-sans">Emergency brake dump / pressure release</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-emerald-400">GET / POST</td>
                        <td className="py-1 text-sky-300">/api/emergency/reports</td>
                        <td className="py-1 text-slate-300 font-sans">Submit &amp; fetch hazard incident reports</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-rose-400">POST</td>
                        <td className="py-1 text-sky-300">/api/emergency/buzzer</td>
                        <td className="py-1 text-slate-300 font-sans">1-Tap Extreme Passenger SOS alarm</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-emerald-400">GET / POST</td>
                        <td className="py-1 text-sky-300">/api/broadcasts</td>
                        <td className="py-1 text-slate-300 font-sans">Staff public safety push announcements</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-purple-400">GET</td>
                        <td className="py-1 text-sky-300">/api/events</td>
                        <td className="py-1 text-slate-300 font-sans">Server-Sent Events (SSE) live push stream</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api-tester' && (
            <div className="space-y-3">
              <p className="text-slate-400">
                Execute live requests directly against the running Node.js + Express backend:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => testEndpoint('/api/health')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono flex items-center gap-1 border border-slate-700"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  GET /api/health
                </button>
                <button
                  type="button"
                  onClick={() => testEndpoint('/api/telemetry')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono flex items-center gap-1 border border-slate-700"
                >
                  <Play className="w-3 h-3 text-sky-400" />
                  GET /api/telemetry
                </button>
                <button
                  type="button"
                  onClick={() => testEndpoint('/api/emergency/reports')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono flex items-center gap-1 border border-slate-700"
                >
                  <Play className="w-3 h-3 text-amber-400" />
                  GET /api/emergency/reports
                </button>
                <button
                  type="button"
                  onClick={() => testEndpoint('/api/broadcasts')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono flex items-center gap-1 border border-slate-700"
                >
                  <Play className="w-3 h-3 text-purple-400" />
                  GET /api/broadcasts
                </button>
              </div>

              {loadingEndpoint && (
                <div className="text-amber-400 font-mono py-2">Executing {loadingEndpoint}...</div>
              )}

              {apiResponse && (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">HTTP Response Body:</span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'npm-runner' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-400" />
                    Frontend &amp; Backend NPM Command Execution
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Node Process Runner
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  Run standard build tools, TypeScript type safety checks, and dependency tree inspection from the frontend interface:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { cmd: 'npm run lint', desc: 'Type check with tsc --noEmit' },
                    { cmd: 'npm run build', desc: 'Production bundle build' },
                    { cmd: 'npm list --depth=0', desc: 'Inspect top-level dependencies' },
                    { cmd: 'npm --version', desc: 'Check npm version' },
                    { cmd: 'node --version', desc: 'Check Node version' },
                  ].map(({ cmd, desc }) => (
                    <button
                      key={cmd}
                      type="button"
                      disabled={npmRunning}
                      onClick={async () => {
                        setNpmRunning(true);
                        setNpmResult(null);
                        try {
                          const res = await fetch('/api/npm/run', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ command: cmd }),
                          });
                          const data = await res.json();
                          setNpmResult(data);
                        } catch (err: any) {
                          setNpmResult({
                            command: cmd,
                            exitCode: 1,
                            durationMs: 0,
                            stdout: '',
                            stderr: `Request failed: ${err?.message || 'Error'}`,
                          });
                        } finally {
                          setNpmRunning(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
                      title={desc}
                    >
                      <Play className="w-3 h-3 text-amber-400 fill-current" />
                      <span>{cmd}</span>
                    </button>
                  ))}
                </div>
              </div>

              {npmRunning && (
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs py-3 px-4 bg-slate-950 border border-slate-800 rounded-xl animate-pulse">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Running command in workspace root...</span>
                </div>
              )}

              {npmResult && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                    <span className="text-amber-400 font-bold">$ {npmResult.command}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {npmResult.durationMs}ms
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          npmResult.exitCode === 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        EXIT {npmResult.exitCode}
                      </span>
                    </div>
                  </div>

                  {npmResult.stdout && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">STDOUT:</span>
                      <pre className="whitespace-pre-wrap text-emerald-300 overflow-x-auto max-h-60 leading-relaxed">
                        {npmResult.stdout}
                      </pre>
                    </div>
                  )}

                  {npmResult.stderr && (
                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-rose-400 uppercase tracking-wider block">STDERR:</span>
                      <pre className="whitespace-pre-wrap text-rose-300 overflow-x-auto max-h-60 leading-relaxed">
                        {npmResult.stderr}
                      </pre>
                    </div>
                  )}

                  {!npmResult.stdout && !npmResult.stderr && (
                    <div className="text-slate-500 italic">Command completed with exit code 0.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'html-files' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                In addition to the React.js application, three standalone, fully functional HTML emergency displays are included in the project:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* File 1 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" />
                      Station Kiosk Display
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Big-screen Passenger Information System (PIS) with live emergency banners, coach heatmaps, and audio buzzer.
                    </p>
                    <code className="block mt-2 text-[10px] text-amber-400">/public/kiosk.html</code>
                  </div>
                  <a
                    href="/kiosk.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-center font-bold flex items-center justify-center gap-1"
                  >
                    <span>Open Kiosk Display</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* File 2 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      Evacuation Pocket Pass
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Printable / mobile passenger pocket pass with offline QR code, coach exit map, and emergency helplines (139 &amp; 182).
                    </p>
                    <code className="block mt-2 text-[10px] text-amber-400">/public/passenger-card.html</code>
                  </div>
                  <a
                    href="/passenger-card.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold flex items-center justify-center gap-1"
                  >
                    <span>Open Passenger Pass</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* File 3 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Server className="w-4 h-4 text-purple-400" />
                      Backend &amp; API Status
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Telemetry monitor and dual-backend inspector for Node.js Express and Python Flask.
                    </p>
                    <code className="block mt-2 text-[10px] text-amber-400">/public/status.html</code>
                  </div>
                  <a
                    href="/status.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-center font-bold flex items-center justify-center gap-1"
                  >
                    <span>Open Status Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flask-code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400">File: /backend_flask/app.py</span>
                <span className="text-[11px] text-emerald-400 font-mono">Python 3 + Flask</span>
              </div>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-80">
{`from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import time, json, random

app = Flask(__name__)
CORS(app)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "runtime": "Python 3 + Flask",
        "timestamp": int(time.time() * 1000)
    })

@app.route("/api/emergency/buzzer", methods=["POST"])
def trigger_buzzer():
    body = request.get_json() or {}
    coach = body.get("coach", "B6")
    # Broadcasts emergency alert train-wide
    return jsonify({"success": True, "message": f"SOS activated in {coach}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)`}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono">
            Full-Stack Node.js &bull; Python Flask &bull; React Vite
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
