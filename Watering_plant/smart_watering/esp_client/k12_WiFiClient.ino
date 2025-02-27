#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>

const char* ssid = "www";
const char* password = "Hello";

WiFiClient client;

void WiFi_SETUP(){
  WiFi.begin(ssid,password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void sendData(float temp, int light, int moisture, int plantID, float waterUsed) {
  HTTPClient http;
  String dataUrl = "http://192.168.1.83:3001/esp";
  
  http.begin(client, dataUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"temp\":" + String(temp) + ",";
  jsonPayload += "\"light\":" + String(light) + ",";
  jsonPayload += "\"moisture\":" + String(moisture) + ",";
  jsonPayload += "\"plantID\":" + String(plantID) + ",";
  jsonPayload += "\"waterUsed\":" + String(waterUsed);
  jsonPayload += "}";

  int httpCode = http.POST(jsonPayload);
  if (httpCode == HTTP_CODE_OK) {
    Serial.println("Data sent successfully");
  } else {
    Serial.print("Error sending data: ");
    Serial.println(httpCode);
  }

  http.end();
}


int GetState() {
    int ret = -1;
    HTTPClient http;
    http.begin(client, "http://192.168.1.83:3001/esp/state");
    int httpCode = http.GET();
    Serial.println(httpCode);
    if (httpCode == HTTP_CODE_OK) {
      Serial.print("HTTP response code ");
      Serial.println(httpCode);
      String Res = http.getString();
      Serial.println(Res);
      ret = Res.toInt();
    }
    http.end();
        
    return ret;
}

String getJsonData(String state){
  String json = "";
  HTTPClient http;
  http.begin(client, "http://192.168.1.83:3001/esp/dataMode?state="+state);
  int httpCode = http.GET();
  Serial.println(httpCode);
  if (httpCode == HTTP_CODE_OK) {
    Serial.print("HTTP response code ");
    Serial.println(httpCode);
    json = http.getString();
  }
    http.end();
        
    return json;
}

