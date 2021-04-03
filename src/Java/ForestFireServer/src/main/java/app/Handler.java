package app;

import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;

public class Handler implements Runnable {

    private final SSLSocket socket;

    public Handler(SSLSocket s) {
        socket = s;
    }

    @Override
    public void run() {
        try {
            InputStream is = new BufferedInputStream(socket.getInputStream());
            byte[] data = new byte[240];
            int len = is.read(data);

            int i = 0;
            for (byte b : data) {
                if (i % 20 == 0)
                    System.out.println();
                System.out.print(String.format("%02X ", b));
                i++;
            }
            // Write to DB
        } catch (IOException e) {
            // TODO: handle exception
        }

    }
}
