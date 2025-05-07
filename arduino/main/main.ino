const int LED_PIN = 10;
const char seperator = '\n';

String inputBuffer = "";

void turnLEDOn ();
void turnLEDOff ();
typedef void (*ActionFn)();

struct Action {
  const char* command;
  ActionFn action;
};

const Action actions[] = {
  {"ON", turnLEDOn},
  {"OFF", turnLEDOff},
};

const int numActions = sizeof(actions) / sizeof(actions[0]);

void setup () {
  Serial.begin(9600);

  pinMode(LED_PIN, OUTPUT);
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

void handleIncomingData (String buffer) {
  for (int i = 0; i < numActions; i++) {
    if (buffer == actions[i].command) {
      actions[i].action();
      break;
    }
  }
}

void turnLEDOn () {
  digitalWrite(LED_PIN, HIGH);
}

void turnLEDOff () {
  digitalWrite(LED_PIN, LOW);
}
