#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

// Replace with your network credentials
const char* ssid = "realme P1 5G";
const char* password = "i7c3edda";

// Create a persistent secure WiFi client outside the loop
BearSSL::WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  // Uncomment this for detailed debugging
  // Serial.setDebugOutput(true);

  Serial.println();
  Serial.println("Connecting to WiFi...");

  // Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // Wait for Wi-Fi connection
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println("\nConnected to WiFi!");
  
  // Ignore SSL certificate validation
  client.setInsecure();
}

void loop() {
  // Ensure Wi-Fi connection before making HTTPS request
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient https;

    Serial.println("[HTTPS] Begin...");
    // Initialize HTTPS connection
    if (https.begin(client, "https://smart-inhaler-try.vercel.app/gh")) {
      Serial.println("[HTTPS] GET...");

      // Start connection and send HTTP header
      int httpCode = https.GET();

      // httpCode > 0 means connection was successful
      if (httpCode > 0) {
        Serial.printf("[HTTPS] GET... Code: %d\n", httpCode);
        
        // Check for success
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          Serial.println("Payload received:");
          Serial.println(payload);
        }
      } else {
        // Print error if GET request failed
        Serial.printf("[HTTPS] GET... Failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end(); // Close connection
    } else {
      Serial.println("[HTTPS] Unable to connect");
    }
  } else {
    Serial.println("WiFi Disconnected. Attempting to reconnect...");
    WiFi.reconnect();
  }

  Serial.println("\nWaiting 5 minutes before the next request...");
  delay(300000);  // Delay 5 minutes before next request
}