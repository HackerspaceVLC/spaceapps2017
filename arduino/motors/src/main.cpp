#include <Arduino.h>
#include <Stepper.h>
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Servo.h>

Servo myservo;  // create servo object to control a servo
                // twelve servo objects can be created on most boards

const char *ssid = "YourSSIDHere";
const char *password = "YourPSKHere";

ESP8266WebServer server ( 80 );

int val=0;
// change this to the number of steps on your motor
#define STEPS 100

// create an instance of the stepper class, specifying
// the number of steps of the motor and the pins it's
// attached to
Stepper stepper(STEPS, 16, 5, 4, 0);

// the previous reading from the analog input
int previous = 0;

void setup() {
  // set the speed of the motor to 30 RPMs
  Serial.begin(115200);
  stepper.setSpeed(1300);
  myservo.attach(14);  // attaches the servo on GIO2 to the servo object

}

void loop() {
val++;
if(val>=180)val=0;
  // move a number of steps equal to the change in the
  // sensor reading
  myservo.write(val);
  stepper.step(5);
delay(10);

}
