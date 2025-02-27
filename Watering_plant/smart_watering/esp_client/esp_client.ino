#include <DHT.h>
#include <ArduinoJson.h>

#define dhtPin 16
#define pump 15
#define lightSensor 36
#define MoistureSensor 39

#define DHTTYPE DHT22
DHT dht(dhtPin, DHTTYPE);
JsonDocument doc;
float CurrentTemp;
int light;
int minutes = (1000 * 60);
float temp;
int minT, maxT;
bool isOnPump;
int countOn = 0;

#define TEMP_MODE 61
#define SOIL_MOISTURE_MODE 62
#define SABBATH_MODE 63
#define MANUAL_MODE 64
int CurrentStatus;
unsigned long statusCheckTime;
unsigned long DataPullTime;
unsigned long activationTime;

unsigned long pumpStartTime = 0;
unsigned long totalWaterUsed = 0;
const float waterFlowRate = 200.0;

unsigned long lastDataSentTime = 0;
const unsigned long dataSendInterval = 10800000;

int plantID = 1;

void setup() {
  pinMode(pump, OUTPUT);
  Serial.begin(115200);
  WiFi_SETUP();
  dht.begin();
  isOnPump = true;
  statusCheckTime = millis();
}

void loop() {
  if ((millis() - statusCheckTime) > (10 * minutes)) {
    CurrentStatus = GetState();
    statusCheckTime = millis();
  }

  switch (CurrentStatus) {
    case TEMP_MODE:
      runTemperatureMode();
      break;
    case SOIL_MOISTURE_MODE:
      runSoilMoistureMode();
      break;
    case SABBATH_MODE:
      runSabbathMode();
      break;
    case MANUAL_MODE:
      runManualMode();
      break;
  }

  if (millis() - lastDataSentTime >= dataSendInterval) {
    sendSensorData();
    lastDataSentTime = millis();
  }
}

void runTemperatureMode() {
  CurrentTemp = dht.readTemperature();
  light = map(analogRead(lightSensor), 0, 4095, 0, 100);

  if ((millis() - DataPullTime) > (2 * minutes)) {
    deserializeJson(doc, getJsonData("tempMode"));
    temp = (float) doc["temp"];
    minT = doc["minTime"];
    maxT = doc["maxTime"];
    DataPullTime = millis();
  }

  if (light > 90) {
    isOnPump = true;
  } else if (light < 10 && countOn == 2) {
    isOnPump = true;
    countOn = 0;
  }

  if (isOnPump && temp < CurrentTemp && countOn < 2 && light < 40) {
    startWatering();
    if (millis() - activationTime > (maxT * minutes)) {
      stopWatering();
      countOn++;
      activationTime = millis();
    }
  } else if (isOnPump && countOn < 2) {
    startWatering();
    if (millis() - activationTime > (minT * minutes)) {
      stopWatering();
      countOn++;
      activationTime = millis();
    }
  }
}

void runSoilMoistureMode() {
  int moisture = analogRead(MoistureSensor);

  if ((millis() - DataPullTime) > (2 * minutes)) {
    deserializeJson(doc, getJsonData("soilMode"));
    int targetMoisture = doc["moisture"];
    DataPullTime = millis();

    if (moisture < targetMoisture - 10) {
      startWatering();
    } else if (moisture > targetMoisture + 10) {
      stopWatering();
    }
  }
}

void runSabbathMode() {
  if ((millis() - DataPullTime) > (60 * minutes)) {
    deserializeJson(doc, getJsonData("sabbathMode"));
    int sabbathOnTime = doc["onTime"];
    int sabbathOffTime = doc["offTime"];
    DataPullTime = millis();

    if (millis() - activationTime >= (sabbathOnTime * minutes)) {
      startWatering();
    }
    if (millis() - activationTime >= (sabbathOffTime * minutes)) {
      stopWatering();
    }
  }
}

void runManualMode() {
  static unsigned long lastCommandTime = 0;
  static bool commandReceived = false;

  if (!commandReceived) {
    lastCommandTime = millis();
    commandReceived = true;
  }

  if (commandReceived && millis() - lastCommandTime >= 3000) {
    commandReceived = false;
    startWatering();
    delay(5000);
    stopWatering();
  }
}

void startWatering() {
  digitalWrite(pump, LOW);
  pumpStartTime = millis();
}

void stopWatering() {
  digitalWrite(pump, HIGH);
  unsigned long wateringTime = (millis() - pumpStartTime) / 60000.0;
  totalWaterUsed += wateringTime * waterFlowRate;
}

void sendSensorData() {
  float currentTemp = dht.readTemperature();
  int currentLight = map(analogRead(lightSensor), 0, 4095, 0, 100);
  int currentMoisture = analogRead(MoistureSensor);

  Serial.println("Sending sensor data to server...");
  sendData(currentTemp, currentLight, currentMoisture, plantID, totalWaterUsed);
}
