package app;

import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.nio.ByteOrder;
import java.text.SimpleDateFormat;  
import java.text.Format;
import java.text.SimpleDateFormat;
import java.sql.Timestamp;
import java.util.Date;
import java.io.*;

public class Handler implements Runnable {

    private final SSLSocket socket;

    public Handler(SSLSocket s) {
        socket = s;
    }

    public static String byteToHex(byte[] arr, int start, int len) {
        String re = "0x";

        for (int i = start; i < (start + len); i++)
            re += String.format("%02X", arr[i]);

        return re.replace(" ", "");
    }

    public static void printByte(byte[] arr, int start, int len) {
        String re = "";
        for (int i = start; i < (start + len); i++)
            re += String.format("%02X ", arr[i]);
        System.out.println(re);
    }

    public static int byteToInt(byte[] arr, int start, int len) {
        int re = 0;
        Boolean be = ByteOrder.nativeOrder().equals(ByteOrder.BIG_ENDIAN);

        for (int i = 0; i < len; i++) {
            if (be){
                //re &= (0x0 << (8 * i));
                re |= ((arr[start + i] & 0xFF) << (8 * i));
            }
            else{
                //re &= (0x0 << (8 * (len - 1 - i)));
                re |= ((arr[start + i] & 0xFF) << (8 * (len - 1 - i)));
            }
        }

        return re;
    }

    @Override
    public void run() {
        try {
            InputStream is = new BufferedInputStream(socket.getInputStream());
            byte[] data = new byte[240];
            int len = is.read(data);
            int n_mes = len / 20;
            is.close();

            // Print to screen
            for (int i = 0; i < len; i += 20) {
               printByte(data, i, 20);
            }

            dataBase db = new dataBase("localhost", "3306", "fire_prevention_system", "root", "");
            String sql = "INSERT INTO misurazioni"
                    + "(sensore, temperatura, umidita, co2, tvoc, updateId, timestamp) VALUES";

            // Save to db
            for (int i = 0; i < len; i += 20) {
                if(i!=0)
                    sql+=",";
                sql += "(CONVERT(" + byteToHex(data, i, 8) + ", UNSIGNED),";
                sql += (int) data[i + 8] + "," + (int) data[i + 9]+",";
                sql += byteToInt(data, i+10, 2) + "," + byteToInt(data, i+12,2) + ",";
                sql += byteToInt(data, i+14, 2) + ",";
                sql += "'"+new Timestamp(new Date().getTime())+"'";
                sql += ")";
            }
            System.out.println(sql);
            db.manipulate(sql);

        } catch (Exception e) {
            System.out.println(e);
        }

    }

}
