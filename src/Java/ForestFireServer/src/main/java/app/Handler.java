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

            
            for (int i = 0; i < len ; i++) {
                if (i % 20 == 0)
                    System.out.println();
                System.out.print(String.format("%02X ", data[i]));
            }
            is.close();
            // Write to DB
        } catch (IOException e) {
            System.out.println(e);
        }

    }
}
