const glue = require('./glue');
const wasmBytes = require('./sha1.wasm.js');
module.exports = glue(wasmBytes);
