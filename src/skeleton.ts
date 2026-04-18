const SZ = 32;
const SCALE = 16;
const FG = "#ffffff";

type Buf = boolean[][];
type Joint = { x: number; y: number; r?: number };
type Prop =
  | {
      type: "laptop";
      baseX: number;
      baseY: number;
      baseW: number;
      baseH: number;
      screenX: number;
      screenY: number;
      screenW: number;
      screenH: number;
    }
  | {
      type: "pan";
      x: number;
      y: number;
      w: number;
      h: number;
      handleX: number;
      handleY: number;
      handleW: number;
    }
  | { type: "flame"; x: number; y: number; peaks: number }
  | { type: "stove"; x: number; y: number; w: number; h: number };

type Skeleton = {
  head: Joint;
  neck: Joint;
  shoulder: Joint;
  lElbow: Joint;
  rElbow: Joint;
  lHand: Joint;
  rHand: Joint;
  hip: Joint;
  lKnee: Joint;
  rKnee: Joint;
  lFoot: Joint;
  rFoot: Joint;
  torsoThick: number;
  props: Prop[];
};

const JOINT_KEYS = [
  "head",
  "neck",
  "shoulder",
  "lElbow",
  "rElbow",
  "lHand",
  "rHand",
  "hip",
  "lKnee",
  "rKnee",
  "lFoot",
  "rFoot",
] as const;
type JointKey = (typeof JOINT_KEYS)[number];

function makeBuf(): Buf {
  const b: Buf = [];
  for (let r = 0; r < SZ; r++) b.push(new Array(SZ).fill(false));
  return b;
}
function setPx(b: Buf, x: number, y: number) {
  const ix = Math.round(x);
  const iy = Math.round(y);
  if (ix >= 0 && ix < SZ && iy >= 0 && iy < SZ) b[iy][ix] = true;
}
function bres(b: Buf, x0: number, y0: number, x1: number, y1: number) {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;
  while (true) {
    setPx(b, x, y);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}
function circle(b: Buf, cx: number, cy: number, r: number) {
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r + 1) setPx(b, cx + x, cy + y);
}

function makeSkeleton(): Skeleton {
  return {
    head: { x: 15, y: 6, r: 2 },
    neck: { x: 15, y: 9 },
    shoulder: { x: 15, y: 11 },
    lElbow: { x: 13, y: 14 },
    rElbow: { x: 17, y: 14 },
    lHand: { x: 12, y: 17 },
    rHand: { x: 18, y: 17 },
    hip: { x: 15, y: 17 },
    lKnee: { x: 13, y: 21 },
    rKnee: { x: 17, y: 21 },
    lFoot: { x: 12, y: 25 },
    rFoot: { x: 18, y: 25 },
    torsoThick: 2,
    props: [],
  };
}

