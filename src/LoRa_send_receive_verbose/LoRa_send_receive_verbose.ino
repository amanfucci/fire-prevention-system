#include <SPI.h>
#include <LoRa.h>
#include <ArduinoUniqueID.h>
#include <stdint.h>
#define aid_bsize 8	//byte size of arduino_id
#define res_bsize 3	//byte size of reserved
#define inter_s 100 //ms
#define ttl 7		//hops

long lastSendTime = 0;
int interval = inter_s;
int8_t t = 20, humidity = 70;
uint16_t c02 = 10000, tvoc = 500, upId = 0;

void setup()
{
	randomSeed(analogRead(0));
	pinMode(LED_BUILTIN, OUTPUT);
	blinking(100, 3);

	Serial.begin(115200);
	while (!Serial)
		; //Wait for Serial to start
	Serial.print("LoRa Receiver - ");
	UniqueID8dump(Serial);

	//Begin loRa
	if (!LoRa.begin(868E6))
	{
		Serial.println("Starting LoRa failed!");
		while (1)
			;
	}
	//LoRa.setSpreadingFactor(7);
	LoRa.enableCrc();
	//Set random sending window
	lastSendTime = random(inter_s*2);
}

void loop()
{
	

	// send packet
	if (millis() - lastSendTime > interval)//Check if the sending window is open
	{
		byte *x;

		//Gather sensor data

		LoRa.beginPacket(true);
		x = dataToByte(t, humidity, c02, tvoc, upId);
		LoRa.write(UniqueID8, 8);
		LoRa.write(x, 8);//Write data

		LoRa.write(x, 4);//Write TTL & Reserved
		LoRa.endPacket();

		lastSendTime = millis();
		//Set new random sending window
		interval = random(inter_s*2);

		//Print all to serial
		Serial.println("----Sent----");
		printByteArr(x, 8);

		if(upId == 65535)
			upId = 0;
		else
			upId++;

		//free alloc
		free(x);
	}

	// receive packet
	if (LoRa.parsePacket(20))
	{
		byte *r_data, *id_temp, *temp;
		int8_t r_t, r_humidity;
		uint16_t r_c02, r_tvoc, r_upId;
		uint64_t r_arduinoId;
		//Serial.print("Received packet '");
		r_data = (byte *)malloc(16);
		id_temp = (byte *)malloc(8);
		temp = (byte *)malloc(2);
		//Reads data
		for (int i = 0; i < 16; i++)
		{
			r_data[i] = LoRa.read();
		}

		Serial.println("----Received----");
		//printByteArr(r_data, 16);

		//Save arduino Id
		for (int i = 0; i < 8; i++)
		{
			id_temp[i] = r_data[7 - i];
		}
		memcpy(&r_arduinoId, id_temp, 8);
		free(id_temp);

		//Save temperature and humidity
		r_t = r_data[8];
		r_humidity = r_data[9];

		//Save c02 levels
		for (int i = 0; i < 2; i++)
		{
			temp[i] = r_data[11 - i]; //10 + 1 - i (little Endian)
		}
		memcpy(&r_c02, temp, 2);

		//Save tvoc levels
		for (int i = 0; i < 2; i++)
		{
			temp[i] = r_data[13 - i]; //12 + 1 - i (little Endian)
		}
		//free malloc
		memcpy(&r_tvoc, temp, 2);

		//Save update Id
		for (int i = 0; i < 2; i++)
		{
			temp[i] = r_data[15 - i]; //14 + 1 - i (little Endian)
		}
		memcpy(&r_upId, temp, 2);

		//free malloc
		free(temp);
		free(r_data);
		//Print all to serial
		Serial.print("Arduino Id: ");
		Serial.print(r_arduinoId);
		Serial.print(";T: ");
		Serial.print(r_t);
		Serial.print(";Hum: ");
		Serial.print(r_humidity);
		Serial.print("%;C02: ");
		Serial.print(r_c02);
		Serial.print("ppm;Tvoc: ");
		Serial.print(r_tvoc);
		Serial.print("ppm;upId: ");
		Serial.print(r_upId);
		Serial.println();
		/*print RSSI of packet
		Serial.print(" | RSSI: ");
		Serial.print(LoRa.packetRssi());
		Serial.print(", SNR: ");
		Serial.println(LoRa.packetSnr());
		blinking(50, 3);*/
		
	}
}

void printByteArr(byte *arr, int len)
{
	for (int i = 0; i < len; i++)
	{
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

byte *dataToByte(byte t, byte humidity, uint16_t c02, uint16_t tvoc, uint16_t upId)
{
	byte *data, *x;
	data = (byte *)malloc(8);
	data[0] = t;
	data[1] = humidity;
	x = int16ToByte(c02);
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