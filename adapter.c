/**
* Provides the APIs needed by the WebAudio based player.
*
 	Copyright (C)2018 Juergen Wothke
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#include "ayumi.h"
#include "load_text.h"


#ifdef EMSCRIPTEN
#define EMSCRIPTEN_KEEPALIVE __attribute__((used))
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

typedef signed char int8_t;
typedef unsigned char uint8_t;
typedef short int16_t;
typedef unsigned short uint16_t;
typedef signed long int32_t;
typedef unsigned long uint32_t;


#define WAVE_FORMAT_IEEE_FLOAT 3

#define NUM_SAMPLES 8*882
#define BUFLEN  NUM_SAMPLES*2
static uint32_t _soundBufferLen= BUFLEN;
static int16_t _soundBuffer[BUFLEN];
static uint32_t _numberOfSamplesRendered= 0;

// output the realtime volume info
static int32_t _debugEnabled;
static int16_t _voice1Buffer[BUFLEN];
static int16_t _voice2Buffer[BUFLEN];
static int16_t _voice3Buffer[BUFLEN];


static uint32_t getSoundBufferLen() __attribute__((noinline));
static uint32_t EMSCRIPTEN_KEEPALIVE getSoundBufferLen() {
	return _numberOfSamplesRendered;	// in samples
}

static char* getSoundBuffer() __attribute__((noinline));
static char* EMSCRIPTEN_KEEPALIVE getSoundBuffer() {
	return (char*) _soundBuffer;
}

void updateAyumiState(struct ayumi* ay, int* r) {
  ayumi_set_tone(ay, 0, (r[1] << 8) | r[0]);
  ayumi_set_tone(ay, 1, (r[3] << 8) | r[2]);
  ayumi_set_tone(ay, 2, (r[5] << 8) | r[4]);
  ayumi_set_noise(ay, r[6]);
  ayumi_set_mixer(ay, 0, r[7] & 1, (r[7] >> 3) & 1, r[8] >> 4);
  ayumi_set_mixer(ay, 1, (r[7] >> 1) & 1, (r[7] >> 4) & 1, r[9] >> 4);
  ayumi_set_mixer(ay, 2, (r[7] >> 2) & 1, (r[7] >> 5) & 1, r[10] >> 4);
  ayumi_set_volume(ay, 0, r[8] & 0xf);
  ayumi_set_volume(ay, 1, r[9] & 0xf);
  ayumi_set_volume(ay, 2, r[10] & 0xf);
  ayumi_set_envelope(ay, (r[12] << 8) | r[11]);
  if (r[13] != 255) {
    ayumi_set_envelope_shape(ay, r[13]);
  }
}

static int sample_count;
static float* sample_data;
static struct text_data t;
static struct ayumi ay;
static int frame = 0;


void setDefaultTextData(int sampleRate, struct text_data* t) {
  memset(t, 0, sizeof(struct text_data));
  t->sample_rate = sampleRate;
  t->eqp_stereo_on = 0;
  t->dc_filter_on = 1;
  t->is_ym = 1;
  t->clock_rate = 2000000;
  t->frame_rate = 50;
}

static uint32_t loadSongFile(uint32_t sampleRate, void * inBuffer, uint32_t inBufSize)  __attribute__((noinline));
static uint32_t EMSCRIPTEN_KEEPALIVE loadSongFile(uint32_t sampleRate, void * inBuffer, uint32_t inBufSize) {
	uint8_t *inputFileBuffer= (uint8_t *)inBuffer;

	setDefaultTextData(sampleRate, &t);
	if(!load_text_buffer(inputFileBuffer, inBufSize, &t)) {
		return 1;	// error
	}

	sample_count = (int) ((t.sample_rate / t.frame_rate) * t.frame_count);

	if (sample_count == 0) {
		return 1;	// no frames
	}
	if (!ayumi_configure(&ay, t.is_ym, t.clock_rate, t.sample_rate)) {
		return 1;	// ayumi_configure error (wrong sample rate?)
	}
	if (t.pan[0] >= 0) {
		ayumi_set_pan(&ay, 0, t.pan[0], t.eqp_stereo_on);
	}
	if (t.pan[1] >= 0) {
		ayumi_set_pan(&ay, 1, t.pan[1], t.eqp_stereo_on);
	}
	if (t.pan[2] >= 0) {
		ayumi_set_pan(&ay, 2, t.pan[2], t.eqp_stereo_on);
	}
	frame = 0;
	
	return 0;
}

static int16_t getVoiceOutput(struct ayumi* ay, int voice) {
	int noise = ay->noise & 1;
		
	// note: in test-song for voices 1 + 3 it is just the volume that is displayed.. whereas for 
	// voice 2 it initially shows the envelope..
	int envelope = ay->channels[voice].e_on ? ay->envelope : ay->channels[voice].volume * 2 + 1; // 5-bit "envelope" 0 to 31
		
	int out = ((ay->channels[voice].tone | ay->channels[voice].t_off) & (noise | ay->channels[voice].n_off));	// 
	double d= ay->dac_table[envelope];	// range is 0.0f .. 1.0f

	out= out ? -(0x8000) : 0x7fff; 	// center
	
	return  round(d*out);
}


static uint32_t setOptions(uint32_t debug)  __attribute__((noinline));
static uint32_t EMSCRIPTEN_KEEPALIVE setOptions(uint32_t debug) {
	_debugEnabled= debug;
	return 0;
}

static uint32_t computeAudioSamples()  __attribute__((noinline));
static uint32_t EMSCRIPTEN_KEEPALIVE computeAudioSamples() {
	_numberOfSamplesRendered= 0;
	
	if (frame < t.frame_count) {	
		int16_t* out= _soundBuffer;
		
		// dunno how interesting the volume info really is..
		int16_t* outV1= _voice1Buffer;
		int16_t* outV2= _voice2Buffer;
		int16_t* outV3= _voice3Buffer;
		
		double isr_step = t.frame_rate / t.sample_rate;
		double isr_counter = 1;
		while ((_numberOfSamplesRendered < NUM_SAMPLES) && (frame < t.frame_count)) {
			isr_counter += isr_step;
			if (isr_counter >= 1) {
				isr_counter -= 1;				
				updateAyumiState(&ay, &t.frame_data[frame * 16]);
				frame += 1;
			}
			ayumi_process(&ay);
			if (t.dc_filter_on) {
				ayumi_remove_dc(&ay);
			}
			
			if (_debugEnabled) {			
				outV1[_numberOfSamplesRendered]= getVoiceOutput(&ay, 0);
				outV2[_numberOfSamplesRendered]= getVoiceOutput(&ay, 1);
				outV3[_numberOfSamplesRendered]= getVoiceOutput(&ay, 2);;
			}
			out[0] = (int16_t) (ay.left * t.volume * 0x7fff);
			out[1] = (int16_t) (ay.right * t.volume * 0x7fff);
			out += 2;

			_numberOfSamplesRendered++;
		}
		int fill= NUM_SAMPLES - _numberOfSamplesRendered;
		for (int i= 0; i<fill; i++) {
			out[0] = out[1] = 0;
			out += 2;
			_numberOfSamplesRendered++;	
		}
	}
	return _numberOfSamplesRendered;
}

static char* getBufferVoice1() __attribute__((noinline));
static char* EMSCRIPTEN_KEEPALIVE getBufferVoice1() {
	return (char*) _voice1Buffer;
}

static char* getBufferVoice2() __attribute__((noinline));
static char* EMSCRIPTEN_KEEPALIVE getBufferVoice2() {
	return (char*) _voice2Buffer;
}

static char* getBufferVoice3() __attribute__((noinline));
static char* EMSCRIPTEN_KEEPALIVE getBufferVoice3() {
	return (char*) _voice3Buffer;
}
