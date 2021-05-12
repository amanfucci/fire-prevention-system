package app;

import java.sql.*;
import java.sql.DriverManager;

public class dataBase {

    Connection con;

    public dataBase(String host, String port, String db, String user, String pw) throws Exception {

        //Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection("jdbc:mysql://"+host+":"+port+"/"+db,
         user, pw);

    }

    public void closCon() throws SQLException {
        con.close();
    }

    public void query(String sql) throws SQLException{
        Statement stm = con.createStatement();
        ResultSet rs = stm.executeQuery(sql);
        while(rs.next()){
            
        }
    }

    public void manipulate(String sql) throws SQLException{
        PreparedStatement pstmt = con.prepareStatement(sql);
        pstmt.execute();
    }
}
