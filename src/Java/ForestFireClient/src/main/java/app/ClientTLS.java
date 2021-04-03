package app;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;

/*
 * Don't forget to set the following system properties when you run the class:
 *
 *     javax.net.ssl.keyStore
 *     javax.net.ssl.keyStorePassword
 *     javax.net.ssl.trustStore
 *     javax.net.ssl.trustStorePassword
 *
 * More details can be found in JSSE docs.
 *
 * For example:
 * 
 *     java -cp classes \
 *         -Djavax.net.ssl.keyStore=keystore \
 *         -Djavax.net.ssl.keyStorePassword=passphrase \
 *         -Djavax.net.ssl.trustStore=keystore \
 *         -Djavax.net.ssl.trustStorePassword=passphrase \
 *             com.gypsyengineer.tlsbunny.jsse.TLSv13Test
 * 
 * For testing purposes, you can download the keystore file from 
 *
 *     https://github.com/openjdk/jdk/tree/master/test/jdk/javax/net/ssl/etc
 */
public class ClientTLS implements Runnable {

    private static final int port = 57089;
    private static final String[] protocols = new String[] { "TLSv1.3" };
    private static final String[] cipher_suites = new String[] { "TLS_AES_128_GCM_SHA256" };
    
    private final int size;
    private final byte[] message;
    private final SSLSocket socket;
    private final OutputStream os;

    public ClientTLS(byte[] m, int s) throws IOException {
        size = s;
        message = m;
        socket = createSocket("localhost", port);
        os = new BufferedOutputStream(socket.getOutputStream());
    }

    @Override
    public void run() {
        try {
            os.write(message, 0, size);
            os.flush();
            os.close();
        } catch (IOException e) {
            //Save error to log file
            //or send log to server
        }
        
    }

    public static SSLSocket createSocket(String host, int port) throws IOException {
        SSLSocket socket = (SSLSocket) SSLSocketFactory.getDefault().createSocket(host, port);
        socket.setEnabledProtocols(protocols);
        socket.setEnabledCipherSuites(cipher_suites);
        return socket;
    }

}