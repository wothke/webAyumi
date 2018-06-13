// create separate namespace for all the Emscripten stuff.. otherwise naming clashes may occur especially when 
// optimizing using closure compiler..
window.spp_backend_state_AYUMI= {
	notReady: true,
	adapterCallback: function(){}	// overwritten later	
};
window.spp_backend_state_AYUMI["onRuntimeInitialized"] = function() {	// emscripten callback needed in case async init is used (e.g. for WASM)
	this.notReady= false;
	this.adapterCallback();
}.bind(window.spp_backend_state_AYUMI);

var backend_AYUMI = (function(Module) {
var a;a||(a=typeof Module !== 'undefined' ? Module : {});var e={},h;for(h in a)a.hasOwnProperty(h)&&(e[h]=a[h]);a.arguments=[];a.thisProgram="./this.program";a.quit=function(b,c){throw c;};a.preRun=[];a.postRun=[];var k=!1,l=!1,p=!1,q=!1;
if(a.ENVIRONMENT)if("WEB"===a.ENVIRONMENT)k=!0;else if("WORKER"===a.ENVIRONMENT)l=!0;else if("NODE"===a.ENVIRONMENT)p=!0;else if("SHELL"===a.ENVIRONMENT)q=!0;else throw Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.");else k="object"===typeof window,l="function"===typeof importScripts,p="object"===typeof process&&"function"===typeof require&&!k&&!l,q=!k&&!p&&!l;
if(p){var t,u;a.read=function(b,c){t||(t=require("fs"));u||(u=require("path"));b=u.normalize(b);b=t.readFileSync(b);return c?b:b.toString()};a.readBinary=function(b){b=a.read(b,!0);b.buffer||(b=new Uint8Array(b));assert(b.buffer);return b};1<process.argv.length&&(a.thisProgram=process.argv[1].replace(/\\/g,"/"));a.arguments=process.argv.slice(2);"undefined"!==typeof module&&(module.exports=a);process.on("uncaughtException",function(b){if(!(b instanceof v))throw b;});process.on("unhandledRejection",
function(){a.printErr("node.js exiting due to unhandled promise rejection");process.exit(1)});a.inspect=function(){return"[Emscripten Module object]"}}else if(q)"undefined"!=typeof read&&(a.read=function(b){return read(b)}),a.readBinary=function(b){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(b));b=read(b,"binary");assert("object"===typeof b);return b},"undefined"!=typeof scriptArgs?a.arguments=scriptArgs:"undefined"!=typeof arguments&&(a.arguments=arguments),"function"===typeof quit&&
(a.quit=function(b){quit(b)});else if(k||l)a.read=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},l&&(a.readBinary=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),a.readAsync=function(b,c,f){var d=new XMLHttpRequest;d.open("GET",b,!0);d.responseType="arraybuffer";d.onload=function(){200==d.status||0==d.status&&d.response?c(d.response):f()};d.onerror=f;d.send(null)},"undefined"!=
typeof arguments&&(a.arguments=arguments),a.setWindowTitle=function(b){document.title=b};else throw Error("unknown runtime environment");a.print="undefined"!==typeof console?console.log:"undefined"!==typeof print?print:null;a.printErr="undefined"!==typeof printErr?printErr:"undefined"!==typeof console&&console.warn||a.print;a.print=a.print;a.printErr=a.printErr;for(h in e)e.hasOwnProperty(h)&&(a[h]=e[h]);e=void 0;w=x=y=function(){z("cannot use the stack before compiled code is ready to run, and has provided stack access")};
function aa(b){var c;c||(c=16);return Math.ceil(b/c)*c}function ba(b){A||(A={});A[b]||(A[b]=1,a.printErr(b))}var A,B=0;function assert(b,c){b||z("Assertion failed: "+c)}
var da={stackSave:function(){w()},stackRestore:function(){x()},arrayToC:function(b){var c=y(b.length);assert(0<=b.length,"writeArrayToMemory array must have a length (should be an array or typed array)");ca.set(b,c);return c},stringToC:function(b){var c=0;if(null!==b&&void 0!==b&&0!==b){var f=(b.length<<2)+1,d=c=y(f);assert("number"==typeof f,"stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");var m=C;if(0<f){f=d+f-1;for(var n=
0;n<b.length;++n){var g=b.charCodeAt(n);55296<=g&&57343>=g&&(g=65536+((g&1023)<<10)|b.charCodeAt(++n)&1023);if(127>=g){if(d>=f)break;m[d++]=g}else{if(2047>=g){if(d+1>=f)break;m[d++]=192|g>>6}else{if(65535>=g){if(d+2>=f)break;m[d++]=224|g>>12}else{if(2097151>=g){if(d+3>=f)break;m[d++]=240|g>>18}else{if(67108863>=g){if(d+4>=f)break;m[d++]=248|g>>24}else{if(d+5>=f)break;m[d++]=252|g>>30;m[d++]=128|g>>24&63}m[d++]=128|g>>18&63}m[d++]=128|g>>12&63}m[d++]=128|g>>6&63}m[d++]=128|g&63}}m[d]=0}}return c}},
ea={string:da.stringToC,array:da.arrayToC};
function fa(b){var c;if(0===c||!b)return"";for(var f=0,d,m=0;;){assert(b+m<D);d=C[b+m>>0];f|=d;if(0==d&&!c)break;m++;if(c&&m==c)break}c||(c=m);d="";if(128>f){for(;0<c;)f=String.fromCharCode.apply(String,C.subarray(b,b+Math.min(c,1024))),d=d?d+f:f,b+=1024,c-=1024;return d}a:{c=C;for(f=b;c[f];)++f;if(16<f-b&&c.subarray&&ha)b=ha.decode(c.subarray(b,f));else for(f="";;){d=c[b++];if(!d){b=f;break a}if(d&128)if(m=c[b++]&63,192==(d&224))f+=String.fromCharCode((d&31)<<6|m);else{var n=c[b++]&63;if(224==(d&
240))d=(d&15)<<12|m<<6|n;else{var g=c[b++]&63;if(240==(d&248))d=(d&7)<<18|m<<12|n<<6|g;else{var r=c[b++]&63;if(248==(d&252))d=(d&3)<<24|m<<18|n<<12|g<<6|r;else{var Y=c[b++]&63;d=(d&1)<<30|m<<24|n<<18|g<<12|r<<6|Y}}}65536>d?f+=String.fromCharCode(d):(d-=65536,f+=String.fromCharCode(55296|d>>10,56320|d&1023))}else f+=String.fromCharCode(d)}}return b}var ha="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");
function ia(b){return b.replace(/__Z[\w\d_]+/g,function(b){ba("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");return b===b?b:b+" ["+b+"]"})}function ja(){a:{var b=Error();if(!b.stack){try{throw Error(0);}catch(c){b=c}if(!b.stack){b="(no stack trace available)";break a}}b=b.stack.toString()}a.extraStackTrace&&(b+="\n"+a.extraStackTrace());return ia(b)}var buffer,ca,C,ka,E,F;
function la(){a.HEAP8=ca=new Int8Array(buffer);a.HEAP16=ka=new Int16Array(buffer);a.HEAP32=E=new Int32Array(buffer);a.HEAPU8=C=new Uint8Array(buffer);a.HEAPU16=new Uint16Array(buffer);a.HEAPU32=F=new Uint32Array(buffer);a.HEAPF32=new Float32Array(buffer);a.HEAPF64=new Float64Array(buffer)}var G,H,I,ma,J,K,L,M;G=H=ma=J=K=L=M=0;I=!1;
function N(){34821223==F[(K>>2)-1]&&2310721022==F[(K>>2)-2]||z("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x"+F[(K>>2)-2].toString(16)+" "+F[(K>>2)-1].toString(16));if(1668509029!==E[0])throw"Runtime error: The application has corrupted its heap memory area (address zero)!";}
function na(){z("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+D+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}var oa=a.TOTAL_STACK||5242880,D=a.TOTAL_MEMORY||16777216;D<oa&&a.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+D+"! (TOTAL_STACK="+oa+")");
assert("undefined"!==typeof Int32Array&&"undefined"!==typeof Float64Array&&void 0!==Int32Array.prototype.subarray&&void 0!==Int32Array.prototype.set,"JS engine does not provide full typed array support");
a.buffer?(buffer=a.buffer,assert(buffer.byteLength===D,"provided buffer should be "+D+" bytes, but it is "+buffer.byteLength)):("object"===typeof WebAssembly&&"function"===typeof WebAssembly.Memory?(assert(0===D%65536),a.wasmMemory=new WebAssembly.Memory({initial:D/65536,maximum:D/65536}),buffer=a.wasmMemory.buffer):buffer=new ArrayBuffer(D),assert(buffer.byteLength===D),a.buffer=buffer);la();E[0]=1668509029;ka[1]=25459;
if(115!==C[2]||99!==C[3])throw"Runtime error: expected the system to be little-endian!";function O(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c();else{var f=c.f;"number"===typeof f?void 0===c.a?a.dynCall_v(f):a.dynCall_vi(f,c.a):f(void 0===c.a?null:c.a)}}}var pa=[],qa=[],ra=[],sa=[],ta=[],P=!1,Q=!1;function ua(){var b=a.preRun.shift();pa.unshift(b)}assert(Math.imul&&Math.fround&&Math.clz32&&Math.trunc,"this is a legacy browser, build with LEGACY_VM_SUPPORT");
var S=0,T=null,U=null,V={};function va(){S++;a.monitorRunDependencies&&a.monitorRunDependencies(S);assert(!V["wasm-instantiate"]);V["wasm-instantiate"]=1;null===T&&"undefined"!==typeof setInterval&&(T=setInterval(function(){if(B)clearInterval(T),T=null;else{var b=!1,c;for(c in V)b||(b=!0,a.printErr("still waiting on run dependencies:")),a.printErr("dependency: "+c);b&&a.printErr("(end of list)")}},1E4))}a.preloadedImages={};a.preloadedAudios={};
function wa(){z("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1")}a.FS_createDataFile=function(){wa()};a.FS_createPreloadedFile=function(){wa()};function W(b){return String.prototype.startsWith?b.startsWith("data:application/octet-stream;base64,"):0===b.indexOf("data:application/octet-stream;base64,")}
(function(){function b(){try{if(a.wasmBinary)return new Uint8Array(a.wasmBinary);if(a.readBinary)return a.readBinary(m);throw"on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";}catch(R){z(R)}}function c(){return a.wasmBinary||!k&&!l||"function"!==typeof fetch?new Promise(function(c){c(b())}):fetch(m,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+m+
"'";return b.arrayBuffer()}).catch(function(){return b()})}function f(b){function d(b){r=b.exports;if(r.memory){b=r.memory;var c=a.buffer;b.byteLength<c.byteLength&&a.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");c=new Int8Array(c);(new Int8Array(b)).set(c);a.buffer=buffer=b;la()}a.asm=r;a.usingWasm=!0;S--;a.monitorRunDependencies&&a.monitorRunDependencies(S);assert(V["wasm-instantiate"]);delete V["wasm-instantiate"];0==S&&(null!==
T&&(clearInterval(T),T=null),U&&(b=U,U=null,b()))}function f(b){assert(a===R,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");R=null;d(b.instance)}function n(b){c().then(function(b){return WebAssembly.instantiate(b,g)}).then(b).catch(function(b){a.printErr("failed to asynchronously prepare wasm: "+b);z(b)})}if("object"!==typeof WebAssembly)return a.printErr("no native wasm support detected"),!1;if(!(a.wasmMemory instanceof WebAssembly.Memory))return a.printErr("no native wasm Memory in use"),
!1;b.memory=a.wasmMemory;g.global={NaN:NaN,Infinity:Infinity};g["global.Math"]=Math;g.env=b;va();if(a.instantiateWasm)try{return a.instantiateWasm(g,d)}catch(za){return a.printErr("Module.instantiateWasm callback failed with error: "+za),!1}var R=a;a.wasmBinary||"function"!==typeof WebAssembly.instantiateStreaming||W(m)||"function"!==typeof fetch?n(f):WebAssembly.instantiateStreaming(fetch(m,{credentials:"same-origin"}),g).then(f).catch(function(b){a.printErr("wasm streaming compile failed: "+b);
a.printErr("falling back to ArrayBuffer instantiation");n(f)});return{}}var d="ayumi.wast",m="ayumi.wasm",n="ayumi.temp.asm.js";"function"===typeof a.locateFile&&(W(d)||(d=a.locateFile(d)),W(m)||(m=a.locateFile(m)),W(n)||(n=a.locateFile(n)));var g={global:null,env:null,asm2wasm:{"f64-rem":function(b,c){return b%c},"debugger":function(){debugger}},parent:a},r=null;a.asmPreload=a.asm;var Y=a.reallocBuffer;a.reallocBuffer=function(b){if("asmjs"===Ba)var c=Y(b);else a:{var d=a.usingWasm?65536:16777216;
0<b%d&&(b+=d-b%d);d=a.buffer.byteLength;if(a.usingWasm)try{c=-1!==a.wasmMemory.grow((b-d)/65536)?a.buffer=a.wasmMemory.buffer:null;break a}catch(Aa){console.error("Module.reallocBuffer: Attempted to grow from "+d+" bytes to "+b+" bytes, but got error: "+Aa);c=null;break a}c=void 0}return c};var Ba="";a.asm=function(b,c){if(!c.table){b=a.wasmTableSize;void 0===b&&(b=1024);var d=a.wasmMaxTableSize;c.table="object"===typeof WebAssembly&&"function"===typeof WebAssembly.Table?void 0!==d?new WebAssembly.Table({initial:b,
maximum:d,element:"anyfunc"}):new WebAssembly.Table({initial:b,element:"anyfunc"}):Array(b);a.wasmTable=c.table}c.memoryBase||(c.memoryBase=a.STATIC_BASE);c.tableBase||(c.tableBase=0);(c=f(c))||z("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");return c}})();G=1024;H=G+138496;qa.push();a.STATIC_BASE=G;a.STATIC_BUMP=138496;var xa=H;H+=16;assert(0==xa%8);assert(!I);var ya=H;
H=H+4+15&-16;M=ya;ma=J=aa(H);K=ma+oa;L=aa(K);E[M>>2]=L;I=!0;assert(L<D,"TOTAL_MEMORY not big enough for stack");a.wasmTableSize=13;a.wasmMaxTableSize=13;a.b={};
a.c={enlargeMemory:function(){na()},getTotalMemory:function(){return D},abortOnCannotGrowMemory:na,abortStackOverflow:function(b){z("Stack overflow! Attempted to allocate "+b+" bytes on the stack, but stack has only "+(K-w()+b)+" bytes available!")},nullFunc_ii:function(b){a.printErr("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");a.printErr("Build with ASSERTIONS=2 for more info.");
z(b)},nullFunc_iiii:function(b){a.printErr("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");a.printErr("Build with ASSERTIONS=2 for more info.");z(b)},nullFunc_vi:function(b){a.printErr("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");
a.printErr("Build with ASSERTIONS=2 for more info.");z(b)},___setErrNo:function(b){a.___errno_location?E[a.___errno_location()>>2]=b:a.printErr("failed to set errno from JS");return b},DYNAMICTOP_PTR:M,STACKTOP:J,STACK_MAX:K};var X=a.asm(a.b,a.c,buffer),Ca=X._computeAudioSamples;
X._computeAudioSamples=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ca.apply(null,arguments)};var Da=X._free;X._free=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Da.apply(null,arguments)};
var Ea=X._getBufferVoice1;X._getBufferVoice1=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ea.apply(null,arguments)};var Fa=X._getBufferVoice2;
X._getBufferVoice2=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Fa.apply(null,arguments)};var Ga=X._getBufferVoice3;
X._getBufferVoice3=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ga.apply(null,arguments)};var Ha=X._getSoundBuffer;
X._getSoundBuffer=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ha.apply(null,arguments)};var Ia=X._getSoundBufferLen;
X._getSoundBufferLen=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ia.apply(null,arguments)};var Ja=X._loadSongFile;
X._loadSongFile=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ja.apply(null,arguments)};var Ka=X._malloc;X._malloc=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ka.apply(null,arguments)};
var La=X._sbrk;X._sbrk=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return La.apply(null,arguments)};var Ma=X._setOptions;
X._setOptions=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ma.apply(null,arguments)};var Na=X.establishStackSpace;
X.establishStackSpace=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Na.apply(null,arguments)};var Oa=X.getTempRet0;
X.getTempRet0=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Oa.apply(null,arguments)};var Pa=X.setTempRet0;X.setTempRet0=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Pa.apply(null,arguments)};
var Qa=X.setThrew;X.setThrew=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Qa.apply(null,arguments)};var Ra=X.stackAlloc;
X.stackAlloc=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ra.apply(null,arguments)};var Sa=X.stackRestore;X.stackRestore=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Sa.apply(null,arguments)};
var Ta=X.stackSave;X.stackSave=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Ta.apply(null,arguments)};a.asm=X;
a._computeAudioSamples=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._computeAudioSamples.apply(null,arguments)};
a._free=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._free.apply(null,arguments)};
a._getBufferVoice1=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._getBufferVoice1.apply(null,arguments)};
a._getBufferVoice2=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._getBufferVoice2.apply(null,arguments)};
a._getBufferVoice3=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._getBufferVoice3.apply(null,arguments)};
a._getSoundBuffer=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._getSoundBuffer.apply(null,arguments)};
a._getSoundBufferLen=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._getSoundBufferLen.apply(null,arguments)};
a._loadSongFile=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._loadSongFile.apply(null,arguments)};
a._malloc=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._malloc.apply(null,arguments)};a._sbrk=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._sbrk.apply(null,arguments)};
a._setOptions=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm._setOptions.apply(null,arguments)};
a.establishStackSpace=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.establishStackSpace.apply(null,arguments)};
a.getTempRet0=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.getTempRet0.apply(null,arguments)};
a.setTempRet0=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.setTempRet0.apply(null,arguments)};
a.setThrew=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.setThrew.apply(null,arguments)};
var y=a.stackAlloc=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.stackAlloc.apply(null,arguments)},x=a.stackRestore=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.stackRestore.apply(null,
arguments)},w=a.stackSave=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.stackSave.apply(null,arguments)};
a.dynCall_vi=function(){assert(P,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!Q,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return a.asm.dynCall_vi.apply(null,arguments)};a.asm=X;a.intArrayFromString||(a.intArrayFromString=function(){z("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.intArrayToString||(a.intArrayToString=function(){z("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.ccall=function(b,c,f,d){var m=a["_"+b];assert(m,"Cannot call unknown function "+b+", make sure it is exported");var n=[];b=0;assert("array"!==c,'Return type should not be "array".');if(d)for(var g=0;g<d.length;g++){var r=ea[f[g]];r?(0===b&&(b=w()),n[g]=r(d[g])):n[g]=d[g]}f=m.apply(null,n);"string"===c&&(f=fa(f));0!==b&&x(b);return f};a.cwrap||(a.cwrap=function(){z("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.setValue||(a.setValue=function(){z("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.getValue||(a.getValue=function(){z("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.allocate||(a.allocate=function(){z("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.getMemory||(a.getMemory=function(){z("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});
a.Pointer_stringify||(a.Pointer_stringify=function(){z("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.AsciiToString||(a.AsciiToString=function(){z("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.stringToAscii||(a.stringToAscii=function(){z("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.UTF8ArrayToString||(a.UTF8ArrayToString=function(){z("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.UTF8ToString||(a.UTF8ToString=function(){z("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.stringToUTF8Array||(a.stringToUTF8Array=function(){z("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.stringToUTF8||(a.stringToUTF8=function(){z("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.UTF16ToString||(a.UTF16ToString=function(){z("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.stringToUTF16||(a.stringToUTF16=function(){z("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.lengthBytesUTF16||(a.lengthBytesUTF16=function(){z("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.UTF32ToString||(a.UTF32ToString=function(){z("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.stringToUTF32||(a.stringToUTF32=function(){z("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.lengthBytesUTF32||(a.lengthBytesUTF32=function(){z("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.allocateUTF8||(a.allocateUTF8=function(){z("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.stackTrace||(a.stackTrace=function(){z("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.addOnPreRun||(a.addOnPreRun=function(){z("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.addOnInit||(a.addOnInit=function(){z("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.addOnPreMain||(a.addOnPreMain=function(){z("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.addOnExit||(a.addOnExit=function(){z("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.addOnPostRun||(a.addOnPostRun=function(){z("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.writeStringToMemory||(a.writeStringToMemory=function(){z("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.writeArrayToMemory||(a.writeArrayToMemory=function(){z("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.writeAsciiToMemory||(a.writeAsciiToMemory=function(){z("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.addRunDependency||(a.addRunDependency=function(){z("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.removeRunDependency||(a.removeRunDependency=function(){z("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});
a.FS||(a.FS=function(){z("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.FS_createFolder||(a.FS_createFolder=function(){z("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.FS_createPath||(a.FS_createPath=function(){z("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});
a.FS_createDataFile||(a.FS_createDataFile=function(){z("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.FS_createPreloadedFile||(a.FS_createPreloadedFile=function(){z("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});
a.FS_createLazyFile||(a.FS_createLazyFile=function(){z("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.FS_createLink||(a.FS_createLink=function(){z("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});
a.FS_createDevice||(a.FS_createDevice=function(){z("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.FS_unlink||(a.FS_unlink=function(){z("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")});a.GL||(a.GL=function(){z("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.staticAlloc||(a.staticAlloc=function(){z("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.dynamicAlloc||(a.dynamicAlloc=function(){z("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.warnOnce||(a.warnOnce=function(){z("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.loadDynamicLibrary||(a.loadDynamicLibrary=function(){z("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.loadWebAssemblyModule||(a.loadWebAssemblyModule=function(){z("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.getLEB||(a.getLEB=function(){z("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.getFunctionTables||(a.getFunctionTables=function(){z("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.alignFunctionTables||(a.alignFunctionTables=function(){z("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.registerFunctions||(a.registerFunctions=function(){z("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.addFunction||(a.addFunction=function(){z("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.removeFunction||(a.removeFunction=function(){z("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.getFuncWrapper||(a.getFuncWrapper=function(){z("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.prettyPrint||(a.prettyPrint=function(){z("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.makeBigInt||(a.makeBigInt=function(){z("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.dynCall||(a.dynCall=function(){z("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});a.getCompilerSetting||(a.getCompilerSetting=function(){z("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")});
a.ALLOC_NORMAL||Object.defineProperty(a,"ALLOC_NORMAL",{get:function(){z("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});a.ALLOC_STACK||Object.defineProperty(a,"ALLOC_STACK",{get:function(){z("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});a.ALLOC_STATIC||Object.defineProperty(a,"ALLOC_STATIC",{get:function(){z("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});
a.ALLOC_DYNAMIC||Object.defineProperty(a,"ALLOC_DYNAMIC",{get:function(){z("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});a.ALLOC_NONE||Object.defineProperty(a,"ALLOC_NONE",{get:function(){z("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});function v(b){this.name="ExitStatus";this.message="Program terminated with exit("+b+")";this.status=b}v.prototype=Error();v.prototype.constructor=v;var Z=null;
U=function Ua(){a.calledRun||Va();a.calledRun||(U=Ua)};
function Va(){function b(){if(!a.calledRun&&(a.calledRun=!0,!B)){N();P||(P=!0,O(qa));N();O(ra);k&&null!==Z&&a.printErr("pre-main prep time: "+(Date.now()-Z)+" ms");if(a.onRuntimeInitialized)a.onRuntimeInitialized();assert(!a._main,'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');N();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var b=a.postRun.shift();ta.unshift(b)}O(ta)}}null===Z&&(Z=Date.now());
if(!(0<S)){assert(0==(K&3));F[(K>>2)-1]=34821223;F[(K>>2)-2]=2310721022;if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)ua();O(pa);0<S||a.calledRun||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b(),N())}}a.run=Va;
function Wa(){var b=a.print,c=a.printErr,f=!1;a.print=a.printErr=function(){f=!0};a.print=b;a.printErr=c;f&&ba("stdio streams had content in them that was not flushed. you should set NO_EXIT_RUNTIME to 0 (see the FAQ), or make sure to emit a newline when you printf etc.")}
a.exit=function(b,c){Wa();if(!c||!a.noExitRuntime||0!==b){if(a.noExitRuntime)c||a.printErr("exit("+b+") called, but NO_EXIT_RUNTIME is set, so halting execution but not exiting the runtime or preventing further async execution (build with NO_EXIT_RUNTIME=0, if you want a true shutdown)");else if(B=!0,J=void 0,N(),O(sa),Q=!0,a.onExit)a.onExit(b);p&&process.exit(b);a.quit(b,new v(b))}};var Xa=[];
function z(b){if(a.onAbort)a.onAbort(b);void 0!==b?(a.print(b),a.printErr(b),b=JSON.stringify(b)):b="";B=!0;var c="abort("+b+") at "+ja()+"";Xa&&Xa.forEach(function(f){c=f(c,b)});throw c;}a.abort=z;if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();a.noExitRuntime=!0;Va();
  return {
	Module: Module,  // expose original Module
  };
})(window.spp_backend_state_AYUMI);
/* pako 0.2.8 nodeca/pako */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.pako=e()}}(function(){return function e(t,i,n){function a(o,s){if(!i[o]){if(!t[o]){var f="function"==typeof require&&require;if(!s&&f)return f(o,!0);if(r)return r(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[o]={exports:{}};t[o][0].call(d.exports,function(e){var i=t[o][1][e];return a(i?i:e)},d,d.exports,e,t,i,n)}return i[o].exports}for(var r="function"==typeof require&&require,o=0;o<n.length;o++)a(n[o]);return a}({1:[function(e,t,i){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;i.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var i=t.shift();if(i){if("object"!=typeof i)throw new TypeError(i+"must be non-object");for(var n in i)i.hasOwnProperty(n)&&(e[n]=i[n])}}return e},i.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,i,n,a){if(t.subarray&&e.subarray)return void e.set(t.subarray(i,i+n),a);for(var r=0;n>r;r++)e[a+r]=t[i+r]},flattenChunks:function(e){var t,i,n,a,r,o;for(n=0,t=0,i=e.length;i>t;t++)n+=e[t].length;for(o=new Uint8Array(n),a=0,t=0,i=e.length;i>t;t++)r=e[t],o.set(r,a),a+=r.length;return o}},r={arraySet:function(e,t,i,n,a){for(var r=0;n>r;r++)e[a+r]=t[i+r]},flattenChunks:function(e){return[].concat.apply([],e)}};i.setTyped=function(e){e?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,a)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,r))},i.setTyped(n)},{}],2:[function(e,t,i){"use strict";function n(e,t){if(65537>t&&(e.subarray&&o||!e.subarray&&r))return String.fromCharCode.apply(null,a.shrinkBuf(e,t));for(var i="",n=0;t>n;n++)i+=String.fromCharCode(e[n]);return i}var a=e("./common"),r=!0,o=!0;try{String.fromCharCode.apply(null,[0])}catch(s){r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(s){o=!1}for(var f=new a.Buf8(256),l=0;256>l;l++)f[l]=l>=252?6:l>=248?5:l>=240?4:l>=224?3:l>=192?2:1;f[254]=f[254]=1,i.string2buf=function(e){var t,i,n,r,o,s=e.length,f=0;for(r=0;s>r;r++)i=e.charCodeAt(r),55296===(64512&i)&&s>r+1&&(n=e.charCodeAt(r+1),56320===(64512&n)&&(i=65536+(i-55296<<10)+(n-56320),r++)),f+=128>i?1:2048>i?2:65536>i?3:4;for(t=new a.Buf8(f),o=0,r=0;f>o;r++)i=e.charCodeAt(r),55296===(64512&i)&&s>r+1&&(n=e.charCodeAt(r+1),56320===(64512&n)&&(i=65536+(i-55296<<10)+(n-56320),r++)),128>i?t[o++]=i:2048>i?(t[o++]=192|i>>>6,t[o++]=128|63&i):65536>i?(t[o++]=224|i>>>12,t[o++]=128|i>>>6&63,t[o++]=128|63&i):(t[o++]=240|i>>>18,t[o++]=128|i>>>12&63,t[o++]=128|i>>>6&63,t[o++]=128|63&i);return t},i.buf2binstring=function(e){return n(e,e.length)},i.binstring2buf=function(e){for(var t=new a.Buf8(e.length),i=0,n=t.length;n>i;i++)t[i]=e.charCodeAt(i);return t},i.buf2string=function(e,t){var i,a,r,o,s=t||e.length,l=new Array(2*s);for(a=0,i=0;s>i;)if(r=e[i++],128>r)l[a++]=r;else if(o=f[r],o>4)l[a++]=65533,i+=o-1;else{for(r&=2===o?31:3===o?15:7;o>1&&s>i;)r=r<<6|63&e[i++],o--;o>1?l[a++]=65533:65536>r?l[a++]=r:(r-=65536,l[a++]=55296|r>>10&1023,l[a++]=56320|1023&r)}return n(l,a)},i.utf8border=function(e,t){var i;for(t=t||e.length,t>e.length&&(t=e.length),i=t-1;i>=0&&128===(192&e[i]);)i--;return 0>i?t:0===i?t:i+f[e[i]]>t?i:t}},{"./common":1}],3:[function(e,t,i){"use strict";function n(e,t,i,n){for(var a=65535&e|0,r=e>>>16&65535|0,o=0;0!==i;){o=i>2e3?2e3:i,i-=o;do a=a+t[n++]|0,r=r+a|0;while(--o);a%=65521,r%=65521}return a|r<<16|0}t.exports=n},{}],4:[function(e,t,i){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],5:[function(e,t,i){"use strict";function n(){for(var e,t=[],i=0;256>i;i++){e=i;for(var n=0;8>n;n++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e}return t}function a(e,t,i,n){var a=r,o=n+i;e=-1^e;for(var s=n;o>s;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}var r=n();t.exports=a},{}],6:[function(e,t,i){"use strict";function n(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}t.exports=n},{}],7:[function(e,t,i){"use strict";var n=30,a=12;t.exports=function(e,t){var i,r,o,s,f,l,d,u,h,c,b,w,m,k,_,g,v,p,x,y,S,E,B,Z,A;i=e.state,r=e.next_in,Z=e.input,o=r+(e.avail_in-5),s=e.next_out,A=e.output,f=s-(t-e.avail_out),l=s+(e.avail_out-257),d=i.dmax,u=i.wsize,h=i.whave,c=i.wnext,b=i.window,w=i.hold,m=i.bits,k=i.lencode,_=i.distcode,g=(1<<i.lenbits)-1,v=(1<<i.distbits)-1;e:do{15>m&&(w+=Z[r++]<<m,m+=8,w+=Z[r++]<<m,m+=8),p=k[w&g];t:for(;;){if(x=p>>>24,w>>>=x,m-=x,x=p>>>16&255,0===x)A[s++]=65535&p;else{if(!(16&x)){if(0===(64&x)){p=k[(65535&p)+(w&(1<<x)-1)];continue t}if(32&x){i.mode=a;break e}e.msg="invalid literal/length code",i.mode=n;break e}y=65535&p,x&=15,x&&(x>m&&(w+=Z[r++]<<m,m+=8),y+=w&(1<<x)-1,w>>>=x,m-=x),15>m&&(w+=Z[r++]<<m,m+=8,w+=Z[r++]<<m,m+=8),p=_[w&v];i:for(;;){if(x=p>>>24,w>>>=x,m-=x,x=p>>>16&255,!(16&x)){if(0===(64&x)){p=_[(65535&p)+(w&(1<<x)-1)];continue i}e.msg="invalid distance code",i.mode=n;break e}if(S=65535&p,x&=15,x>m&&(w+=Z[r++]<<m,m+=8,x>m&&(w+=Z[r++]<<m,m+=8)),S+=w&(1<<x)-1,S>d){e.msg="invalid distance too far back",i.mode=n;break e}if(w>>>=x,m-=x,x=s-f,S>x){if(x=S-x,x>h&&i.sane){e.msg="invalid distance too far back",i.mode=n;break e}if(E=0,B=b,0===c){if(E+=u-x,y>x){y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}}else if(x>c){if(E+=u+c-x,x-=c,y>x){y-=x;do A[s++]=b[E++];while(--x);if(E=0,y>c){x=c,y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}}}else if(E+=c-x,y>x){y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}for(;y>2;)A[s++]=B[E++],A[s++]=B[E++],A[s++]=B[E++],y-=3;y&&(A[s++]=B[E++],y>1&&(A[s++]=B[E++]))}else{E=s-S;do A[s++]=A[E++],A[s++]=A[E++],A[s++]=A[E++],y-=3;while(y>2);y&&(A[s++]=A[E++],y>1&&(A[s++]=A[E++]))}break}}break}}while(o>r&&l>s);y=m>>3,r-=y,m-=y<<3,w&=(1<<m)-1,e.next_in=r,e.next_out=s,e.avail_in=o>r?5+(o-r):5-(r-o),e.avail_out=l>s?257+(l-s):257-(s-l),i.hold=w,i.bits=m}},{}],8:[function(e,t,i){"use strict";function n(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function a(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new k.Buf16(320),this.work=new k.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function r(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=T,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new k.Buf32(be),t.distcode=t.distdyn=new k.Buf32(we),t.sane=1,t.back=-1,A):N}function o(e){var t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,r(e)):N}function s(e,t){var i,n;return e&&e.state?(n=e.state,0>t?(i=0,t=-t):(i=(t>>4)+1,48>t&&(t&=15)),t&&(8>t||t>15)?N:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=i,n.wbits=t,o(e))):N}function f(e,t){var i,n;return e?(n=new a,e.state=n,n.window=null,i=s(e,t),i!==A&&(e.state=null),i):N}function l(e){return f(e,ke)}function d(e){if(_e){var t;for(w=new k.Buf32(512),m=new k.Buf32(32),t=0;144>t;)e.lens[t++]=8;for(;256>t;)e.lens[t++]=9;for(;280>t;)e.lens[t++]=7;for(;288>t;)e.lens[t++]=8;for(p(y,e.lens,0,288,w,0,e.work,{bits:9}),t=0;32>t;)e.lens[t++]=5;p(S,e.lens,0,32,m,0,e.work,{bits:5}),_e=!1}e.lencode=w,e.lenbits=9,e.distcode=m,e.distbits=5}function u(e,t,i,n){var a,r=e.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new k.Buf8(r.wsize)),n>=r.wsize?(k.arraySet(r.window,t,i-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(a=r.wsize-r.wnext,a>n&&(a=n),k.arraySet(r.window,t,i-n,a,r.wnext),n-=a,n?(k.arraySet(r.window,t,i-n,n,0),r.wnext=n,r.whave=r.wsize):(r.wnext+=a,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=a))),0}function h(e,t){var i,a,r,o,s,f,l,h,c,b,w,m,be,we,me,ke,_e,ge,ve,pe,xe,ye,Se,Ee,Be=0,Ze=new k.Buf8(4),Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return N;i=e.state,i.mode===G&&(i.mode=X),s=e.next_out,r=e.output,l=e.avail_out,o=e.next_in,a=e.input,f=e.avail_in,h=i.hold,c=i.bits,b=f,w=l,ye=A;e:for(;;)switch(i.mode){case T:if(0===i.wrap){i.mode=X;break}for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(2&i.wrap&&35615===h){i.check=0,Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0),h=0,c=0,i.mode=U;break}if(i.flags=0,i.head&&(i.head.done=!1),!(1&i.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",i.mode=ue;break}if((15&h)!==F){e.msg="unknown compression method",i.mode=ue;break}if(h>>>=4,c-=4,xe=(15&h)+8,0===i.wbits)i.wbits=xe;else if(xe>i.wbits){e.msg="invalid window size",i.mode=ue;break}i.dmax=1<<xe,e.adler=i.check=1,i.mode=512&h?Y:G,h=0,c=0;break;case U:for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(i.flags=h,(255&i.flags)!==F){e.msg="unknown compression method",i.mode=ue;break}if(57344&i.flags){e.msg="unknown header flags set",i.mode=ue;break}i.head&&(i.head.text=h>>8&1),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0,i.mode=D;case D:for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.head&&(i.head.time=h),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,Ze[2]=h>>>16&255,Ze[3]=h>>>24&255,i.check=g(i.check,Ze,4,0)),h=0,c=0,i.mode=L;case L:for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.head&&(i.head.xflags=255&h,i.head.os=h>>8),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0,i.mode=H;case H:if(1024&i.flags){for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.length=h,i.head&&(i.head.extra_len=h),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0}else i.head&&(i.head.extra=null);i.mode=j;case j:if(1024&i.flags&&(m=i.length,m>f&&(m=f),m&&(i.head&&(xe=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),k.arraySet(i.head.extra,a,o,m,xe)),512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,i.length-=m),i.length))break e;i.length=0,i.mode=M;case M:if(2048&i.flags){if(0===f)break e;m=0;do xe=a[o+m++],i.head&&xe&&i.length<65536&&(i.head.name+=String.fromCharCode(xe));while(xe&&f>m);if(512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,xe)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=K;case K:if(4096&i.flags){if(0===f)break e;m=0;do xe=a[o+m++],i.head&&xe&&i.length<65536&&(i.head.comment+=String.fromCharCode(xe));while(xe&&f>m);if(512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,xe)break e}else i.head&&(i.head.comment=null);i.mode=P;case P:if(512&i.flags){for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h!==(65535&i.check)){e.msg="header crc mismatch",i.mode=ue;break}h=0,c=0}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),e.adler=i.check=0,i.mode=G;break;case Y:for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}e.adler=i.check=n(h),h=0,c=0,i.mode=q;case q:if(0===i.havedict)return e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,R;e.adler=i.check=1,i.mode=G;case G:if(t===B||t===Z)break e;case X:if(i.last){h>>>=7&c,c-=7&c,i.mode=fe;break}for(;3>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}switch(i.last=1&h,h>>>=1,c-=1,3&h){case 0:i.mode=W;break;case 1:if(d(i),i.mode=te,t===Z){h>>>=2,c-=2;break e}break;case 2:i.mode=V;break;case 3:e.msg="invalid block type",i.mode=ue}h>>>=2,c-=2;break;case W:for(h>>>=7&c,c-=7&c;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if((65535&h)!==(h>>>16^65535)){e.msg="invalid stored block lengths",i.mode=ue;break}if(i.length=65535&h,h=0,c=0,i.mode=J,t===Z)break e;case J:i.mode=Q;case Q:if(m=i.length){if(m>f&&(m=f),m>l&&(m=l),0===m)break e;k.arraySet(r,a,o,m,s),f-=m,o+=m,l-=m,s+=m,i.length-=m;break}i.mode=G;break;case V:for(;14>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(i.nlen=(31&h)+257,h>>>=5,c-=5,i.ndist=(31&h)+1,h>>>=5,c-=5,i.ncode=(15&h)+4,h>>>=4,c-=4,i.nlen>286||i.ndist>30){e.msg="too many length or distance symbols",i.mode=ue;break}i.have=0,i.mode=$;case $:for(;i.have<i.ncode;){for(;3>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.lens[Ae[i.have++]]=7&h,h>>>=3,c-=3}for(;i.have<19;)i.lens[Ae[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,Se={bits:i.lenbits},ye=p(x,i.lens,0,19,i.lencode,0,i.work,Se),i.lenbits=Se.bits,ye){e.msg="invalid code lengths set",i.mode=ue;break}i.have=0,i.mode=ee;case ee:for(;i.have<i.nlen+i.ndist;){for(;Be=i.lencode[h&(1<<i.lenbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(16>_e)h>>>=me,c-=me,i.lens[i.have++]=_e;else{if(16===_e){for(Ee=me+2;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h>>>=me,c-=me,0===i.have){e.msg="invalid bit length repeat",i.mode=ue;break}xe=i.lens[i.have-1],m=3+(3&h),h>>>=2,c-=2}else if(17===_e){for(Ee=me+3;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=me,c-=me,xe=0,m=3+(7&h),h>>>=3,c-=3}else{for(Ee=me+7;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=me,c-=me,xe=0,m=11+(127&h),h>>>=7,c-=7}if(i.have+m>i.nlen+i.ndist){e.msg="invalid bit length repeat",i.mode=ue;break}for(;m--;)i.lens[i.have++]=xe}}if(i.mode===ue)break;if(0===i.lens[256]){e.msg="invalid code -- missing end-of-block",i.mode=ue;break}if(i.lenbits=9,Se={bits:i.lenbits},ye=p(y,i.lens,0,i.nlen,i.lencode,0,i.work,Se),i.lenbits=Se.bits,ye){e.msg="invalid literal/lengths set",i.mode=ue;break}if(i.distbits=6,i.distcode=i.distdyn,Se={bits:i.distbits},ye=p(S,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,Se),i.distbits=Se.bits,ye){e.msg="invalid distances set",i.mode=ue;break}if(i.mode=te,t===Z)break e;case te:i.mode=ie;case ie:if(f>=6&&l>=258){e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,v(e,w),s=e.next_out,r=e.output,l=e.avail_out,o=e.next_in,a=e.input,f=e.avail_in,h=i.hold,c=i.bits,i.mode===G&&(i.back=-1);break}for(i.back=0;Be=i.lencode[h&(1<<i.lenbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(ke&&0===(240&ke)){for(ge=me,ve=ke,pe=_e;Be=i.lencode[pe+((h&(1<<ge+ve)-1)>>ge)],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=ge+me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=ge,c-=ge,i.back+=ge}if(h>>>=me,c-=me,i.back+=me,i.length=_e,0===ke){i.mode=se;break}if(32&ke){i.back=-1,i.mode=G;break}if(64&ke){e.msg="invalid literal/length code",i.mode=ue;break}i.extra=15&ke,i.mode=ne;case ne:if(i.extra){for(Ee=i.extra;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.length+=h&(1<<i.extra)-1,h>>>=i.extra,c-=i.extra,i.back+=i.extra}i.was=i.length,i.mode=ae;case ae:for(;Be=i.distcode[h&(1<<i.distbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(0===(240&ke)){for(ge=me,ve=ke,pe=_e;Be=i.distcode[pe+((h&(1<<ge+ve)-1)>>ge)],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=ge+me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=ge,c-=ge,i.back+=ge}if(h>>>=me,c-=me,i.back+=me,64&ke){e.msg="invalid distance code",i.mode=ue;break}i.offset=_e,i.extra=15&ke,i.mode=re;case re:if(i.extra){for(Ee=i.extra;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.offset+=h&(1<<i.extra)-1,h>>>=i.extra,c-=i.extra,i.back+=i.extra}if(i.offset>i.dmax){e.msg="invalid distance too far back",i.mode=ue;break}i.mode=oe;case oe:if(0===l)break e;if(m=w-l,i.offset>m){if(m=i.offset-m,m>i.whave&&i.sane){e.msg="invalid distance too far back",i.mode=ue;break}m>i.wnext?(m-=i.wnext,be=i.wsize-m):be=i.wnext-m,m>i.length&&(m=i.length),we=i.window}else we=r,be=s-i.offset,m=i.length;m>l&&(m=l),l-=m,i.length-=m;do r[s++]=we[be++];while(--m);0===i.length&&(i.mode=ie);break;case se:if(0===l)break e;r[s++]=i.length,l--,i.mode=ie;break;case fe:if(i.wrap){for(;32>c;){if(0===f)break e;f--,h|=a[o++]<<c,c+=8}if(w-=l,e.total_out+=w,i.total+=w,w&&(e.adler=i.check=i.flags?g(i.check,r,w,s-w):_(i.check,r,w,s-w)),w=l,(i.flags?h:n(h))!==i.check){e.msg="incorrect data check",i.mode=ue;break}h=0,c=0}i.mode=le;case le:if(i.wrap&&i.flags){for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h!==(4294967295&i.total)){e.msg="incorrect length check",i.mode=ue;break}h=0,c=0}i.mode=de;case de:ye=z;break e;case ue:ye=O;break e;case he:return C;case ce:default:return N}return e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,(i.wsize||w!==e.avail_out&&i.mode<ue&&(i.mode<fe||t!==E))&&u(e,e.output,e.next_out,w-e.avail_out)?(i.mode=he,C):(b-=e.avail_in,w-=e.avail_out,e.total_in+=b,e.total_out+=w,i.total+=w,i.wrap&&w&&(e.adler=i.check=i.flags?g(i.check,r,w,e.next_out-w):_(i.check,r,w,e.next_out-w)),e.data_type=i.bits+(i.last?64:0)+(i.mode===G?128:0)+(i.mode===te||i.mode===J?256:0),(0===b&&0===w||t===E)&&ye===A&&(ye=I),ye)}function c(e){if(!e||!e.state)return N;var t=e.state;return t.window&&(t.window=null),e.state=null,A}function b(e,t){var i;return e&&e.state?(i=e.state,0===(2&i.wrap)?N:(i.head=t,t.done=!1,A)):N}var w,m,k=e("../utils/common"),_=e("./adler32"),g=e("./crc32"),v=e("./inffast"),p=e("./inftrees"),x=0,y=1,S=2,E=4,B=5,Z=6,A=0,z=1,R=2,N=-2,O=-3,C=-4,I=-5,F=8,T=1,U=2,D=3,L=4,H=5,j=6,M=7,K=8,P=9,Y=10,q=11,G=12,X=13,W=14,J=15,Q=16,V=17,$=18,ee=19,te=20,ie=21,ne=22,ae=23,re=24,oe=25,se=26,fe=27,le=28,de=29,ue=30,he=31,ce=32,be=852,we=592,me=15,ke=me,_e=!0;i.inflateReset=o,i.inflateReset2=s,i.inflateResetKeep=r,i.inflateInit=l,i.inflateInit2=f,i.inflate=h,i.inflateEnd=c,i.inflateGetHeader=b,i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,i){"use strict";var n=e("../utils/common"),a=15,r=852,o=592,s=0,f=1,l=2,d=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],u=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],h=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,i,b,w,m,k,_){var g,v,p,x,y,S,E,B,Z,A=_.bits,z=0,R=0,N=0,O=0,C=0,I=0,F=0,T=0,U=0,D=0,L=null,H=0,j=new n.Buf16(a+1),M=new n.Buf16(a+1),K=null,P=0;for(z=0;a>=z;z++)j[z]=0;for(R=0;b>R;R++)j[t[i+R]]++;for(C=A,O=a;O>=1&&0===j[O];O--);if(C>O&&(C=O),0===O)return w[m++]=20971520,w[m++]=20971520,_.bits=1,0;for(N=1;O>N&&0===j[N];N++);for(N>C&&(C=N),T=1,z=1;a>=z;z++)if(T<<=1,T-=j[z],0>T)return-1;if(T>0&&(e===s||1!==O))return-1;for(M[1]=0,z=1;a>z;z++)M[z+1]=M[z]+j[z];for(R=0;b>R;R++)0!==t[i+R]&&(k[M[t[i+R]]++]=R);if(e===s?(L=K=k,S=19):e===f?(L=d,H-=257,K=u,P-=257,S=256):(L=h,K=c,S=-1),D=0,R=0,z=N,y=m,I=C,F=0,p=-1,U=1<<C,x=U-1,e===f&&U>r||e===l&&U>o)return 1;for(var Y=0;;){Y++,E=z-F,k[R]<S?(B=0,Z=k[R]):k[R]>S?(B=K[P+k[R]],Z=L[H+k[R]]):(B=96,Z=0),g=1<<z-F,v=1<<I,N=v;do v-=g,w[y+(D>>F)+v]=E<<24|B<<16|Z|0;while(0!==v);for(g=1<<z-1;D&g;)g>>=1;if(0!==g?(D&=g-1,D+=g):D=0,R++,0===--j[z]){if(z===O)break;z=t[i+k[R]]}if(z>C&&(D&x)!==p){for(0===F&&(F=C),y+=N,I=z-F,T=1<<I;O>I+F&&(T-=j[I+F],!(0>=T));)I++,T<<=1;if(U+=1<<I,e===f&&U>r||e===l&&U>o)return 1;p=D&x,w[p]=C<<24|I<<16|y-m|0}}return 0!==D&&(w[y+D]=z-F<<24|64<<16|0),_.bits=C,0}},{"../utils/common":1}],10:[function(e,t,i){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],11:[function(e,t,i){"use strict";function n(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=n},{}],"/lib/inflate.js":[function(e,t,i){"use strict";function n(e,t){var i=new c(t);if(i.push(e,!0),i.err)throw i.msg;return i.result}function a(e,t){return t=t||{},t.raw=!0,n(e,t)}var r=e("./zlib/inflate.js"),o=e("./utils/common"),s=e("./utils/strings"),f=e("./zlib/constants"),l=e("./zlib/messages"),d=e("./zlib/zstream"),u=e("./zlib/gzheader"),h=Object.prototype.toString,c=function(e){this.options=o.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0===(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var i=r.inflateInit2(this.strm,t.windowBits);if(i!==f.Z_OK)throw new Error(l[i]);this.header=new u,r.inflateGetHeader(this.strm,this.header)};c.prototype.push=function(e,t){var i,n,a,l,d,u=this.strm,c=this.options.chunkSize,b=!1;if(this.ended)return!1;n=t===~~t?t:t===!0?f.Z_FINISH:f.Z_NO_FLUSH,"string"==typeof e?u.input=s.binstring2buf(e):"[object ArrayBuffer]"===h.call(e)?u.input=new Uint8Array(e):u.input=e,u.next_in=0,u.avail_in=u.input.length;do{if(0===u.avail_out&&(u.output=new o.Buf8(c),u.next_out=0,u.avail_out=c),i=r.inflate(u,f.Z_NO_FLUSH),i===f.Z_BUF_ERROR&&b===!0&&(i=f.Z_OK,b=!1),i!==f.Z_STREAM_END&&i!==f.Z_OK)return this.onEnd(i),this.ended=!0,!1;u.next_out&&(0===u.avail_out||i===f.Z_STREAM_END||0===u.avail_in&&(n===f.Z_FINISH||n===f.Z_SYNC_FLUSH))&&("string"===this.options.to?(a=s.utf8border(u.output,u.next_out),l=u.next_out-a,d=s.buf2string(u.output,a),u.next_out=l,u.avail_out=c-l,l&&o.arraySet(u.output,u.output,a,l,0),this.onData(d)):this.onData(o.shrinkBuf(u.output,u.next_out))),0===u.avail_in&&0===u.avail_out&&(b=!0)}while((u.avail_in>0||0===u.avail_out)&&i!==f.Z_STREAM_END);return i===f.Z_STREAM_END&&(n=f.Z_FINISH),n===f.Z_FINISH?(i=r.inflateEnd(this.strm),this.onEnd(i),this.ended=!0,i===f.Z_OK):n===f.Z_SYNC_FLUSH?(this.onEnd(f.Z_OK),u.avail_out=0,!0):!0},c.prototype.onData=function(e){this.chunks.push(e)},c.prototype.onEnd=function(e){e===f.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},i.Inflate=c,i.inflate=n,i.inflateRaw=a,i.ungzip=n},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate.js":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});
// LH4, LHA (-lh4-) extractor, no crc/sum-checks. Will extract SFX-archives as well.
// Erland Ranvinge (erland.ranvinge@gmail.com)
// Based on a mix of Nobuyasu Suehiro's Java implementation and Simon Howard's C version.
// modified version: added 1st file extraction (without having to know its name)
var LhaArrayReader=function(e){this.buffer=e,this.offset=0,this.subOffset=7};LhaArrayReader.SeekAbsolute=0,LhaArrayReader.SeekRelative=1,LhaArrayReader.prototype.readBits=function(e){for(var t=[1,2,4,8,16,32,64,128],r=this.buffer[this.offset],a=0,s=0;s<e;s++){if(a<<=1,a|=(r&t[this.subOffset])>>this.subOffset,this.subOffset--,this.subOffset<0){if(this.offset+1>=this.buffer.length)return-1;r=this.buffer[++this.offset],this.subOffset=7}}return a},LhaArrayReader.prototype.readUInt8=function(){return this.offset+1>=this.buffer.length?-1:this.buffer[this.offset++]},LhaArrayReader.prototype.readUInt16=function(){if(this.offset+2>=this.buffer.length)return-1;var e=255&this.buffer[this.offset]|this.buffer[this.offset+1]<<8&65280;return this.offset+=2,e},LhaArrayReader.prototype.readUInt32=function(){if(this.offset+4>=this.buffer.length)return-1;var e=255&this.buffer[this.offset]|this.buffer[this.offset+1]<<8&65280|this.buffer[this.offset+2]<<16&16711680|this.buffer[this.offset+3]<<24&4278190080;return this.offset+=4,e},LhaArrayReader.prototype.readString=function(e){if(this.offset+e>=this.buffer.length)return-1;for(var t="",r=0;r<e;r++)t+=String.fromCharCode(this.buffer[this.offset++]);return t},LhaArrayReader.prototype.readLength=function(){var e=this.readBits(3);if(-1==e)return-1;if(7==e)for(;0!=this.readBits(1);)e++;return e},LhaArrayReader.prototype.seek=function(e,t){switch(t){case LhaArrayReader.SeekAbsolute:this.offset=e,this.subOffset=7;break;case LhaArrayReader.SeekRelative:this.offset+=e,this.subOffset=7}},LhaArrayReader.prototype.getPosition=function(){return this.offset};var LhaArrayWriter=function(e){this.offset=0,this.size=e,this.data=new Uint8Array(e)};LhaArrayWriter.prototype.write=function(e){this.data[this.offset++]=e};var LhaTree=function(){};LhaTree.LEAF=32768,LhaTree.prototype.setConstant=function(e){this.tree[0]=e|LhaTree.LEAF},LhaTree.prototype.expand=function(){for(var e=this.allocated;this.nextEntry<e;)this.tree[this.nextEntry]=this.allocated,this.allocated+=2,this.nextEntry++},LhaTree.prototype.addCodesWithLength=function(e,t){for(var r=!0,a=0;a<e.length;a++)if(e[a]==t){var s=this.nextEntry++;this.tree[s]=a|LhaTree.LEAF}else e[a]>t&&(r=!1);return r},LhaTree.prototype.build=function(e,t){this.tree=[];for(var r=0;r<t;r++)this.tree[r]=LhaTree.LEAF;this.nextEntry=0,this.allocated=1;for(var a=0;this.expand(),a++,!this.addCodesWithLength(e,a););},LhaTree.prototype.readCode=function(e){for(var t=this.tree[0];0==(t&LhaTree.LEAF);){var r=e.readBits(1);t=this.tree[t+r]}return t&~LhaTree.LEAF};var LhaRingBuffer=function(e){this.data=[],this.size=e,this.offset=0};LhaRingBuffer.prototype.add=function(e){this.data[this.offset]=e,this.offset=(this.offset+1)%this.size},LhaRingBuffer.prototype.get=function(e,t){for(var r=this.offset+this.size-e-1,a=[],s=0;s<t;s++){var i=this.data[(r+s)%this.size];a.push(i),this.add(i)}return a};var LhaReader=function(e){if(this.reader=e,this.offsetTree=new LhaTree,this.codeTree=new LhaTree,this.ringBuffer=new LhaRingBuffer(8192),this.entries={},"MZ"==e.readString(2)){var t=e.readUInt16(),r=512*(e.readUInt16()-1)+(0!=t?t:512);e.seek(r,LhaArrayReader.SeekAbsolute)}else e.seek(0,LhaArrayReader.SeekAbsolute);for(;;){var a={};if(a.size=e.readUInt8(),a.size<=0)break;a.checksum=e.readUInt8(),a.id=e.readString(5),a.packedSize=e.readUInt32(),a.originalSize=e.readUInt32(),a.datetime=e.readUInt32(),a.attributes=e.readUInt16();var s=e.readUInt8();a.filename=e.readString(s).toLowerCase(),a.crc=e.readUInt16(),a.offset=e.getPosition(),this.entries[a.filename]=a,e.seek(a.packedSize,LhaArrayReader.SeekRelative)}};LhaReader.prototype.readTempTable=function(){var e=this.reader,t=Math.min(e.readBits(5),19);if(t<=0){var r=e.readBits(5);this.offsetTree.setConstant(r)}else{for(var a=[],s=0;s<t;s++){var i=e.readLength();if(a.push(i),2==s)for(var f=e.readBits(2);0<f--;)a.push(0),s++}this.offsetTree.build(a,38)}},LhaReader.prototype.readCodeTable=function(){var e=this.reader,t=Math.min(e.readBits(9),510);if(t<=0){var r=e.readBits(9);this.codeTree.setConstant(r)}else{for(var a=[],s=0;s<t;){var i=this.offsetTree.readCode(e);if(i<=2){var f=1;for(1==i?f=e.readBits(4)+3:2==i&&(f=e.readBits(9)+20);0<=--f;)a.push(0),s++}else a.push(i-2),s++}this.codeTree.build(a,1020)}},LhaReader.prototype.readOffsetTable=function(){var e=this.reader,t=Math.min(e.readBits(4),14);if(t<=0){var r=e.readBits(4);this.offsetTree.setConstant(r)}else{for(var a=[],s=0;s<t;s++){var i=e.readLength();a[s]=i}this.offsetTree.build(a,38)}},LhaReader.prototype.extract=function(e,t,r){null==e&&(e=Object.keys(this.entries)[0]);var a=this.entries[e];if(!a)return null;this.reader.seek(a.offset,LhaArrayReader.SeekAbsolute);var s=new LhaArrayWriter(a.originalSize),i=this;return function e(){if(i.extractBlock(s)){if(t&&t(s.offset,s.size),s.offset>=s.size)return;setTimeout(e,1)}}(),s.data},LhaReader.prototype.extractBlock=function(e){var t=this.reader,r=t.readBits(16);if(r<=0||t.offset>=t.size)return!1;this.readTempTable(),this.readCodeTable(),this.readOffsetTable();for(var a=0;a<r;a++){var s=this.codeTree.readCode(t);if(s<256)this.ringBuffer.add(s),e.write(s);else{var i=this.offsetTree.readCode(t),f=i;if(2<=i){f=t.readBits(i-1);f+=1<<i-1}var h=s-256+3,o=this.ringBuffer.get(f,h);for(var n in o)e.write(o[n])}}return!0};/*
 ayumi_adapter.js: Adapts ayumi backend to generic WebAudio/ScriptProcessor player.
 
 version 1.0
 
 	Copyright (C) 2018 Juergen Wothke

*/

ConverterBase = function () {
	this._ptr= 0;
};

ConverterBase.prototype = {
	getIntLE: function(data) {
		var r = 0;
		for(var i = 0; i < 4; i++) r += data[this._ptr++] << (8*i);
		return r;
	},
	getIntBE: function(data) {
		var r = 0;
		for(var i = 0; i < 4; i++) r += data[this._ptr++] << (8*(3-i));
		return r;
	},
	getShortBE: function(data) {
		var r = 0;
		for(var i = 0; i < 2; i++) r += data[this._ptr++] << (8*(1-i));
		return r;
	},
	getStr: function(data) {
		var c, r = '';
		while(c = data[this._ptr++]) r += String.fromCharCode(c);
		return r;
	},
	makeStr: function(data, start, len) {
		var r = '';		
		for (var i= 0; i<len; i++) {
			r += String.fromCharCode(data[start+i]);
		}
		return r;
	},
	framesToText: function(frameData) {			
		var text = ''
		for (var i= 0 ; i<frameData.length; i++) {
			for (var j= 0;j<15; j++) {
				text += '' + frameData[i][j] + ' ';
			}
			text += '' + frameData[i][15] + '\n';
		}
		return text;
	},
	saveText: function(header, textData) {
		var data = ''

		// header 
		Object.keys(header).sort().forEach(function(key) {
			data += '' + key + ' ' + header[key] + '\n';
		});
		// data
		data += 'frame_data\n' + textData;
		
		if (!("TextEncoder" in window)) 
			alert("Sorry, this browser does not support TextEncoder...");
		
		var enc = new TextEncoder(); // always utf-8
		return enc.encode(data);	// Uint8Array	
	}
};

// should be equivalent to original fym_to_text.py
FymConverter= (function(){ var $this = function (caller) { 
		$this.base.call(this);
		this.caller= caller;
	}; 
	extend(ConverterBase, $this, {
		convert: function(data) {		
			if (typeof window.pako == 'undefined') { alert("ERROR unresolved pako library dependency"); }			
			
			var fymData=  window.pako.inflate(new Uint8Array(data));
			
		    var fymHeaderSize = this.getIntLE(fymData);
			var frameCount = this.getIntLE(fymData);
			var loopFrame = this.getIntLE(fymData);
			var clockRate = this.getIntLE(fymData);
			var frameRate = this.getIntLE(fymData);
			
			this.caller.setTrackInfo(this.getStr(fymData), this.getStr(fymData), "");

			var header= {
			  'pan_a': 10,
			  'pan_b': 50,
			  'pan_c': 90,
			  'volume': 50
			};
			header['frame_count'] = frameCount;
			header['clock_rate'] = clockRate;
			header['frame_rate'] = frameRate;

			var frameData = []
			for (var i= 0; i<frameCount; i++) {
				frameData.push(new Array(16).fill(0));
			}
			for (var i= 0; i<14; i++) {		// i.e. 0 - 13
				for (var j= 0; j<frameCount; j++) {
					frameData[j][i] = fymData[fymHeaderSize + i * frameCount + j];
				}
			}
			var textData= this.framesToText(frameData);
			return this.saveText(header, textData);
		}
	});	return $this; })();
	
// should be equivalent to original ym_to_text.py (with added LHA handling)
YmConverter= (function(){ var $this = function (caller) { 
		$this.base.call(this);
		this.caller= caller;
	}; 
	extend(ConverterBase, $this, {
		convert: function(data) {		
			
			var id= this.makeStr(data, 2, 3); 		// handle LHA compression
			if ((id == '-lh') || (id == '-lz')) {
				var lha = new LhaReader(new LhaArrayReader(data));	// note: modified 'extract' version 
				data = lha.extract(null, function(done, total) {
					console.log('Extracting LHA data: ' + (done / total * 100) + '% complete.');
				});				
			}

			if(this.makeStr(data, 4, 8) != 'LeOnArD!') return null;
			
			this._ptr= 12;	// skip 12 bytes
						
			var frameCount= this.getIntBE(data);
			var interleaved= this.getIntBE(data) & 1;	// FIXME: relevant to interpret YM rgister recordings
			var sampleCount= this.getShortBE(data);		// digi drum samples
			
			if (sampleCount) console.log("WARNING: YM digi drums not implemented");
					
			var clockRate= this.getIntBE(data);
			var frameRate= this.getShortBE(data);
			var loopFrame= this.getIntBE(data);
			var additionalSize= this.getShortBE(data);
					
			this._ptr= 34;	// reset to start of sample data (noop)

			for (var i= 0; i<sampleCount; i++) {
				var sampleSize= this.getIntBE(data);
				this._ptr+= sampleSize;
			}

			this.caller.setTrackInfo(this.getStr(data), this.getStr(data), this.getStr(data));
			
			var headerSize = this._ptr; // now points to the recorded YM register data
		
			var header= {
			  'pan_a': 10,
			  'pan_b': 50,
			  'pan_c': 90,
			  'volume': 50
			};
			header['frame_count'] = frameCount;
			header['clock_rate'] = clockRate;
			header['frame_rate'] = frameRate;

			var frameData = []
			for (var i= 0; i<frameCount; i++) {
				frameData.push(new Array(16).fill(0));
			}
			for (var i= 0; i<14; i++) {		// i.e. 0 - 13
				for (var j= 0; j<frameCount; j++) {
					frameData[j][i] = data[headerSize + i * frameCount + j];
				}
			}
			var textData= this.framesToText(frameData);
			return this.saveText(header, textData);
		}
	});	return $this; })();
	
// should be equivalent to original psg_to_text.py
PSGConverter= (function(){ var $this = function (caller) { 
		$this.base.call(this);
		this.caller= caller;
	}; 
	extend(ConverterBase, $this, {
		frameToTxt: function(r) {
			if (r[13] != this.old_shape) {
				this.old_shape = r[13];
			} else {
				r[13] = 255; 
			}
			return ''+r[0]+' '+r[1]+' '+r[2]+' '+r[3]+' '+r[4]+' '+r[5]+' '+r[6]+' '+r[7]+' '+
					r[8]+' '+r[9]+' '+r[10]+' '+r[11]+' '+r[12]+' '+r[13]+' '+r[14]+' '+r[15]+'\n';
		},
		convert: function(data) {		
			if(this.makeStr(data, 0, 4) != 'PSG\x1a') return null;
			
			var header= {
			  'pan_a': 10,
			  'pan_b': 50,
			  'pan_c': 90,
			  'volume': 50
			};

			var r = new Array(16).fill(0);
			this.old_shape = 255;
			var frameData = '';
			
			header['frame_count'] = 0;
			
			var index = 0;
			while (index < data.length) {
				var command = data[index];
				index += 1;
				if (command < 16) {
					r[command] = data[index];
					index += 1;
				} else if (command == 0xfd) {
					break;
				} else if (command == 0xff) {
					frameData += this.frameToTxt(r);
					header['frame_count'] += 1;
				} else if (command == 0xfe) {
					var count = data[index];
					index += 1;
					for (var i= 0; i<count * 4; i++) {
						frameData += this.frameToTxt(r);
						header['frame_count'] += 1;
					}
				}
			}				
			return this.saveText(header, frameData);			
		}
	});	return $this; })();
	
// should be equivalent to original afx_to_text.py
AFXConverter= (function(){ var $this = function (caller) { 
		$this.base.call(this);
		this.caller= caller;
	}; 
	extend(ConverterBase, $this, {
		frameToTxt: function(p1, p2, p3, p4, p5) {
			return ''+p1+' '+p2+' 0 0 0 0 '+p3+' '+p4+' '+p5+' 0 0 0 0 255 0 0\n';
		},
		convert: function(data) {
			var header = {
			  'pan_a': 50,
			  'pan_b': 0,
			  'pan_c': 0,
			  'volume': 140
			};
						
			var volume = 0;
			var tone = 0;
			var noise = 0;
			var tOff = 0;
			var nOff = 0;
			var status = 0;
			var frameData = '';

			header['frame_count'] = 0

			var index = 0;
			while (index < data.length) {
				status = data[index];
				volume = status & 0xf;
				tOff = (status & 0x10) != 0;
				nOff = (status & 0x80) != 0;
				index += 1;
				if (status & 0x20) {
					tone = data[index] | (data[index + 1] << 8);
					index += 2;
				}
				if (status & 0x40) {
					noise = data[index];
					index += 1;
				}
				if (noise == 0x20) {
					break;
				}
				frameData += this.frameToTxt(tone & 0xff, (tone >> 8) & 0xf, noise, tOff | (nOff << 3), volume);
				header['frame_count'] += 1
			}
	
			return this.saveText(header, frameData);			
		}
	});	return $this; })();
	

AyumiBackendAdapter= (function(){ var $this = function () { 
		$this.base.call(this, backend_AYUMI.Module, 2);
		this.playerSampleRate;
	}; 
	// ayumi's sample buffer contains 2-byte (signed short) sample data 
	// for 2 channels
	extend(EmsHEAP16BackendAdapter, $this, {
		getAudioBuffer: function() {
			var ptr= this.Module.ccall('getSoundBuffer', 'number');			
			return ptr>>1;	// 16 bit samples			
		},
		getAudioBufferLength: function() {
			var len= this.Module.ccall('getSoundBufferLen', 'number');
			return len;
		},
		computeAudioSamples: function() {
			var len= this.Module.ccall('computeAudioSamples', 'number');
			if (len <= 0) return 1; // >0 means "end song"
			
			return 0;	
		},
		getPathAndFilename: function(filename) {
			return ['/', filename];
		},
		registerFileData: function(pathFilenameArray, data) {
			return 0;	// FS not used in ayumi
		},
		convert2text: function(filename, data) {
			this.trackName = filename.split('/').pop();
			this.authorName = "";
			this.trackComment= "";
			
			// ayumi uses some proprietary "text" format and any input is 
			// first converted to that format (corresponds to the .py scripts in the original code)
			
			if (filename.endsWith(".fym")) {
				return new FymConverter(this).convert(data);
			} else if (filename.endsWith(".ym")) {
				return new YmConverter(this).convert(data);
			} else if (filename.endsWith(".psg")) {
				return new PSGConverter(this).convert(data);
			} else if (filename.endsWith(".afx")) {
				return new AFXConverter(this).convert(data);
			} else 	if (filename.endsWith(".text")) {
				return data;			
			}
			return null;			
		},
		setTrackInfo: function(trackName, authorName, comment) {
			this.trackName= trackName;
			this.authorName= authorName;
			this.trackComment= comment;
		},		
		loadMusicData: function(sampleRate, path, filename, data, options) {
			data= this.convert2text(filename, data);
						
			var buf = this.Module._malloc(data.length);
			this.Module.HEAPU8.set(data, buf);
			
			var ret = this.Module.ccall('loadSongFile', 'number', ['number', 'number', 'number'], [sampleRate, buf, data.length]);
			this.Module._free(buf);

			return ret;			
		},
		evalTrackOptions: function(options) {
			// the respective music files are always single track
			if (typeof options.timeout != 'undefined') {
				ScriptNodePlayer.getInstance().setPlaybackTimeout(options.timeout*1000);
			}
			var debug= false;
			if (typeof options.debug != 'undefined') {
				debug= options.debug;
			}
			var ret = this.Module.ccall('setOptions', 'number', ['number'], [debug]);
			return 0;
		},
		teardown: function() {
			// nothing to do
		},
		getSongInfoMeta: function() {
			return {			
					songName: String,
					songAuthor: String
					};
		},
		updateSongInfo: function(filename, result) {
			// song infos are no available in ayumi's TEXT format
			// so the info is extracted here while converting the input
			result.songName= this.trackName;			
			result.songAuthor= this.authorName;
		},

		
		// To activate the below output a song must be started with the "traceSID" option set to 1:
		// At any given moment the below getters will then correspond to the output of getAudioBuffer
		// and what has last been generated by computeAudioSamples. They expose some of the respective
		// underlying internal SID state (the "filter" is NOT reflected in this data).
		getBufferVoice1: function() {
			var ptr=  this.Module.ccall('getBufferVoice1', 'number');			
			return ptr>>1;	// 16 bit samples			
		},
		getBufferVoice2: function() {
			var ptr=  this.Module.ccall('getBufferVoice2', 'number');			
			return ptr>>1;	// 16 bit samples			
		},
		getBufferVoice3: function() {
			var ptr=  this.Module.ccall('getBufferVoice3', 'number');			
			return ptr>>1;	// 16 bit samples			
		},
		getBufferVoice4: function() {
			var ptr=  this.Module.ccall('getBufferVoice4', 'number');			
			return ptr>>1;	// 16 bit samples			
		}
	});	return $this; })();
	