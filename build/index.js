let sha1;
let BUFFER_SIZE;
let loaded;
{
  const wasmBytes = require('./sha1.wasm.js');
  loaded = WebAssembly.instantiate(wasmBytes)
  .then(wasm => {
    const { digest, alloc, free, memory, buffer_size } = wasm.instance.exports;
    BUFFER_SIZE = buffer_size();
    sha1 = { digest, alloc, free, memory };
  });
}

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
  const digestBytes = memorySlice(digestPtr, BUFFER_SIZE);
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

digest.loaded = loaded;

module.exports = digest;
