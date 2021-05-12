package app;

import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSocket;
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
public class Listener {

    private static final int port = 57089;
    private static final String[] protocols = new String[] { "TLSv1.3" };
    private static final String[] cipher_suites = new String[] { "TLS_AES_128_GCM_SHA256" };

    public static void main(String[] args){
        System.setProperty("javax.net.ssl.keyStoreType","JKS");
        System.setProperty("javax.net.ssl.trustStoreType","JKS");
        System.setProperty("javax.net.ssl.keyStore", "C:/xampp/htdocs/forest-fire-prevention/src/Java/keystore.jks");
        System.setProperty("javax.net.ssl.keyStorePassword", "passphrase");
        System.setProperty("javax.net.ssl.trustStore", "C:/xampp/htdocs/forest-fire-prevention/src/Java/truststore.jks");
        System.setProperty("javax.net.ssl.trustStorePassword", "passphrase");
        try {
            EchoServer server = EchoServer.create(port);
            new Thread(server).start();

        } catch (IOException e) {
            System.out.println(e);
        }
        System.out.println("fin");
    }

    public static class EchoServer implements Runnable, AutoCloseable {

        private static final int FREE_PORT = 0;

        private final SSLServerSocket sslServerSocket;

        private EchoServer(SSLServerSocket sslServerSocket) {
            this.sslServerSocket = sslServerSocket;
        }

        public int port() {
            return sslServerSocket.getLocalPort();
        }

        @Override
        public void close() throws IOException {
            if (sslServerSocket != null && !sslServerSocket.isClosed()) {
                sslServerSocket.close();
            }
        }

        @Override
        public void run() {
            System.out.println("Server started on port " + port());

            while (true) {
                try {
                    new Thread(new Handler((SSLSocket) sslServerSocket.accept())).start();
                } catch (IOException e) {
                    System.out.println(e);
                }
            }

        }

        public static EchoServer create() throws IOException {
            return create(FREE_PORT);
        }

        public static EchoServer create(int port) throws IOException {
            SSLServerSocket socket = (SSLServerSocket) SSLServerSocketFactory.getDefault().createServerSocket(port);
            socket.setEnabledProtocols(protocols);
            socket.setEnabledCipherSuites(cipher_suites);
            return new EchoServer(socket);
        }
    }
}
