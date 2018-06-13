/* Author: Peter Sovietov */

#ifndef LOAD_TEXT_H
#define LOAD_TEXT_H

struct text_data {
  int sample_rate;
  int is_ym;
  int clock_rate;
  double frame_rate;
  int frame_count;
  double pan[3];
  double volume;
  int eqp_stereo_on;
  int dc_filter_on;
  int* frame_data;
};

struct text_parser {
  int index;
  int size;
  char* text;
};

int load_text_file(const char* name, struct text_data* t);

#ifdef EMSCRIPTEN
// avoiding the FILE infrastructure saves some space.. and since these are all
// simple single file songs there is no need for FILE
int load_text_buffer(char* buf, int bufSize, struct text_data* t);
#endif

#endif
