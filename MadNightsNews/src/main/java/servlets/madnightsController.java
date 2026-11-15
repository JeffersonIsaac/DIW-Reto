package servlets;

import com.google.gson.Gson;
import dao.EventoDao;
import modelo.Evento;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/eventos")
public class madnightsController extends HttpServlet {

    private final Gson gson = new Gson();
    private final EventoDao eventoDao = new EventoDao(); // Instanciamos el DAO

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Llamamos al DAO para obtener la lista
            List<Evento> eventosList = eventoDao.obtenerTodos();

            response.setStatus(HttpServletResponse.SC_OK);
            out.write(gson.toJson(eventosList));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al consultar los eventos: " + e.getMessage());
            out.write(gson.toJson(error));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> jsonResponse = new HashMap<>();

        // Leer el JSON recibido de JavaScript
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        Evento nuevoEvento = gson.fromJson(sb.toString(), Evento.class);

        // Validación básica
        if (nuevoEvento.getTitulo() == null || nuevoEvento.getTitulo().trim().isEmpty() ||
                nuevoEvento.getFecha() == null || nuevoEvento.getFecha().trim().isEmpty()) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("error", "Los campos obligatorios (título y fecha) no pueden estar vacíos.");
            out.write(gson.toJson(jsonResponse));
            return;
        }

        try {
            // Llamamos al DAO para insertar en la BD
            boolean insertado = eventoDao.insertar(nuevoEvento);

            if (insertado) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                jsonResponse.put("status", "success");
                jsonResponse.put("message", "Evento insertado correctamente");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.put("error", "No se pudo insertar el registro.");
            }

            out.write(gson.toJson(jsonResponse));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.put("error", "Error en la base de datos: " + e.getMessage());
            out.write(gson.toJson(jsonResponse));
        }
    }
}