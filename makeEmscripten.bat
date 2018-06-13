:: **** use the "-s WASM" switch to compile WebAssembly output. warning: the SINGLE_FILE approach does NOT currently work in Chrome 63.. ****
emcc.bat -s WASM=0 -Os -O3 -s ASSERTIONS=1 -s SAFE_HEAP=0  -s VERBOSE=0 -Wno-pointer-sign --closure 1 --llvm-lto 1 -I./src  --memory-init-file 0  -s NO_FILESYSTEM=1 adapter.c src/ayumi.c src/load_text.c -s EXPORTED_FUNCTIONS="['_loadSongFile', '_getSoundBuffer', '_getSoundBufferLen', '_computeAudioSamples', '_getBufferVoice1', '_getBufferVoice2', '_getBufferVoice3', '_malloc', '_free']" -o htdocs/ayumi.js -s SINGLE_FILE=0 -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']  -s BINARYEN_ASYNC_COMPILATION=1 -s BINARYEN_TRAP_MODE='clamp' && copy /b shell-pre.js + htdocs\ayumi.js + shell-post.js htdocs\ayumi3.js && del htdocs\ayumi.js && copy /b htdocs\ayumi3.js + pako_inflate.min.js + lh4.min.js + ayumi_adapter.js htdocs\backend_ayumi.js && del htdocs\ayumi3.js