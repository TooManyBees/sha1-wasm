# sha1-wasm

It's the [Rust sha1 crate](https://crates.io/crates/sha1) compiled to WebAssembly
and bundled into a Node module.

## Usage

### In Node.js

```javascript
const digest = require('./sha1');
digest("Hi there!"); // '95e2b07e12754e52c37cfd485544d4f444597bff'
```

### In web

Instead of importing the root level of the package, import `'sha1/web'` which
loads the module from an array literal. This uses triple the byte size, but then
it's not intended to be the primary use case.

```javascript
const sha1 = require('./sha1/web');
sha1.then(digest => {
  /* do your thing; I don't know how to load modules asynchronously,
     and I'm glad I don't need to
   */);
```

## Building

You need Rust nightly installed with the `wasm32-unknown-unknown` target.

```bash
curl https://sh.rustup.rs -sSf | sh

rustup toolchain install nightly

rustup target add wasm32-unknown-unknown
```

You also need `wasm-gc` installed.

```bash
cargo install wasm-gc
```

From the project root, run the shell script `rust2wasm.sh`. This will compile
the Rust code and bundle the resulting WebAssembly into JavaScript files.

At this point, the `.js` files in `dist` can be copied by themselves into a
project, or bundled into a package.

## Benchmark

This module is in general 3x faster than the all-JavaScript `sha1` package on npm,
and the gap increases with the length of the source bytes. To run the benchmark,
`node benchmark.js` from the `benchmark` folder.

```
$ node benchmark.js
Test string is 107 chars long
pure js x 136,241 ops/sec ±0.82% (89 runs sampled)
node crypto x 407,798 ops/sec ±6.95% (71 runs sampled)
rust/wasm x 497,166 ops/sec ±0.70% (90 runs sampled)
```
