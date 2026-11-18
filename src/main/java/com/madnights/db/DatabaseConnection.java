package com.madnights.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {


    private static final String DEFAULT_DB = "mariadb";

    public static Connection getConnection() throws SQLException {
        String url;
        String driver;
        String user = "madnights_app";
        String password = "123";

        if (DEFAULT_DB.equalsIgnoreCase("mysql")) {
            driver = "com.mysql.cj.jdbc.Driver";
            url = "jdbc:mysql://localhost:3307/madnights_db?useSSL=false&serverTimezone=UTC";
        } else {
            driver = "org.mariadb.jdbc.Driver";
            url = "jdbc:mariadb://localhost:3306/madnights_db?useSSL=false&serverTimezone=UTC";
        }

        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            throw new SQLException("No se encontró el Driver JDBC para " + DEFAULT_DB, e);
        }

        return DriverManager.getConnection(url, user, password);
    }
}