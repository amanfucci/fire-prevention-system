#include <LoRa.h>
#include <ArduinoLowPower.h>
#include <CCS811.h>
#include <manfuLora.h>

CCS811 air_sensor;
DHT_Unified dht(DHTPIN, DHTTYPE);

uint16_t upId = 0;
long lastSendTime = 0;
int interval = inter_s;
int dutyInterval;
byte *send_buf[12];
short send_buf_len = 0;

void setup()
{
	randomSeed(analogRead(0));
	pinMode(LED_BUILTIN, OUTPUT);
	blinking(100, 3);

	//Begin loRa
	while (!LoRa.begin(868E6))
	{
		blinking(500, 1);
		delay(5000);
	}
	LoRa.enableCrc();
	LoRa.setSpreadingFactor(SF);
	LoRa.setSignalBandwidth(BW);
	//Set random sending window
	lastSendTime = random(inter_s * 2);

	//CCS811
	while (air_sensor.begin() != 0)
	{
		blinking(500, 2);
		delay(5000);
	}
	//DHT
	dht.begin();

	air_sensor.setMeasCycle(air_sensor.eCycle_10s);
}

void loop()
{
	/*
	if(!air_sensor.checkDataReady()){
		if(DHTReady(dht)){
			blinking(50,1);
		}else{
			blinking(200,1);
		}		
	}
	else{
		if(DHTReady(dht)){
			blinking(500,1);
		}else{
			blinking(1000,1);
		}			
	}*/

	// send packet
	//Sending window open? Duty Cycle sending window open?
	if (millis() - lastSendTime > max(interval, dutyInterval))
	{
		if (air_sensor.checkDataReady() && DHTReady(dht)) //Data from sensors?
		{
			byte *new_packet;

			//Gather sensor data
			new_packet = dataToPacket(getTemp(dht), getHum(dht), air_sensor.getCO2PPM(), air_sensor.getTVOCPPB(), upId);

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

			dutyInterval = dutyCycle(send_buf_len * 20);

			freePByteArr(send_buf, send_buf_len);
			send_buf_len = 0;
			air_sensor.writeBaseLine(0x847B);
			blinking(50, 2);

			LoRa.idle();
		}
		else
		{
			lastSendTime = millis() - (interval - 3000);
		}
	}

	delay(50);

	if (send_buf_len < 11)
	{
		// receive packet
		if (LoRa.parsePacket())
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
			free(r_data);
		}
	}
	else
	{
		LoRa.sleep();
		LowPower.sleep(max(interval, dutyInterval) - (millis() - lastSendTime));
	}
}