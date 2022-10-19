#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>
#include "Config.h"
#include "Color.h"

#define D5 14
#define D6 12
#define D7 13

int red_pin = D5;
int green_pin = D6;
int blue_pin = D7;

ESP8266WiFiMulti WiFiMulti;

void setLEDColor(Color color)
 {
  analogWrite(red_pin, color.r);
  analogWrite(green_pin, color.g);
  analogWrite(blue_pin, color.b);
}

void setup() {
  Serial.begin(115200);

  pinMode(red_pin, OUTPUT);
  pinMode(green_pin, OUTPUT);
  pinMode(blue_pin, OUTPUT);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(Config::ssid, Config::password);
}

void loop() {
  // wait for WiFi connection
  if ((WiFiMulti.run() == WL_CONNECTED)) {

    std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);

    client->setFingerprint(Config::fingerprint);
    // Or, if you happy to ignore the SSL certificate, then use the following line instead:
    client->setInsecure();

    HTTPClient https;

    Serial.print("[HTTPS] begin...\n");
    if (https.begin(*client, Config::server)) {  // HTTPS

      Serial.print("[HTTPS] GET...\n");
      // start connection and send HTTP header
      int httpCode = https.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          DynamicJsonDocument doc(1024);
          deserializeJson(doc, payload);
          DynamicJsonDocument response(1024);
          deserializeJson(response, doc["data"]["response"]);
          
          const int red = response["color"]["red"];
          const int green = response["color"]["green"];
          const int blue = response["color"]["blue"];
          Color color = createColor(red, green, blue);
          setLEDColor(color);
        }
      } else {
        Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }

  Serial.println("Wait 5s before next round...");
  delay(5000);
}
