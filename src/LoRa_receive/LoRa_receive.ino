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

		Serial.write(r_data, packet_size);

		free(r_data);
	}
}