#ifndef STASSID
#define STASSID

struct Color {
  int r = 0;
  int g = 0;
  int b = 0;
};

extern Color createColor(int r, int g, int b) {
  Color color;
  
  color.r = r;
  color.g = g;
  color.b = b;
  
  return color;
}

#endif
