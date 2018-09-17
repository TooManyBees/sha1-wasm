# sha1-wasm

It's the [Rust sha1 crate](https://crates.io/crates/sha1) compiled to WebAssembly
and bundled into a Node module.

## Usage

```javascript
const digest = require('./sha1');
digest("Hi there!"); // '95e2b07e12754e52c37cfd485544d4f444597bff'
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
js x 137,263 ops/sec ±1.20% (89 runs sampled)
rust/wasm x 496,747 ops/sec ±0.91% (89 runs sampled)
```
