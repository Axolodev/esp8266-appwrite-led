#include <stdint.h>

/**
 * If you're unsure what to do with this file check the Readme.md file
*/
namespace Config {
  extern const char ssid[] = "Wifi name";
  extern const char password[] = "Wifi password";
  extern const char server[] = "https://your-railway-function.railway.app/v1/execute";
  extern const uint8_t fingerprint[20] = {0xC4, 0xF2, 0xBF, 0x54, 0xC3, 0x12, 0x10, 0xC0, 0xC4, 0x9B, 0x10, 0x54, 0xF2, 0x10, 0x10, 0xBF, 0xDB, 0x7C, 0xBF, 0x10};
}
