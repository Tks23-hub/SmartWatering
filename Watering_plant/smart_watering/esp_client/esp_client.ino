#include <DHT.h>
#include <ArduinoJson.h>

// ---- pins ------
#define dhtPin 16
#define pump 15
#define lightSensor 36
#define MoistureSensore 39

// ----- General data -----
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

//----- State machine -----
#define TEMP_MODE 61
#define SOIL_MOISTURE_MODE 62
#define SABBATH_MODE 63
#define MANUAL_MODE 64
int CurrentStatus;
unsigned long statusCheckTime;
unsigned long DataPullTime;
unsigned long activationTime;


unsigned long lastDataSentTime = 0;
const unsigned long dataSendInterval = 10800000; // 3 hours in milliseconds

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
    digitalWrite(pump, LOW);
    if (millis() - activationTime > (maxT * minutes)) {
      digitalWrite(pump, HIGH);
      isOnPump = false;
      countOn++;
      activationTime = millis();
    }
  } else if (isOnPump && countOn < 2) {
    digitalWrite(pump, LOW);
    if (millis() - activationTime > (minT * minutes)) {
      digitalWrite(pump, HIGH);
      isOnPump = false;
      countOn++;
      activationTime = millis();
    }
  }
}

void runSoilMoistureMode() {
  int moisture = analogRead(MoistureSensore);

  if ((millis() - DataPullTime) > (2 * minutes)) {
    deserializeJson(doc, getJsonData("soilMode"));
    int targetMoisture = doc["moisture"];
    DataPullTime = millis();

    if (moisture < targetMoisture - 10) {
      digitalWrite(pump, LOW);
    } else if (moisture > targetMoisture + 10) {
      digitalWrite(pump, HIGH);
    }
  }
}

void runSabbathMode() {
  if ((millis() - DataPullTime) > (60 * minutes)) {
    deserializeJson(doc, getJsonData("sabbathMode"));
    int sabbathOnTime = doc["onTime"];
    int sabbathOffTime = doc["offTime"];
    DataPullTime = millis();

    if (millis() % (sabbathOnTime * minutes) == 0) {
      digitalWrite(pump, LOW);
    }
    if (millis() % (sabbathOffTime * minutes) == 0) {
      digitalWrite(pump, HIGH);
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
    digitalWrite(pump, LOW);
    delay(5000);
    digitalWrite(pump, HIGH);
  }
}


void sendSensorData() {
  float currentTemp = dht.readTemperature();
  int currentLight = map(analogRead(lightSensor), 0, 4095, 0, 100);
  int currentMoisture = analogRead(MoistureSensore);

  Serial.println("Sending sensor data to server...");
  sendData(currentTemp, currentLight, currentMoisture);
}
