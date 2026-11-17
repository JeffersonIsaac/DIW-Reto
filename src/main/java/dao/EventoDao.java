package dao;

import com.madnights.db.DatabaseConnection;
import modelo.Evento;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EventoDao {

    //GET por fecha
    public List<Evento> obtenerTodos() throws SQLException {
        List<Evento> eventosList = new ArrayList<>();
        String sql = "SELECT id, titulo, categoria, fecha, ubicacion, precio, descripcion, foto1, foto2, foto3 FROM eventos ORDER BY fecha DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Evento evento = new Evento(
                        rs.getInt("id"),
                        rs.getString("titulo"),
                        rs.getString("categoria"),
                        rs.getString("fecha"),
                        rs.getString("ubicacion"),
                        rs.getDouble("precio"),
                        rs.getString("descripcion"),
                        rs.getString("foto1"),
                        rs.getString("foto2"),
                        rs.getString("foto3")
                );
                eventosList.add(evento);
            }
        }
        return eventosList;
    }

    // --- MÉTODO POST: Insertar un nuevo evento de forma segura ---
    public boolean insertar(Evento evento) throws SQLException {
        String sql = "INSERT INTO eventos (titulo, categoria, fecha, ubicacion, precio, descripcion, foto1, foto2, foto3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, evento.getTitulo());
            pstmt.setString(2, evento.getCategoria());
            pstmt.setString(3, evento.getFecha());
            pstmt.setString(4, evento.getUbicacion());
            pstmt.setDouble(5, evento.getPrecio());
            pstmt.setString(6, evento.getDescripcion());
            pstmt.setString(7, evento.getFoto1());
            pstmt.setString(8, evento.getFoto2());
            pstmt.setString(9, evento.getFoto3());

            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        }
    }
}