const rustSha1 = require("../dist");
const nodeSha1 = require("sha1");
const Benchmark = require("benchmark");

const suite = new Benchmark.Suite;

const testString = "someKey" + ":someValue".repeat(10);
console.log(`Test string is ${testString.length} chars long`);

suite
.add('js', function() {
  nodeSha1(testString);
})
.add('rust/wasm', function() {
  rustSha1(testString);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run();
