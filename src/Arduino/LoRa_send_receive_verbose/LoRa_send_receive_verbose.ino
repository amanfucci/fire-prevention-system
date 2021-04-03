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
	LoRa.setCodingRate4(CR);
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
			{ //TTL > 0? Not mine? My protocol?
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
		//If send_buf full full wait till sending window open
		LoRa.sleep();
		LowPower.sleep(max(interval, dutyInterval) - (millis() - lastSendTime));
	}
}