const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'axal.png');
const outputFile = path.join(__dirname, '..', 'public', 'logo.svg');

potrace.trace(inputFile, {
  blackOnWhite: false,
  threshold: 180,
  turdSize: 2,
  alphaMax: 0,       // 0 = all corners forced sharp (no rounding)
  optCurve: false,   // disable Bezier fitting → output only M/L/Z (straight lines)
}, (err, svg) => {
  if (err) { console.error('Error:', err); process.exit(1); }
  fs.writeFileSync(outputFile, svg);
  console.log('SVG written, size:', svg.length, 'bytes');
});
