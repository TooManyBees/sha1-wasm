const rustSha1 = require("../dist");
const jsSha1 = require("sha1");
const crypto = require('crypto');
const Benchmark = require("benchmark");

const suite = new Benchmark.Suite;

const testString = "someKey" + ":someValue".repeat(10);
console.log(`Test string is ${testString.length} chars long`);

suite
.add('pure js', function() {
  jsSha1(testString);
})
.add('node crypto', function() {
  crypto.createHash('sha1').update(testString).digest('hex');
})
.add('rust/wasm', function() {
  rustSha1(testString);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run();
