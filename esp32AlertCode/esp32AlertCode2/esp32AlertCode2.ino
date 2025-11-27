#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "Ammad Mallick";
const char* password = "ammad.mallick";

// PRODUCTION SERVER (USE WSS)
WebSocketsClient webSocket;
const char* websocket_host = "odourremovingsystemserver-production.up.railway.app";
const char* websocket_path = "/ws/alerts";
const int websocket_port = 443;  // HTTPS/WSS uses port 443

const char* device_id = "device-001";

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WSc] Disconnected!");
      break;

    case WStype_CONNECTED:
      Serial.println("[WSc] Connected to WebSocket!");
      webSocket.sendTXT("ESP32 connected successfully");
      break;

    case WStype_TEXT:
      Serial.printf("[WSc] Received: %s\n", payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected!");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());

  // ---- PRODUCTION WSS CONNECTION ----
  webSocket.beginSSL(websocket_host, websocket_port, websocket_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();

  // static unsigned long lastPing = 0;
  // if (millis() - lastPing > 5000) {
  //   webSocket.sendTXT("{\"type\":\"heartbeat\"}");
  //   lastPing = millis();
  // }

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 10000) {
    lastSend = millis();

    float temperature = random(150, 450) / 10.0;
    float humidity = random(300, 900) / 10.0;
    bool temperatureHigh = temperature > 30;
    bool humidityHigh = humidity < 40;
    bool odourDetected = random(0, 10) > 7;

    String temperatureAlert = temperatureHigh ? "HIGH" : "NORMAL";
    String humidityAlert = humidityHigh ? "HIGH" : "NORMAL";
    String odourAlert = odourDetected ? "DETECTED" : "NORMAL";

    String jsonData = "{";
    jsonData += "\"deviceId\":\"" + String(device_id) + "\",";
    jsonData += "\"temperature\":" + String(temperature, 1) + ",";
    jsonData += "\"humidity\":" + String(humidity, 1) + ",";
    jsonData += "\"temperatureAlert\":\"" + temperatureAlert + "\",";
    jsonData += "\"humidityAlert\":\"" + humidityAlert + "\",";
    jsonData += "\"odourAlert\":\"" + odourAlert + "\"";
    jsonData += "}";

    Serial.println("📤 Sending data: " + jsonData);
    webSocket.sendTXT(jsonData);
  }
}
