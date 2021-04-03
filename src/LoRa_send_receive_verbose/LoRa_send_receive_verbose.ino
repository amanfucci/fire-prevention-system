#include <LoRa.h>
#include <ArduinoLowPower.h>
#include <manfuLora.h>

long lastSendTime = 0;
int interval = inter_s;
int dutyInterval;
int8_t t = 20, humidity = 70;
uint16_t CO2 = 10000, tvoc = 500, upId = 0;
byte *send_buf[12];
short send_buf_len = 0;

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

	LoRa.enableCrc();
	LoRa.setSpreadingFactor(SF);
	LoRa.setSignalBandwidth(BW);
	//Set random sending window
	lastSendTime = random(inter_s * 2);
}

void loop()
{

	// send packet
	//Sending window open? Duty Cycle sending window open?
	if (millis() - lastSendTime > max(interval, dutyInterval))
	{
		byte *new_packet;

		//Gather sensor data
		new_packet = dataToPacket(t, humidity, CO2, tvoc, upId);

		send_buf[send_buf_len] = new_packet;
		send_buf_len++;

		LoRa.beginPacket(); //Variable size packet

		for (int i = 0; i < send_buf_len; i++)
			LoRa.write(send_buf[i], 20);

		LoRa.endPacket();

		lastSendTime = millis();
		//Set new random sending window
		interval = random(inter_s, inter_s + (inter_s / 2));

		if (upId == 65535)
			upId = 0;
		else
			upId++;

		Serial.println("----------Sent-----------");
		printByteArr(send_buf, send_buf_len, 20);

		//Set Duty Cycle Interval
		dutyInterval = dutyCycle(send_buf_len * 20);
		Serial.print(";Interval: ");
		Serial.print(dutyInterval);
		Serial.println();

		freePByteArr(send_buf, send_buf_len);
		send_buf_len = 0;

		LoRa.idle();
	}

	delay(50);

	if (send_buf_len < 11)
	{
		// receive packet
		if (LoRa.parsePacket())
		{
			byte *r_data;
			/*int8_t r_t, r_humidity;
			uint16_t r_CO2, r_tvoc, r_upId;
			uint64_t r_arduinoId;*/
			short packet_size = LoRa.available();
			short i;
			r_data = (byte *)malloc(packet_size);
			/*id_temp = (byte *)malloc(8);
			temp = (byte *)malloc(2);*/

			//Reads data
			i = 0;
			while (LoRa.available())
			{
				r_data[i] = LoRa.read();
				i++;
			}

			Serial.println("----------Received-------");
			printByteArr(r_data, packet_size, 20);

			//Add to buffer
			i = 0;
			while (send_buf_len < 11 && i < packet_size)
			{ //TTL > 0? My packet? My protocol?
				if (getTtl(&r_data[i]) > 0 && memcmp(UniqueID8, &r_data[i], 8) && r_data[i + 17] == 0x12)
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

			/*
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

			//Save CO2 levels
			for (int i = 0; i < 2; i++)
			{
				temp[i] = r_data[11 - i]; //10 + 1 - i (little Endian)
			}
			memcpy(&r_CO2, temp, 2);

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
			//Print all to serial
			Serial.print("Arduino Id: ");
			Serial.print(r_arduinoId);
			Serial.print(";T: ");
			Serial.print(r_t);
			Serial.print(";Hum: ");
			Serial.print(r_humidity);
			Serial.print("%;CO2: ");
			Serial.print(r_CO2);
			Serial.print("ppm;Tvoc: ");
			Serial.print(r_tvoc);
			Serial.print("ppm;upId: ");
			Serial.print(r_upId);
			Serial.println();*/
			//print RSSI of packet
			Serial.print(" | RSSI: ");
			Serial.print(LoRa.packetRssi());
			Serial.print(", SNR: ");
			Serial.println(LoRa.packetSnr());

			free(r_data);
		}
	}
	else
	{
		LoRa.sleep();
		LowPower.sleep(max(interval, dutyInterval) - (millis() - lastSendTime));
	}
}
/*
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

int dutyCycle(int PL)
{
	float T_sym = pow(2, SF) / (BW / 1E3);
	float n_payload = 8 + ceil((float)(8 * PL + 16) / 28) * 5;
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
}*/