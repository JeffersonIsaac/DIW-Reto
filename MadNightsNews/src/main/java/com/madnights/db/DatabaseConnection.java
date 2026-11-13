package com.madnights.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/madnights_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root"; // Cambia por tu usuario de MySQL
    private static final String PASSWORD = ""; // Cambia por tu contraseña de MySQL

    public static Connection getConnection() throws SQLException {
        try {
            // Cargar el driver de MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("No se encontró el Driver de MySQL", e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}