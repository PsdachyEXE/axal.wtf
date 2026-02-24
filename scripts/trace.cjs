const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'axal.png');
const outputFile = path.join(__dirname, '..', 'public', 'logo.svg');

potrace.trace(inputFile, {
  blackOnWhite: false,
  threshold: 180,
  turdSize: 2,
  alphaMax: 1,
  optTolerance: 0.1,
}, (err, svg) => {
  if (err) { console.error('Error:', err); process.exit(1); }
  fs.writeFileSync(outputFile, svg);
  console.log('SVG written, size:', svg.length, 'bytes');
});
