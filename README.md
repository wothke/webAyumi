# webAyumi

Copyright (C) 2018 Juergen Wothke

This is a JavaScript/WebAudio plugin of "ayumi" . This plugin is designed to work with my generic WebAudio 
ScriptProcessor music player (see separate project) but the API exposed by the lib can be used in any 
JavaScript program (it should look familiar to anyone that has ever done some sort of music player plugin). 

I mainly added this to fill a gap regarding the .fym format and to have a more light weight player for
some of the formats that are already covered by spectreZX.

Files that can be played include: .text (the proprietary internal format used by ayumi), .fym, .ym, .psg, .afx


Known limitations: The support for some of the formats seems to be somewhat limited (e.g. no digi drums
in .ym).

A live demo of this program can be found here: http://www.wothke.ch/webAyumi/


## Credits

The project is based on: Peter Sovietov's https://github.com/true-grue/ayumi


## Project

The original ayumi sources can be found in the 'src' folder. Any changes are marked using respective
EMSCRIPTEN ifdefs. 

I am aware that there is already a manually rewritten JavaScript port of ayumi, but unfortunately that 
port seems to be incomplete with regard to the supported formats. I therefore decided to give ayumi a go..
   
My version integrates with my generic player infrastucture (same as all my other ports). Eventhough 
the Emscripten generated code used here may be somewhat larger than handwritten JavaScript, the 
difference should be neglegible especially when compiling to WASM. Also it should be easier to update 
to newer versions of Peter Sovietov's code in the future since the respective core emulator code did not 
need to be touched/rewritten. As compared to Peter Sovietov's original code the Python scripts where translated 
to JavaScript and support for LHA & zlib compressed formats was added (ayumi_adapter.js).

For the handling of LHA and zlib compressed formats the 3rd party 
lh4.min.js (https://github.com/erlandranvinge/lh4.js) and pako_inflate.min.js (https://github.com/nodeca/pako) libs 
are used. (For ease of use they are currently inlined directly into the backend_ayumi.js  (see makeEmscripten.bat). 
Reminder: lh4.min.js was patched to allow for the data extraction even without having the correct file name. 

## Howto build

You'll need Emscripten (http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html). The make script 
is designed for use of emscripten version 1.37.29 (unless you want to create WebAssembly output, older versions might 
also still work).

The below instructions assume that the webAyumi project folder has been moved into the main emscripten 
installation folder (maybe not necessary) and that a command prompt has been opened within the 
project's "emscripten" sub-folder, and that the Emscripten environment vars have been previously 
set (run emsdk_env.bat).

The Web version is then built using the makeEmscripten.bat that can be found in this folder. The 
script will compile directly into the "emscripten/htdocs" example web folder, were it will create 
the backend_ayumi.js library - and an additional ayumi.wasm if you are compiling WASM output (This can be enabled in the 
makeEmscripten.bat to generate WASM instead of asm.js.). 
The content of the "htdocs" can be tested by first copying it into some 
document folder of a web server. 


## Depencencies

Recommended use of version 1.03 of my https://github.com/wothke/webaudio-player (older versions will not
support WebAssembly and the playback of remote files)

This project comes without any music files, so you'll also have to get your own and place them
in the htdocs/music folder (you can configure them in the 'songs' list in index.html).


## License

The OpenMPT code is licensed under the BSD license. The same license is extended to the code
added here to create the backend_mpt.js library.

Copyright (c) 2004-2018, OpenMPT contributors
Copyright (c) 1997-2003, Olivier Lapicque
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the OpenMPT project nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE CONTRIBUTORS ``AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
