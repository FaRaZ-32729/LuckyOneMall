#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "Ammad Mallick";
const char* password = "ammad.mallick";

const char* websocket_server = "192.168.43.58";  
const int websocket_port = 5000;
const char* websocket_path = "/ws/alerts";

WebSocketsClient webSocket;

const char* device_id = "device-001";

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WSc] Disconnected!");
      break;

    case WStype_CONNECTED:
      Serial.println("[WSc] Connected to backend WebSocket server!");
      webSocket.sendTXT("ESP32 connected successfully");
      break;

    case WStype_TEXT:
      Serial.printf("[WSc] Received: %s\n", payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected!");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());

  webSocket.begin(websocket_server, websocket_port, websocket_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 10000) { 
    lastSend = millis();

    // Simulated sensor values
    float temperature = random(150, 450) / 10.0; // 15°C to 45°C
    float humidity    = random(300, 900) / 10.0; // 30% to 90%

    bool temperatureHigh = temperature > 30;  // TEMP ALERT rule
    bool humidityHigh = humidity < 40;       // HUMID ALERT rule
    bool odourDetected = random(0, 10) > 7;  // 30% chance odour detected

    // Convert alerts to required strings
    String temperatureAlert = temperatureHigh ? "HIGH" : "NORMAL";
    String humidityAlert    = humidityHigh ? "HIGH" : "NORMAL";
    String odourAlert       = odourDetected ? "DETECTED" : "NORMAL";

    // Build JSON packet
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
