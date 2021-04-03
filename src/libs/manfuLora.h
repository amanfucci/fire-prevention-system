#ifndef manfuLora_h
#define manfuLora_h

#include <stdint.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoUniqueID.h>

#define DHTPIN 0
#define DHTTYPE DHT22
#define SF 7
#define BW 125E3
#define ttl_s 7		  //hops
#define inter_s 10000 //ms

void freePByteArr(byte **arr, int d1);
void printByteArr(byte **arr, int d1, int d2);
void printByteArr(byte *arr, int len, int nl);
void printByteArr(byte *arr, int len);
void blinking(int delta, int n);
byte getTtl(byte *arr);
byte *decrTtl(byte *arr);
byte *dataToPacket(byte t, byte humidity, uint16_t CO2, uint16_t tvoc, uint16_t upId);
byte *dataToByte(int8_t t, byte humidity, uint16_t CO2, uint16_t tvoc, uint16_t upId);
byte *int16ToByte(uint16_t val);
byte *revArr(byte *arr, int len);
byte *concatArr(byte *x, byte *y, int len);
bool DHTReady(DHT_Unified d);
int8_t getTemp(DHT_Unified d);
uint8_t getHum(DHT_Unified d);
int dutyCycle(int PL);

#endif