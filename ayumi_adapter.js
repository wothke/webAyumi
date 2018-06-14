/*
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
			// known limitation: there seem to be .fym files for 2-chip configurations 
			// see files marked as 'ts' on http://ym.mmcm.ru - respective support HAS NOT
			// been implemented here (I did not find any 'ts' songs that seem to be worth the trouble)

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
			for (var i= 0; i<14; i++) {
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
		//			console.log('Extracting LHA data: ' + (done / total * 100) + '% complete.');
				});				
			}

			if(this.makeStr(data, 4, 8) != 'LeOnArD!') return null;
			
			var version= this.makeStr(data, 0, 3);
			
			if ((version == 'YMT') || (version == 'MIX')) {
				console.log("pure sample replay file format not supported here: " + this.makeStr(data, 0, 4));
				return null;				
			} else if ((version != 'YM5') && (version != 'YM6')) {
				console.log("old .ym file format not supported here: " + this.makeStr(data, 0, 4));
				return null;				
			}	
	
			this._ptr= 12;	// skip 12 bytes
						
			var frameCount= this.getIntBE(data);
			var interleaved= this.getIntBE(data) & 1;
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
			
			var rowInSize= 16;
			var rowOutSize= 14;	// note: the .ym extra features are not supported here 
					
			if (interleaved) {
				for (var i= 0; i<rowOutSize; i++) {
					for (var j= 0; j<frameCount; j++) {
						frameData[j][i] = data[headerSize + i * frameCount + j];
					}
				}
			} else {
				for (var i= 0; i<rowOutSize; i++) {
					for (var j= 0; j<frameCount; j++) {
						frameData[j][i] = data[headerSize + j * rowInSize + i];
					}
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
			
			if (data == null) return 1;
			
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
	