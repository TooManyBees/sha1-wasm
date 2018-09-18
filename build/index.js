const wasmModule = require('./sha1.wasm.js');
const sha1 = (function() {
  const instance = new WebAssembly.Instance(wasmModule, {});
  const { digest, alloc, free, memory, buffer_size } = instance.exports;
  return { digest, alloc, free, memory, BUFFER_SIZE: buffer_size() };
})();

function memorySlice(ptr, len) {
  return new Uint8Array(sha1.memory.buffer, ptr, len);
}

function writeStringToMemory(text) {
  const buf = Buffer.from(text, 'utf-8');
  const ptr = sha1.alloc(buf.length);
  const slice = memorySlice(ptr, buf.length);
  buf.copy(slice);
  return slice;
}

function readHashFromMemory(digestPtr) {
  const digestBytes = memorySlice(digestPtr, sha1.BUFFER_SIZE);
  const hash = Buffer.from(digestBytes).toString('hex');
  free(digestBytes);
  return hash;
}

function free(array) {
  sha1.free(array.byteOffset, array.byteLength);
}

function digest(text) {
  const textSlice = writeStringToMemory(text);
  const digestPtr = sha1.digest(textSlice.byteOffset, textSlice.byteLength) // frees the memory in textSlide
  return readHashFromMemory(digestPtr);
}

module.exports = digest;
