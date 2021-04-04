#include <LoRa.h>
#include <manfuLora.h>

byte *send_buf[100];
short send_buf_len = 0;

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

			//Add to buffer
			i = 0;
			while (i < packet_size && send_buf_len < 100)
			{ //My protocol?
				if (r_data[i + 17] == 0x12)
				{
					Serial.write(&r_data[i], 20);
					send_buf_len++;
				}
				i += 20;
			}
			send_buf_len = 0;
		}
	}
}
