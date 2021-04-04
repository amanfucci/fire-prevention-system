#include <LoRa.h>
#include <manfuLora.h>

byte *rec_buf[12];
short rec_buf_len = 0;

void setup()
{
	pinMode(LED_BUILTIN, OUTPUT);
	blinking(100, 3);

	Serial.begin(115200);
	while (!Serial)
		; //Wait for Serial to start

	//Begin loRa
	while (!LoRa.begin(868E6))
	{
		blinking(500, 1);
		delay(5000);
	}

	LoRa.enableCrc();
	LoRa.setSpreadingFactor(SF);
	LoRa.setSignalBandwidth(BW);
	LoRa.setCodingRate4(CR);
}

void loop()
{

	if (!Serial)
	{
		blinking(500, 1);
		Serial.begin(115200);
	}

	// receive packet
	if (LoRa.parsePacket())
	{
		byte *r_data;
		short i;
		short packet_size = LoRa.available();

		if (packet_size % 20 == 0) //Is of correct length?
		{
			r_data = (byte *)malloc(packet_size);
			//Reads data
			i = 0;
			while (LoRa.available())
			{
				r_data[i] = LoRa.read();
				i++;
			}
			short n_mes = packet_size / 20;

			//Check integrity of each message
			for (i = 0; i < n_mes; i++)
			{
				if (r_data[20 * i + 17] != 0x12)
				{ //Isn't my protocol?
					n_mes = i;
					break;
				}
			}

			if (n_mes != 0)
			{
				Serial.write(r_data, n_mes * 20);
				blinking(50, 3);
			}
			else
			{
				blinking(150, 1);
			}
			free(r_data);
		}
	}
}
