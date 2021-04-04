package app;

import java.io.IOException;
/*
GDCuyasen
http://gmac.2600tech.com/
*/
import java.util.Scanner;

import com.fazecast.jSerialComm.SerialPort;
import com.fazecast.jSerialComm.SerialPortDataListener;
import com.fazecast.jSerialComm.SerialPortEvent;

public class SerialListener {

	SerialPort activePort;
	SerialPort[] ports = SerialPort.getCommPorts();

	public void showAllPort() {
		int i = 0;
		for (SerialPort port : ports) {
			System.out.print(i + ". " + port.getDescriptivePortName() + " ");
			System.out.println(port.getPortDescription());
			i++;
		}
	}

	public boolean isConnected (int port){
		ports = SerialPort.getCommPorts();

		return ports.length > (port);
	}

	public void setPort(int portIndex) {
		activePort = ports[portIndex];
		activePort.setBaudRate(115200);
		if (activePort.openPort()){
			System.out.println(activePort.getPortDescription() + " port opened.");
			System.out.println("Baud rate: " + activePort.getBaudRate());
		}


		activePort.addDataListener(new SerialPortDataListener() {

			@Override
			public void serialEvent(SerialPortEvent event) {
				int size = event.getSerialPort().bytesAvailable();
				byte[] buffer = new byte[size];
				event.getSerialPort().readBytes(buffer, size);
				
				try {
					new Thread(new ClientTLS(buffer, size)).start();
				} catch (IOException e) {
					// Manage exception
				}

				int i = 0;
				for (byte b : buffer) {
					if (i % 20 == 0)
						System.out.println();
					System.out.print(String.format("%02X ", b));
					i++;
				}
			}

			@Override
			public int getListeningEvents() {
				return SerialPort.LISTENING_EVENT_DATA_AVAILABLE;
			}
		});

	}

	public void start() {
		showAllPort();
		Scanner reader = new Scanner(System.in);
		System.out.print("Port? ");
		int p = reader.nextInt();
		setPort(p);
		reader.close();
	}

}
