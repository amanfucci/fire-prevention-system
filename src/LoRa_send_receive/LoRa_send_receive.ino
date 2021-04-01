#include <SPI.h>
#include <LoRa.h>
#include <ArduinoUniqueID.h>
#include <stdint.h>
#include <CCS811.h>
#define inter_s 100 //ms
#define ttl_s 7		//hops

CCS811 air_sensor;
long lastSendTime = 0;
int interval = inter_s;
int8_t t = 20, humidity = 70;
uint16_t CO2 = 10000, tvoc = 500, upId = 0;
byte *send_buf[12];
short send_buf_len = 0;

void setup()
{
	randomSeed(analogRead(0));
	pinMode(LED_BUILTIN, OUTPUT);
	blinking(100, 3);

	//Begin loRa
	if (!LoRa.begin(868E6))
	{
		//blinking(400,2);
		while (1);
	}
	LoRa.enableCrc();
	//Set random sending window
	lastSendTime = random(inter_s * 2);

	//CCS811
	air_sensor.begin();
	air_sensor.setMeasCycle(air_sensor.eCycle_10s);

}

void loop()
{

	// send packet
	if ((millis() - lastSendTime > interval) && air_sensor.checkDataReady()) //Sending window open?
	{
		byte *new_packet;

		//Gather sensor data
		new_packet = dataToPacket(t, humidity, air_sensor.getCO2PPM(), air_sensor.getTVOCPPB(), upId);

		send_buf[send_buf_len] = new_packet;
		send_buf_len++;

		LoRa.beginPacket(); //Variable size packet

		for (int i = 0; i < send_buf_len; i++)
			LoRa.write(send_buf[i], 20);

		LoRa.endPacket();

		lastSendTime = millis();
		//Set new random sending window
		interval = random(inter_s * 2);

		if (upId == 65535)
			upId = 0;
		else
			upId++;

		freePByteArr(send_buf, send_buf_len);
		send_buf_len = 0;
		air_sensor.writeBaseLine(0x847B);
	}

	delay(50);
	// receive packet
	if (LoRa.parsePacket() && send_buf_len < 19)
	{
		byte *r_data;
		short packet_size = LoRa.available();
		short i;
		r_data = (byte *)malloc(packet_size);

		//Reads data
		i = 0;
		while (LoRa.available())
		{
			r_data[i] = LoRa.read();
			i++;
		}

		//blinking(i*2,3);

		//Add to buffer
		i = 0;
		while (send_buf_len < 11 && i < packet_size)
		{
			if (getTtl(&r_data[i]) > 0 && memcmp(UniqueID8, &r_data[i], 8)) //TTL > 0 ?
			{
				int k;
				bool isNewID = true;	 //New id?
				bool isNewUpdate = true; //New update?

				for (k = 0; k < send_buf_len; k++)
				{
					if (!memcmp(send_buf[k], &r_data[i], 8)) //Same id as one in buffer?
					{
						isNewID = false;

						if (memcmp(send_buf[k] + 14, &r_data[i] + 14, 2) < 0) //Lower upID?
						{
							isNewUpdate = false;
						}
						else
						{
							free(send_buf[k]);
						}
						break; //Only one packet for each id
					}
				}

				if (isNewID)
				{
					decrTtl(&r_data[i]);
					send_buf[send_buf_len] = (byte *)malloc(20);
					memcpy(send_buf[send_buf_len], &r_data[i], 20);
					send_buf_len++;
				}
				else
				{
					if (isNewUpdate)
					{
						decrTtl(&r_data[i]);
						send_buf[k] = (byte *)malloc(20);
						memcpy(send_buf[k], &r_data[i], 20);
					}
				}
			}
			i += 20;
		}

		free(r_data);
	}
}

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
	byte res[] = {0x00, 0x00, 0x00};

	data = dataToByte(t, humidity, CO2, tvoc, upId);
	packet = (byte *)malloc(20);
	memcpy(packet, UniqueID8, 8);
	memcpy(packet + 8, data, 8);
	memcpy(packet + 16, &ttl, 1);
	memcpy(packet + 17, res, 3);
	free(data);
	return packet;
}

byte *dataToByte(byte t, byte humidity, uint16_t CO2, uint16_t tvoc, uint16_t upId)
{
	byte *data, *x;
	data = (byte *)malloc(8);
	data[0] = t;
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