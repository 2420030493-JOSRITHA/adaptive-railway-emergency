import React, { useState } from 'react';
import {
  DoorOpen,
  Flame,
  AlertTriangle,
  Hammer,
  ShieldCheck,
  Footprints,
  Sparkles,
  Info,
  Maximize2,
  XCircle,
  LocateFixed,
} from 'lucide-react';
import { ExitDoor, SafetyEquipment } from '../types';

interface CoachBlueprintGraphicProps {
  coachId: string;
  coachLabel: string;
  currentSeat: string;
  onSelectSeat: (seatLabel: string) => void;
  exits: ExitDoor[];
  equipments: SafetyEquipment[];
  hasHazard: boolean;
  hazardType?: string;
  simulatedBlockedDoorId: string | null;
  onToggleDoorBlock: (doorId: string) => void;
  onSelectEquipment: (eq: SafetyEquipment) => void;
}

export const CoachBlueprintGraphic: React.FC<CoachBlueprintGraphicProps> = ({
  coachId,
  coachLabel,
  currentSeat,
  onSelectSeat,
  exits,
  equipments,
  hasHazard,
  hazardType,
  simulatedBlockedDoorId,
  onToggleDoorBlock,
  onSelectEquipment,
}) => {
  const [hoveredBerth, setHoveredBerth] = useState<number | null>(null);

  // Extract berth number from seat string (e.g. "Berth 28 (Middle)" -> 28)
  const match = currentSeat.match(/\d+/);
  const currentBerthNum = match ? parseInt(match[0], 10) : 28;

  // 9 bays of 8 berths = 72 berths in 3AC / Sleeper
  const totalBays = 8; // bays 1 to 8 shown on blueprint
  
  // Calculate passenger position X percentage (0 to 100)
  // Bay 1 is near 12%, Bay 8 is near 88%
  const currentBay = Math.min(8, Math.max(1, Math.ceil(currentBerthNum / 8)));
  const passengerX = 14 + (currentBay - 1) * 10.2; // approx percentage
  const passengerY = 50; // along central corridor

  // Find nearest exit
  // Exits: front-left (X: 8, Y: 18), front-right (X: 8, Y: 82), rear-left (X: 92, Y: 18), rear-right (X: 92, Y: 82)
  const doorPositions: Record<string, { x: number; y: number }> = {
    'front-left': { x: 7, y: 15 },
    'front-right': { x: 7, y: 85 },
    'rear-left': { x: 93, y: 15 },
    'rear-right': { x: 93, y: 85 },
    'vestibule-forward': { x: 2, y: 50 },
    'vestibule-rear': { x: 98, y: 50 },
  };

  const processedExits = exits.map((exit) => {
    const isBlocked =
      exit.isBlocked ||
      simulatedBlockedDoorId === exit.id ||
      (hasHazard && hazardType === 'fire' && exit.location.includes('front'));
    
    const pos = doorPositions[exit.location] || { x: 10, y: 20 };
    // Distance from passenger
    const dx = pos.x - passengerX;
    const dy = pos.y - passengerY;
    const euclideanDist = Math.sqrt(dx * dx + dy * dy);

    return {
      ...exit,
      pos,
      isBlocked,
      pixelDist: euclideanDist,
    };
  });

  const availableExits = processedExits.filter((e) => !e.isBlocked);
  const targetExit =
    availableExits.sort((a, b) => a.pixelDist - b.pixelDist)[0] || processedExits[0];

  // Laser path points
  const pathStartX = passengerX;
  const pathStartY = 50;
  const pathMidX = targetExit ? targetExit.pos.x : 8;
  const pathEndY = targetExit ? targetExit.pos.y : 15;

  return (
    <div id="coach-blueprint-container" className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 md:p-6 shadow-2xl overflow-hidden">
      {/* Dynamic Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-xs">
            {coachId}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              High-Precision Evacuation Blueprint
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Real-Time Laser Path Routing
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Click any berth below to instantly calculate and animate the shortest escape path.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Selected: <strong className="text-amber-400">Berth {currentBerthNum} (Bay {currentBay})</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[820px] relative">
          <svg
            viewBox="0 0 1000 360"
            className="w-full h-auto select-none rounded-xl"
            style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.8))' }}
          >
            <defs>
              {/* Metallic Coach Gradient */}
              <linearGradient id="coachHullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="25%" stopColor="#0f172a" />
                <stop offset="75%" stopColor="#0b1120" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>

              {/* Laser Glow Filter */}
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Fire Hazard Glow */}
              <radialGradient id="fireAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
              </radialGradient>

              {/* Caution Diagonal Stripe Pattern for Blocked Doors */}
              <pattern id="hazardStripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="12" fill="#ef4444" />
                <rect x="6" width="6" height="12" fill="#1e293b" />
              </pattern>
            </defs>

            {/* External Rails & Track Ties */}
            <line x1="10" y1="345" x2="990" y2="345" stroke="#334155" strokeWidth="4" strokeDasharray="16,10" />
            <line x1="10" y1="15" x2="990" y2="15" stroke="#334155" strokeWidth="4" strokeDasharray="16,10" />

            {/* Coach Wheels / Bogies */}
            <rect x="100" y="332" width="110" height="14" rx="4" fill="#475569" stroke="#1e293b" />
            <circle cx="125" cy="344" r="9" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
            <circle cx="185" cy="344" r="9" fill="#0f172a" stroke="#64748b" strokeWidth="3" />

            <rect x="790" y="332" width="110" height="14" rx="4" fill="#475569" stroke="#1e293b" />
            <circle cx="815" cy="344" r="9" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
            <circle cx="875" cy="344" r="9" fill="#0f172a" stroke="#64748b" strokeWidth="3" />

            {/* Main Coach Body Outer Shell */}
            <rect
              x="30"
              y="30"
              width="940"
              height="300"
              rx="22"
              fill="url(#coachHullGrad)"
              stroke="#475569"
              strokeWidth="3"
            />

            {/* Yellow Coach Border Livery Band */}
            <rect x="30" y="45" width="940" height="8" fill="#eab308" opacity="0.8" />
            <rect x="30" y="307" width="940" height="8" fill="#eab308" opacity="0.8" />

            {/* Vestibule Gangway Connectors (Left = Forward, Right = Rear) */}
            <path d="M 15 130 L 30 145 L 30 215 L 15 230 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="24" y="185" fill="#94a3b8" fontSize="10" fontFamily="monospace" transform="rotate(-90 24,185)" textAnchor="middle">
              GANGWAY &larr;
            </text>

            <path d="M 985 130 L 970 145 L 970 215 L 985 230 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="976" y="185" fill="#94a3b8" fontSize="10" fontFamily="monospace" transform="rotate(90 976,185)" textAnchor="middle">
              GANGWAY &rarr;
            </text>

            {/* Central Aisle / Walkway Corridor */}
            <rect x="80" y="155" width="840" height="50" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
            <line x1="80" y1="180" x2="920" y2="180" stroke="#334155" strokeWidth="1" strokeDasharray="6,6" opacity="0.4" />

            {/* Exit Doors Graphic */}
            {processedExits.map((door) => {
              const isNearest = targetExit?.id === door.id;
              const isBlocked = door.isBlocked;
              const isLeft = door.location.includes('left');
              const isFront = door.location.includes('front');
              const doorX = isFront ? 50 : 880;
              const doorY = isLeft ? 30 : 285;

              return (
                <g key={door.id} className="cursor-pointer" onClick={() => onToggleDoorBlock(door.id)}>
                  {/* Door Base Plate */}
                  <rect
                    x={doorX}
                    y={doorY}
                    width="70"
                    height="45"
                    rx="8"
                    fill={isBlocked ? 'url(#hazardStripes)' : isNearest ? '#065f46' : '#1e293b'}
                    stroke={isBlocked ? '#ef4444' : isNearest ? '#10b981' : '#475569'}
                    strokeWidth={isNearest ? '3' : '1.5'}
                    filter={isNearest ? 'url(#laserGlow)' : undefined}
                  />

                  {/* Door Status Icon & Text */}
                  <text
                    x={doorX + 35}
                    y={doorY + 22}
                    fill={isBlocked ? '#fca5a5' : isNearest ? '#ecfdf5' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {door.name.replace('Door', 'D')}
                  </text>
                  <text
                    x={doorX + 35}
                    y={doorY + 35}
                    fill={isBlocked ? '#ef4444' : isNearest ? '#34d399' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isBlocked ? 'BLOCKED' : isNearest ? 'NEAREST' : 'EXIT'}
                  </text>
                </g>
              );
            })}

            {/* Emergency Breakout Windows (Tempered Glass Windows) */}
            <g>
              {/* Top Window 1 */}
              <rect x="340" y="32" width="60" height="14" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <text x="370" y="42" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">EMG WIN</text>

              {/* Top Window 2 */}
              <rect x="620" y="32" width="60" height="14" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <text x="650" y="42" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">EMG WIN</text>

              {/* Bottom Window 3 */}
              <rect x="340" y="314" width="60" height="14" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <text x="370" y="324" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">EMG WIN</text>

              {/* Bottom Window 4 */}
              <rect x="620" y="314" width="60" height="14" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <text x="650" y="324" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle">EMG WIN</text>
            </g>

            {/* Safety Equipment Badges Rendered at Coordinates */}
            {equipments.map((eq) => {
              const eqX = 40 + (eq.gridX / 100) * 920;
              const eqY = 40 + (eq.gridY / 100) * 280;
              const isFireExt = eq.type === 'fire_extinguisher';
              const isMed = eq.type === 'first_aid';
              const isHammer = eq.type === 'evacuation_hammer';

              return (
                <g
                  key={eq.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => onSelectEquipment(eq)}
                  transform={`translate(${eqX - 10}, ${eqY - 10})`}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="12"
                    fill={isFireExt ? '#b91c1c' : isMed ? '#059669' : isHammer ? '#d97706' : '#1e293b'}
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <text
                    x="10"
                    y="14"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isFireExt ? '🧯' : isMed ? '➕' : isHammer ? '🔨' : '🔔'}
                  </text>
                </g>
              );
            })}

            {/* Berth Matrix Rows (Top Berths & Bottom Berths) */}
            {Array.from({ length: totalBays }).map((_, bIdx) => {
              const bayNum = bIdx + 1;
              const bayStartX = 140 + bIdx * 94;

              // 6 berths on compartment side (Lower, Middle, Upper x2)
              const topBerth1 = (bayNum - 1) * 8 + 1;
              const topBerth2 = (bayNum - 1) * 8 + 2;
              const topBerth3 = (bayNum - 1) * 8 + 3;
              const topBerth4 = (bayNum - 1) * 8 + 4;
              const topBerth5 = (bayNum - 1) * 8 + 5;
              const topBerth6 = (bayNum - 1) * 8 + 6;

              // 2 berths on side (Side Lower, Side Upper)
              const sideLower = (bayNum - 1) * 8 + 7;
              const sideUpper = (bayNum - 1) * 8 + 8;

              const isCurrentBay = bayNum === currentBay;

              return (
                <g key={`bay-${bayNum}`}>
                  {/* Bay Partition Divider */}
                  <line
                    x1={bayStartX}
                    y1="60"
                    x2={bayStartX}
                    y2="155"
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  <line
                    x1={bayStartX}
                    y1="205"
                    x2={bayStartX}
                    y2="300"
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />

                  {/* Top Compartment Block (Berths 1-6) */}
                  <rect
                    x={bayStartX + 6}
                    y="65"
                    width="82"
                    height="82"
                    rx="6"
                    fill={isCurrentBay ? '#1e3a8a' : '#0f172a'}
                    stroke={isCurrentBay ? '#60a5fa' : '#334155'}
                    strokeWidth="1.5"
                    className="cursor-pointer hover:fill-blue-900/60"
                    onClick={() => onSelectSeat(`Berth ${topBerth1} (Bay ${bayNum})`)}
                  />
                  <text
                    x={bayStartX + 47}
                    y="95"
                    fill={isCurrentBay ? '#93c5fd' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Bay {bayNum}
                  </text>
                  <text
                    x={bayStartX + 47}
                    y="112"
                    fill={isCurrentBay ? '#ffffff' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    B{topBerth1}-{topBerth6}
                  </text>

                  {/* Bottom Side Row Block (Berths 7-8 Side Lower / Side Upper) */}
                  <rect
                    x={bayStartX + 6}
                    y="215"
                    width="82"
                    height="75"
                    rx="6"
                    fill={isCurrentBay ? '#1e3a8a' : '#0f172a'}
                    stroke={isCurrentBay ? '#60a5fa' : '#334155'}
                    strokeWidth="1.5"
                    className="cursor-pointer hover:fill-blue-900/60"
                    onClick={() => onSelectSeat(`Berth ${sideLower} (Side Lower)`)}
                  />
                  <text
                    x={bayStartX + 47}
                    y="245"
                    fill={isCurrentBay ? '#93c5fd' : '#94a3b8'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Side Berths
                  </text>
                  <text
                    x={bayStartX + 47}
                    y="262"
                    fill={isCurrentBay ? '#ffffff' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    SL:{sideLower} SU:{sideUpper}
                  </text>
                </g>
              );
            })}

            {/* Active Fire Hazard Glow & Smoke (If hazard active) */}
            {hasHazard && (
              <g transform="translate(180, 70)">
                <circle cx="50" cy="50" r="75" fill="url(#fireAura)" />
                <text x="50" y="55" fontSize="32" textAnchor="middle">🔥</text>
                <text x="50" y="90" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ACTIVE FIRE / SMOKE
                </text>
              </g>
            )}

            {/* ANIMATED LASER ESCAPE PATH FROM PASSENGER TO NEAREST EXIT */}
            {targetExit && (
              <g>
                {/* Underlay glow path */}
                <path
                  d={`M ${pathStartX * 10} 180 L ${pathMidX * 10} 180 L ${pathMidX * 10} ${pathEndY * 3.6}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  opacity="0.3"
                  filter="url(#laserGlow)"
                />

                {/* Animated high-visibility dashed laser line */}
                <path
                  d={`M ${pathStartX * 10} 180 L ${pathMidX * 10} 180 L ${pathMidX * 10} ${pathEndY * 3.6}`}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3.5"
                  strokeDasharray="10 6"
                  className="animate-[dash_1s_linear_infinite]"
                  style={{
                    strokeLinecap: 'round',
                    animation: 'dash 1.2s linear infinite',
                  }}
                />

                {/* Directional Exit Arrow at Door */}
                <polygon
                  points={`${pathMidX * 10 - 8},${pathEndY * 3.6} ${pathMidX * 10 + 8},${pathEndY * 3.6} ${pathMidX * 10},${pathEndY * 3.6 - 12 * (pathEndY < 50 ? 1 : -1)}`}
                  fill="#10b981"
                  filter="url(#laserGlow)"
                />
              </g>
            )}

            {/* PASSENGER LOCATION BEACON PIN */}
            <g transform={`translate(${passengerX * 10}, 180)`}>
              {/* Pulsing Beacon Ring */}
              <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="10" fill="#2563eb" stroke="white" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#60a5fa" />

              {/* Pin Callout Badge */}
              <rect x="-42" y="-36" width="84" height="20" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="0" y="-22" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                YOU (B{currentBerthNum})
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Interactive Legend & Safety Tips Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          <span>Green Exit: Primary Door</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
          <span>Blue Marker: Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Red Icon: Fire Extinguisher</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Amber Icon: Break Hammer</span>
        </div>
      </div>
    </div>
  );
};
