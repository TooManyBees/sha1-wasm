// Boilerplate to work in both wasm32/no_std and in tests

#![cfg_attr(target_arch = "wasm32", no_std)]
#![cfg_attr(target_arch = "wasm32", feature(alloc, core_intrinsics, panic_implementation, lang_items, alloc_error_handler))]

extern crate wee_alloc;
#[cfg(target_arch = "wasm32")] extern crate alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(target_arch = "wasm32")]
#[panic_handler]
#[no_mangle]
pub fn panic(_: &::core::panic::PanicInfo) -> ! {
    unsafe { ::core::intrinsics::abort(); }
}

#[cfg(target_arch = "wasm32")]
#[alloc_error_handler]
#[no_mangle]
pub extern fn oom(_: ::core::alloc::Layout) -> ! {
    unsafe { ::core::intrinsics::abort(); }
}

#[cfg(not(target_arch = "wasm32"))] use std::{mem};
#[cfg(target_arch = "wasm32")] use core::{mem};
#[cfg(target_arch = "wasm32")] use alloc::prelude::{Vec};

// End boilerplate

extern crate sha1 as rust_sha1;

#[no_mangle]
pub extern "C" fn buffer_size() -> usize {
  rust_sha1::DIGEST_LENGTH
}

#[no_mangle]
pub extern "C" fn digest(ptr: *mut u8, len: usize) -> *const u8 {
  let data = unsafe { Vec::from_raw_parts(ptr, len, len) };
  let mut m = rust_sha1::Sha1::new();
  m.update(&data);
  let vec = m.digest().bytes().to_vec();
  let return_ptr = vec.as_ptr();
  mem::forget(vec);
  return_ptr
}

#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    ptr
}

#[no_mangle]
pub extern "C" fn free(ptr: *mut u8, len: usize) {
    let _vec = unsafe { Vec::from_raw_parts(ptr, len, len) };
}
