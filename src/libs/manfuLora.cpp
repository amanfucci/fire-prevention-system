#include <Arduino.h>
#include "manfuLora.h"

void freePByteArr(byte **arr, int d1)
{
	for (int i = 0; i < d1; i++)
	{
		free(arr[i]);
	}
}

void printByteArr(byte **arr, int d1, int d2)
{

	for (int i = 0; i < d1; i++)
	{
		printByteArr(arr[i], d2);
	}
}

void printByteArr(byte *arr, int len, int nl)
{
	for (int i = 0; i < len; i++)
	{
		if ((i != 0) && (i % nl == 0))
			Serial.println();
		if (arr[i] < 0x10)
			Serial.print("0");
		Serial.print(arr[i], HEX);
		Serial.print(" ");
	}
	Serial.println();
}

void printByteArr(byte *arr, int len)
{
	for (int i = 0; i < len; i++)
	{
		if (arr[i] < 0x10)
			Serial.print("0");
		Serial.print(arr[i], HEX);
		Serial.print(" ");
	}
	Serial.println();
}

void blinking(int delta, int n)
{
	for (int i = 0; i < n; i++)
	{
		digitalWrite(LED_BUILTIN, HIGH);
		delay(delta);
		digitalWrite(LED_BUILTIN, LOW);
		delay(delta);
	}
}

byte getTtl(byte *arr)
{
	byte ttl;
	memcpy(&ttl, arr + 16, 1);
	return ttl;
}

byte *decrTtl(byte *arr)
{
	byte ttl;
	ttl = getTtl(arr) - 1;
	memcpy(arr + 16, &ttl, 1);
	return arr;
}

byte *dataToPacket(byte t, byte humidity, uint16_t CO2, uint16_t tvoc, uint16_t upId)
{
	byte *packet;
	byte *data;
	byte ttl = ttl_s;
	byte protocol[] = {0x12};
	byte res[] = {0x00, 0x00};

	data = dataToByte(t, humidity, CO2, tvoc, upId);
	packet = (byte *)malloc(20);
	memcpy(packet, UniqueID8, 8);
	memcpy(packet + 8, data, 8);
	memcpy(packet + 16, &ttl, 1);
	memcpy(packet + 17, protocol, 1);
	memcpy(packet + 18, res, 2);
	free(data);
	return packet;
}

byte *dataToByte(int8_t t, byte humidity, uint16_t CO2, uint16_t tvoc, uint16_t upId)
{
	byte *data, *x;
	data = (byte *)malloc(8);
	memcpy(data, &t, 1);
	data[1] = humidity;
	x = int16ToByte(CO2);
	memcpy(data + 2, x, 2);
	free(x);
	x = int16ToByte(tvoc);
	memcpy(data + 4, x, 2);
	free(x);
	x = int16ToByte(upId);
	memcpy(data + 6, x, 2);
	free(x);

	return data;
}

byte *int16ToByte(uint16_t val)
{
	byte *data;
	data = (byte *)malloc(2);
	data[0] = highByte(val); //Little Endian!
	data[1] = lowByte(val);	 //the first byte is the lsB
							 //so highByte will give the lsB

	return data;
}

byte *revArr(byte *arr, int len)
{
	int len_half = len / 2;
	byte temp;
	for (int i = 0; i < len_half; i++)
	{
		temp = arr[i];
		arr[i] = arr[len - i - 1];
		arr[len - i - 1] = temp;
	}
	return arr;
}

byte *concatArr(byte *x, byte *y, int len)
{

	byte *z = (byte *)malloc(16);
	for (int i = 0; i < len; i++)
	{
		z[i] = x[i];
		z[i + len] = y[i];
	}

	return z;
}

bool DHTReady(DHT_Unified d)
{
	sensors_event_t e1, e2;
	d.temperature().getEvent(&e1);
	d.humidity().getEvent(&e2);
	return !isnan(e1.temperature) && !isnan(e2.relative_humidity);
}

int8_t getTemp(DHT_Unified d)
{
	sensors_event_t e1;
	int8_t temp;
	int t;
	d.temperature().getEvent(&e1);
	t = (int)e1.temperature;
	memcpy(&temp, &t, 8);
	return temp;
}

uint8_t getHum(DHT_Unified d)
{
	sensors_event_t e1;
	uint8_t temp;
	int h;
	d.humidity().getEvent(&e1);
	h = (int)e1.relative_humidity;
	memcpy(&temp, &h, 8);
	return temp;
}

int dutyCycle(int PL)
{
	float T_sym = pow(2, SF) / (BW / 1E3);
	float n_payload = 8 + ceil((float)(8 * PL - 4*SF + 44) /(4*SF)) * CR;
	float T_preamble = (8 + 4.25) * T_sym;
	float T_payload = n_payload * T_sym;

	if (Serial)
	{
		Serial.print("pl:");
		Serial.print(PL);
		Serial.print(";n_payload:");
		Serial.print(n_payload, 6);
		Serial.print(";T_sym:");
		Serial.print(T_sym, 6);
		Serial.print(";T_preamble:");
		Serial.print(T_preamble, 6);
		Serial.print(";T_payload:");
		Serial.print(T_payload, 6);
	}

	return (int)ceil((T_preamble + T_payload) * 99);
}