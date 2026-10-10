import assert from 'node:assert/strict';
import {render, audit} from '../tools/badge.mjs';
const svg = render('pressure', 'healthy', 'green');
assert(svg.includes('pressure: healthy'));
assert.throws(() => render('x', 'y', 'javascript:alert(1)'));
const result = audit('![badge](https://img.shields.io/badge/test-passed-green)');
console.log(JSON.stringify({svgBytes: Buffer.byteLength(svg), maliciousColorRejected: true, audited: result}));
