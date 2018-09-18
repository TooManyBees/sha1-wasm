const fs = require('fs');
const path = require('path');
const glue = require('./glue');
const wasmBytes = fs.readFileSync(path.join(__dirname, 'sha1.wasm'));
module.exports = glue(wasmBytes);
