// Define the analog pin for AO output
const int hallSensorAnalogPin = A0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int analogValue = analogRead(hallSensorAnalogPin);
  Serial.print("Magnetic Field Strength: ");
  Serial.println(analogValue);
  delay(500);
}