function cloneSkeleton(s: Skeleton): Skeleton {
  const out = { torsoThick: s.torsoThick, props: [] as Prop[] } as Skeleton;
  for (const k of JOINT_KEYS) out[k] = { ...s[k] };
  return out;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpSkeleton(a: Skeleton, b: Skeleton, t: number): Skeleton {
  const out = cloneSkeleton(a);
  for (const k of JOINT_KEYS) {
    out[k].x = lerp(a[k].x, b[k].x, t);
    out[k].y = lerp(a[k].y, b[k].y, t);
    if (a[k].r !== undefined && b[k].r !== undefined) {
      out[k].r = lerp(a[k].r, b[k].r, t);
    }
  }
  out.torsoThick = lerp(a.torsoThick, b.torsoThick, t);
  return out;
}

function renderSkeleton(skel: Skeleton): Buf {
  const b = makeBuf();

  circle(b, skel.head.x, skel.head.y, Math.round(skel.head.r ?? 2));
  bres(
    b,
    skel.head.x,
    skel.head.y + (skel.head.r ?? 2),
    skel.neck.x,
    skel.neck.y,
  );
  bres(b, skel.shoulder.x, skel.shoulder.y, skel.hip.x, skel.hip.y);
  if (skel.torsoThick > 1) {
    bres(b, skel.shoulder.x + 1, skel.shoulder.y, skel.hip.x + 1, skel.hip.y);
  }

  bres(b, skel.shoulder.x, skel.shoulder.y, skel.lElbow.x, skel.lElbow.y);
  bres(b, skel.lElbow.x, skel.lElbow.y, skel.lHand.x, skel.lHand.y);
  bres(b, skel.shoulder.x, skel.shoulder.y, skel.rElbow.x, skel.rElbow.y);
  bres(b, skel.rElbow.x, skel.rElbow.y, skel.rHand.x, skel.rHand.y);

  bres(b, skel.hip.x, skel.hip.y, skel.lKnee.x, skel.lKnee.y);
  bres(b, skel.lKnee.x, skel.lKnee.y, skel.lFoot.x, skel.lFoot.y);
  bres(b, skel.hip.x, skel.hip.y, skel.rKnee.x, skel.rKnee.y);
  bres(b, skel.rKnee.x, skel.rKnee.y, skel.rFoot.x, skel.rFoot.y);

  return b;
}

function sceneCoding(t: number): Skeleton {
  const s = makeSkeleton();
  s.head.x = 12;
  s.head.y = 7;
  s.neck.x = 12;
  s.neck.y = 10;
  s.shoulder.x = 12;
  s.shoulder.y = 12;
  s.hip.x = 12;
  s.hip.y = 17;
  s.torsoThick = 2;

  s.lElbow.x = 14;
  s.lElbow.y = 14;
  s.rElbow.x = 15;
  s.rElbow.y = 14;

  const typePhase = (t % 0.6) / 0.6;
  const leftUp = Math.sin(typePhase * Math.PI * 2) > 0;
  s.lHand.x = 17;
  s.lHand.y = leftUp ? 15 : 17;
  s.rHand.x = 19;
  s.rHand.y = leftUp ? 17 : 15;

  s.lKnee.x = 12;
  s.lKnee.y = 21;
  s.rKnee.x = 14;
  s.rKnee.y = 21;
  s.lFoot.x = 11;
  s.lFoot.y = 25;
  s.rFoot.x = 15;
  s.rFoot.y = 25;

  s.props = [
    {
      type: "laptop",
      baseX: 16,
      baseY: 18,
      baseW: 10,
      baseH: 1,
      screenX: 22,
      screenY: 12,
      screenW: 6,
      screenH: 6,
    },
  ];

  return s;
}

function sceneRunning(t: number): Skeleton {
  const s = makeSkeleton();
  const phase = (t % 0.6) / 0.6;
  const bob = Math.abs(Math.sin(phase * Math.PI * 2)) * 1;

  s.head.x = 15;
  s.head.y = 6 - bob;
  s.neck.x = 15;
  s.neck.y = 9 - bob;
  s.shoulder.x = 14;
  s.shoulder.y = 11 - bob;
  s.hip.x = 15;
  s.hip.y = 17 - bob;
  s.torsoThick = 2;

  const legSwing = Math.sin(phase * Math.PI * 2) * 55;

  const legJoints = (thighDeg: number) => {
    const thighRad = (thighDeg * Math.PI) / 180;
    const thighLen = 4;
    const kx = s.hip.x + Math.sin(thighRad) * thighLen;
    const ky = s.hip.y + Math.cos(thighRad) * thighLen;
    const shinBend = thighDeg < 0 ? 60 : -10;
    const shinRad = ((thighDeg + shinBend) * Math.PI) / 180;
    const shinLen = 5;
    const fx = kx + Math.sin(shinRad) * shinLen;
    const fy = ky + Math.cos(shinRad) * shinLen;
    return { kx, ky, fx, fy };
  };

  const rLeg = legJoints(legSwing);
  const lLeg = legJoints(-legSwing);
  s.rKnee.x = rLeg.kx;
  s.rKnee.y = rLeg.ky;
  s.rFoot.x = rLeg.fx;
  s.rFoot.y = rLeg.fy;
  s.lKnee.x = lLeg.kx;
  s.lKnee.y = lLeg.ky;
  s.lFoot.x = lLeg.fx;
  s.lFoot.y = lLeg.fy;

  const armSwing = Math.sin(phase * Math.PI * 2) * 40;

  const armJoints = (upperDeg: number) => {
    const upperRad = (upperDeg * Math.PI) / 180;
    const upperLen = 3;
    const ex = s.shoulder.x + Math.sin(upperRad) * upperLen;
    const ey = s.shoulder.y + Math.cos(upperRad) * upperLen;
    const forearmBend = 70;
    const forearmRad = ((upperDeg + forearmBend) * Math.PI) / 180;
    const hx = ex + Math.sin(forearmRad) * 3;
    const hy = ey + Math.cos(forearmRad) * 3;
    return { ex, ey, hx, hy };
  };

  const rArm = armJoints(-armSwing);
  const lArm = armJoints(armSwing);
  s.rElbow.x = rArm.ex;
  s.rElbow.y = rArm.ey;
  s.rHand.x = rArm.hx;
  s.rHand.y = rArm.hy;
  s.lElbow.x = lArm.ex;
  s.lElbow.y = lArm.ey;
  s.lHand.x = lArm.hx;
  s.lHand.y = lArm.hy;

  s.props = [];
  return s;
}

function sceneCooking(t: number): Skeleton {
  const s = makeSkeleton();
  s.head.x = 11;
  s.head.y = 6;
  s.neck.x = 11;
  s.neck.y = 9;
  s.shoulder.x = 11;
  s.shoulder.y = 11;
  s.hip.x = 11;
  s.hip.y = 18;
  s.torsoThick = 2;

  s.lElbow.x = 10;
  s.lElbow.y = 14;
  s.lHand.x = 10;
  s.lHand.y = 17;

  const stirPhase = (t % 1.2) / 1.2;
  const stirX = Math.cos(stirPhase * Math.PI * 2) * 0.8;
  const stirY = Math.sin(stirPhase * Math.PI * 2) * 0.6;

  s.rElbow.x = 14;
  s.rElbow.y = 13;
  s.rHand.x = 18 + stirX;
  s.rHand.y = 14 + stirY;

  s.lKnee.x = 10;
  s.lKnee.y = 22;
  s.rKnee.x = 13;
  s.rKnee.y = 22;
  s.lFoot.x = 10;
  s.lFoot.y = 26;
  s.rFoot.x = 14;
  s.rFoot.y = 26;

  const flameBig = Math.sin(t * 6) > 0;
  s.props = [
    {
      type: "pan",
      x: 19,
      y: 15,
      w: 7,
      h: 1,
      handleX: 17,
      handleY: 14,
      handleW: 2,
    },
    { type: "flame", x: 20, y: flameBig ? 12 : 13, peaks: flameBig ? 3 : 2 },
    { type: "stove", x: 19, y: 16, w: 10, h: 11 },
  ];

  return s;
}

function renderProp(b: Buf, prop: Prop, alpha: number) {
  if (alpha < 0.25) return;
  const dither = alpha < 0.7;
  const shouldDraw = (x: number, y: number) =>
    dither ? (Math.round(x) + Math.round(y)) % 2 === 0 : true;

  if (prop.type === "laptop") {
    for (let i = 0; i < prop.baseW; i++) {
      if (shouldDraw(prop.baseX + i, prop.baseY))
        setPx(b, prop.baseX + i, prop.baseY);
    }
    for (let j = 0; j < prop.screenH; j++) {
      for (let i = 0; i < prop.screenW; i++) {
        const isEdge =
          i === 0 ||
          i === prop.screenW - 1 ||
          j === 0 ||
          j === prop.screenH - 1;
        if (isEdge && shouldDraw(prop.screenX + i, prop.screenY + j)) {
          setPx(b, prop.screenX + i, prop.screenY + j);
        }
      }
    }
    if (shouldDraw(prop.baseX + prop.baseW - 1, prop.baseY - 1))
      setPx(b, prop.baseX + prop.baseW - 1, prop.baseY - 1);
  }

  if (prop.type === "pan") {
    for (let i = 0; i < prop.w; i++) {
      if (shouldDraw(prop.x + i, prop.y)) setPx(b, prop.x + i, prop.y);
    }
    if (shouldDraw(prop.x, prop.y + 1)) setPx(b, prop.x, prop.y + 1);
    if (shouldDraw(prop.x + prop.w - 1, prop.y + 1))
      setPx(b, prop.x + prop.w - 1, prop.y + 1);
    for (let i = 0; i < prop.handleW; i++) {
      if (shouldDraw(prop.handleX + i, prop.handleY))
        setPx(b, prop.handleX + i, prop.handleY);
    }
  }

  if (prop.type === "flame") {
    const baseY = prop.y + 2;
    const peaks = prop.peaks;
    for (let p = 0; p < peaks; p++) {
      const px = prop.x + p * 2;
      const peakH = 2 + (p % 2);
      for (let j = 0; j < peakH; j++) {
        if (shouldDraw(px, baseY - j)) setPx(b, px, baseY - j);
      }
    }
    for (let i = 0; i < peaks * 2; i++) {
      if (shouldDraw(prop.x + i, baseY + 1)) setPx(b, prop.x + i, baseY + 1);
    }
  }

  if (prop.type === "stove") {
    for (let i = 0; i < prop.w; i++) {
      if (shouldDraw(prop.x + i, prop.y + prop.h - 1))
        setPx(b, prop.x + i, prop.y + prop.h - 1);
    }
    for (let j = 0; j < prop.h; j++) {
      if (shouldDraw(prop.x, prop.y + j)) setPx(b, prop.x, prop.y + j);
      if (shouldDraw(prop.x + prop.w - 1, prop.y + j))
        setPx(b, prop.x + prop.w - 1, prop.y + j);
    }
  }
}

const SCENES: Array<{ fn: (t: number) => Skeleton; label: string }> = [
  { fn: sceneCoding, label: "coding" },
  { fn: sceneRunning, label: "running" },
  { fn: sceneCooking, label: "cooking" },
];

const HOLD_MS = 2500;
const MORPH_MS = 1200;

const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

export function mountSkeleton(
  canvas: HTMLCanvasElement,
  label: HTMLElement,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;

  const drawBuf = (buf: Buf) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = FG;
    for (let r = 0; r < SZ; r++) {
      for (let c = 0; c < SZ; c++) {
        if (buf[r][c]) ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
      }
    }
  };

  let currentIdx = 0;
  let phaseStart = performance.now();
  let inMorph = false;
  label.textContent = SCENES[0].label;

  const tick = (ts: number) => {
    requestAnimationFrame(tick);
    const tSec = ts / 1000;
    const elapsed = ts - phaseStart;

    if (!inMorph) {
      const s = SCENES[currentIdx].fn(tSec);
      const buf = renderSkeleton(s);
      for (const p of s.props) renderProp(buf, p, 1);
      drawBuf(buf);

      if (elapsed >= HOLD_MS) {
        inMorph = true;
        phaseStart = ts;
        label.style.opacity = "0";
      }
    } else {
      const nextIdx = (currentIdx + 1) % SCENES.length;
      const m = Math.min(elapsed / MORPH_MS, 1);
      const eased = easeInOut(m);

      const sA = SCENES[currentIdx].fn(tSec);
      const sB = SCENES[nextIdx].fn(tSec);
      const sMid = lerpSkeleton(sA, sB, eased);

      const buf = renderSkeleton(sMid);
      for (const p of sA.props) renderProp(buf, p, 1 - eased);
      for (const p of sB.props) renderProp(buf, p, eased);
      drawBuf(buf);

      if (m >= 1) {
        inMorph = false;
        currentIdx = nextIdx;
        phaseStart = ts;
        label.textContent = SCENES[currentIdx].label;
        label.style.opacity = "1";
      }
    }
  };

  requestAnimationFrame(tick);
}
