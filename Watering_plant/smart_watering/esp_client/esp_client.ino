#include <DHT.h>

#define dhtPin 16
#define DHTTYPE DHT22

DHT dht(dhtPin, DHTTYPE);

#define lightSensor 36
#define MoistureSensore 39

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi_SETUP();
  dht.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  sendData();
  int light = analogRead(lightSensor);
  int moisture = analogRead(MoistureSensore);
  float t = dht.readTemperature();
  Serial.print("temp = ");
  Serial.print(t);
  Serial.print(", ligth = ");
  Serial.print(light);
  Serial.print(", Moisture = ");
  Serial.println(moisture);
  delay(500);
}
