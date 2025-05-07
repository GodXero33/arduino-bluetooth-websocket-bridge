const int RED_LED_PIN = 10;
const int GREEN_LED_PIN = 11;
const int BLUE_LED_PIN = 12;
int LED_PINS[] = { RED_LED_PIN, GREEN_LED_PIN, BLUE_LED_PIN };
const char seperator = '\n';

String inputBuffer = "";

void setup () {
  Serial.begin(9600);

  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
}

void loop () {
  while (Serial.available()) whileSerialAvailable();
}

void whileSerialAvailable () {
  char c = Serial.read();

  if (c != seperator) {
    inputBuffer += c;
    return;
  }

  handleIncomingData(inputBuffer);
  Serial.flush();

  inputBuffer = "";
}

void extractMessageString (String msg, int values[]) {
  int sepIndex = msg.indexOf('|');

  if (sepIndex > 0) {
    String part1 = msg.substring(0, sepIndex);
    String part2 = msg.substring(sepIndex + 1);

    values[0] = part1.substring(1).toInt();
    values[1] = part2.substring(1).toInt();
  }

  return values;
}

void handleIncomingData (String buffer) {
  int values[2];

  extractMessageString(buffer, values);
  digitalWrite( LED_PINS[values[0]], values[1] == 1 ? HIGH : LOW);
}
