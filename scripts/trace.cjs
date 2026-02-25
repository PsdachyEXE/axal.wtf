/**
 * trace.cjs
 *
 * Pipeline:
 *   1. Trace axal.png with potrace (optCurve:true, high optTolerance)
 *      → smooth Bezier curves everywhere (ring arcs are beautiful circles)
 *   2. Post-process: for every cubic Bezier C, if both control points lie
 *      within 2% of the chord length from the chord line, the segment is
 *      "nearly straight" and gets replaced with an L command.
 *      → ring arcs stay as smooth curves; A-leg edges become straight lines.
 */

const potrace = require('potrace');
const fs      = require('fs');
const path    = require('path');

const INPUT  = path.join(__dirname, '..', 'axal.png');
const OUTPUT = path.join(__dirname, '..', 'public', 'logo.svg');

// ── Geometry helpers ─────────────────────────────────────────────────────────

function ptLineDist(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const len2 = abx * abx + aby * aby;
  if (len2 < 1e-12) return Math.hypot(px - ax, py - ay);
  return Math.abs(abx * (ay - py) - aby * (ax - px)) / Math.sqrt(len2);
}

// ── SVG path parser / serialiser ─────────────────────────────────────────────

function parsePath(d) {
  const cmds = [];
  const re   = /([MmLlCcZz])\s*([-\d. ,]*)/g;
  let m;
  while ((m = re.exec(d)) !== null) {
    const nums = m[2].trim()
      ? m[2].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
      : [];
    cmds.push({ cmd: m[1], args: nums });
  }
  return cmds;
}

function serializePath(cmds) {
  return cmds.map(({ cmd, args }) =>
    cmd === 'Z' ? 'Z' : cmd + ' ' + args.map(n => n.toFixed(3)).join(' ')
  ).join(' ');
}

// ── Straightener ─────────────────────────────────────────────────────────────
//
// STRAIGHT_RATIO: if max(dist(P1,chord), dist(P2,chord)) / chord_len < this
//                 value, the Bezier is replaced with a straight L command.
//
// Empirical values for this logo:
//   - A-leg diagonal edges:  ratio ≈ 0.001–0.005  → straightened ✓
//   - Ring arcs:             ratio ≈ 0.05–0.30    → kept as curves ✓

const STRAIGHT_RATIO = 0.02;

function straighten(cmds) {
  const out = [];
  let cx = 0, cy = 0;

  for (const { cmd, args } of cmds) {
    if (cmd === 'M') {
      cx = args[0]; cy = args[1];
      out.push({ cmd, args: [...args] });

    } else if (cmd === 'L') {
      cx = args[0]; cy = args[1];
      out.push({ cmd, args: [...args] });

    } else if (cmd === 'C') {
      // Each C carries one or more cubic segments (6 numbers each)
      let i = 0, ox = cx, oy = cy;
      while (i + 5 < args.length) {
        const x1 = args[i],   y1 = args[i+1];
        const x2 = args[i+2], y2 = args[i+3];
        const ex = args[i+4], ey = args[i+5];

        const chord = Math.hypot(ex - ox, ey - oy);
        const isFlat = chord > 1e-6 &&
          Math.max(
            ptLineDist(x1, y1, ox, oy, ex, ey),
            ptLineDist(x2, y2, ox, oy, ex, ey)
          ) / chord < STRAIGHT_RATIO;

        out.push(isFlat
          ? { cmd: 'L', args: [ex, ey] }
          : { cmd: 'C', args: [x1, y1, x2, y2, ex, ey] }
        );

        ox = ex; oy = ey;
        i += 6;
      }
      cx = ox; cy = oy;

    } else if (cmd === 'Z' || cmd === 'z') {
      out.push({ cmd: 'Z', args: [] });
    }
  }
  return out;
}

// ── Main ─────────────────────────────────────────────────────────────────────

potrace.trace(INPUT, {
  blackOnWhite : false,
  threshold    : 128,
  turdSize     : 2,
  alphaMax     : 1.33,
  optCurve     : true,
  optTolerance : 10,   // high tolerance → few large smooth curves
}, (err, svg) => {
  if (err) { console.error(err); process.exit(1); }

  const match = svg.match(/d="([^"]+)"/);
  if (!match) { console.error('No path found in SVG'); process.exit(1); }

  const parsed    = parsePath(match[1]);
  const cleaned   = straighten(parsed);
  const finalSvg  = svg.replace(/d="[^"]+"/, `d="${serializePath(cleaned)}"`);

  const cBefore = parsed.filter(c => c.cmd === 'C').length;
  const lBefore = parsed.filter(c => c.cmd === 'L').length;
  const cAfter  = cleaned.filter(c => c.cmd === 'C').length;
  const lAfter  = cleaned.filter(c => c.cmd === 'L').length;

  console.log(`Before: C=${cBefore} L=${lBefore}`);
  console.log(`After:  C=${cAfter}  L=${lAfter}  (${cBefore - cAfter} curves → straight lines)`);

  fs.writeFileSync(OUTPUT, finalSvg);
  console.log(`✓ ${OUTPUT}  (${finalSvg.length} bytes)`);
});
