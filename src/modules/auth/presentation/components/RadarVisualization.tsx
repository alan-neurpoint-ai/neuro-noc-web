const CX = 200;
const CY = 200;
const MAX_R = 180;

interface BlipConfig {
  angle: number;
  dist: number;
  r: number;
  color: string;
  pulseDelay: string;
  ringDelay: string;
}

const BLIPS: BlipConfig[] = [
  {
    angle: 35,
    dist: 0.55,
    r: 3,
    color: '#818cf8',
    pulseDelay: '0s',
    ringDelay: '0.3s',
  },
  {
    angle: 125,
    dist: 0.7,
    r: 2.5,
    color: '#a5b4fc',
    pulseDelay: '1.2s',
    ringDelay: '1.5s',
  },
  {
    angle: 200,
    dist: 0.45,
    r: 2,
    color: '#6366f1',
    pulseDelay: '0.6s',
    ringDelay: '0.9s',
  },
  {
    angle: 280,
    dist: 0.78,
    r: 2,
    color: '#c7d2fe',
    pulseDelay: '2s',
    ringDelay: '2.3s',
  },
  {
    angle: 340,
    dist: 0.35,
    r: 1.5,
    color: '#818cf8',
    pulseDelay: '0.8s',
    ringDelay: '1.1s',
  },
  {
    angle: 90,
    dist: 0.62,
    r: 2,
    color: '#a5b4fc',
    pulseDelay: '1.6s',
    ringDelay: '1.9s',
  },
];

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 3],
  [2, 4],
  [0, 5],
  [2, 5],
];

const RINGS = [
  { scale: 1, opacity: 0.05 },
  { scale: 0.73, opacity: 0.07 },
  { scale: 0.48, opacity: 0.09 },
  { scale: 0.25, opacity: 0.11 },
];

const CARDINAL_TICKS = [0, 90, 180, 270];

function polarToCartesian(angleDeg: number, dist: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + MAX_R * dist * Math.cos(rad),
    y: CY + MAX_R * dist * Math.sin(rad),
  };
}

function RadarRings() {
  return (
    <>
      {RINGS.map((ring) => (
        <circle
          key={ring.scale}
          cx={CX}
          cy={CY}
          r={MAX_R * ring.scale}
          fill="none"
          stroke={`rgba(99,102,241,${ring.opacity})`}
          strokeWidth="0.5"
        />
      ))}
    </>
  );
}

function RadarCrossLines() {
  const end = MAX_R + 5;
  const diag = MAX_R * 0.71;
  return (
    <>
      <line
        x1={CX}
        y1={CY - end}
        x2={CX}
        y2={CY + end}
        stroke="rgba(99,102,241,0.04)"
        strokeWidth="0.5"
      />
      <line
        x1={CX - end}
        y1={CY}
        x2={CX + end}
        y2={CY}
        stroke="rgba(99,102,241,0.04)"
        strokeWidth="0.5"
      />
      <line
        x1={CX - diag}
        y1={CY - diag}
        x2={CX + diag}
        y2={CY + diag}
        stroke="rgba(99,102,241,0.03)"
        strokeWidth="0.5"
      />
      <line
        x1={CX + diag}
        y1={CY - diag}
        x2={CX - diag}
        y2={CY + diag}
        stroke="rgba(99,102,241,0.03)"
        strokeWidth="0.5"
      />
    </>
  );
}

function RadarSweep() {
  const sin60 = Math.sin(Math.PI / 3);
  const cos60 = Math.cos(Math.PI / 3);
  const tipX = CX + MAX_R * sin60;
  const tipY = CY - MAX_R * cos60;

  return (
    <g
      className="animate-radar-sweep"
      style={{ transformOrigin: `${CX}px ${CY}px` }}
    >
      <line
        x1={CX}
        y1={CY}
        x2={CX}
        y2={CY - MAX_R}
        stroke="#818cf8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d={`M${CX},${CY} L${CX},${CY - MAX_R} A${MAX_R},${MAX_R} 0 0,0 ${tipX},${tipY} Z`}
        fill="url(#sweepGrad)"
        opacity="0.5"
      />
      <path
        d={`M${CX},${CY} L${tipX},${tipY} A${MAX_R},${MAX_R} 0 0,0 ${CX},${CY - MAX_R} Z`}
        fill="url(#sweepGrad)"
        opacity="0.25"
      />
      <circle cx={CX} cy={CY - MAX_R} r="6" fill="#818cf8" opacity="0.3" />
    </g>
  );
}

function RadarBlips() {
  return (
    <>
      {BLIPS.map((blip, i) => {
        const pos = polarToCartesian(blip.angle, blip.dist);
        return (
          <g key={i}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={blip.r}
              fill="none"
              stroke={blip.color}
              strokeWidth="0.8"
              opacity="0"
              className="animate-login-blip-ring"
              style={{ animationDelay: blip.ringDelay }}
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={blip.r}
              fill={blip.color}
              filter="url(#blipGlow)"
              className="animate-login-blip-core"
              style={{ animationDelay: blip.pulseDelay }}
            />
          </g>
        );
      })}
    </>
  );
}

function RadarConnections() {
  return (
    <>
      {CONNECTIONS.map(([a, b], i) => {
        const posA = polarToCartesian(BLIPS[a].angle, BLIPS[a].dist);
        const posB = polarToCartesian(BLIPS[b].angle, BLIPS[b].dist);
        return (
          <line
            key={i}
            x1={posA.x}
            y1={posA.y}
            x2={posB.x}
            y2={posB.y}
            stroke="rgba(129,140,248,0.06)"
            strokeWidth="0.5"
            strokeDasharray="4,8"
          />
        );
      })}
    </>
  );
}

function RadarTicks() {
  return (
    <>
      {CARDINAL_TICKS.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = CX + (MAX_R - 3) * Math.cos(rad);
        const y1 = CY + (MAX_R - 3) * Math.sin(rad);
        const x2 = CX + (MAX_R + 6) * Math.cos(rad);
        const y2 = CY + (MAX_R + 6) * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(99,102,241,0.2)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

export function RadarVisualization() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full animate-login-fade-in">
      <defs>
        <linearGradient
          id="sweepGrad"
          gradientUnits="userSpaceOnUse"
          x1={CX}
          y1={CY - MAX_R}
          x2={CX}
          y2={CY + MAX_R}
        >
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <filter id="blipGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={MAX_R + 15} fill="url(#centerGlow)" />
      <RadarRings />
      <RadarCrossLines />
      <RadarSweep />
      <RadarBlips />
      <RadarConnections />
      <RadarTicks />
      <circle cx={CX} cy={CY} r="3" fill="#6366f1" opacity="0.8" />
      <circle
        cx={CX}
        cy={CY}
        r="6"
        fill="#6366f1"
        opacity="0.15"
        className="animate-login-pulse"
      />
    </svg>
  );
}
