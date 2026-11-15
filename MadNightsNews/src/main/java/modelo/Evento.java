package modelo;


public class Evento {
    private int id;
    private String titulo;
    private String categoria;
    private String fecha;
    private String ubicacion;
    private double precio;
    private String descripcion;
    private String foto1;
    private String foto2;
    private String foto3;



    // Constructor para evento nuevo desde el form
    public Evento(String titulo, String categoria, String fecha, String ubicacion, double precio, String descripcion, String foto1, String foto2, String foto3) {
        this.titulo = titulo;
        this.categoria = categoria;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.precio = precio;
        this.descripcion = descripcion;
        this.foto1 = foto1;
        this.foto2 = foto2;
        this.foto3 = foto3;
    }

    // Constructor completo con ID
    public Evento(int id, String titulo, String categoria, String fecha, String ubicacion, double precio, String descripcion, String foto1, String foto2, String foto3) {
        this.id = id;
        this.titulo = titulo;
        this.categoria = categoria;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.precio = precio;
        this.descripcion = descripcion;
        this.foto1 = foto1;
        this.foto2 = foto2;
        this.foto3 = foto3;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFoto1() {
        return foto1;
    }

    public void setFoto1(String foto1) {
        this.foto1 = foto1;
    }

    public String getFoto2() {
        return foto2;
    }

    public void setFoto2(String foto2) {
        this.foto2 = foto2;
    }

    public String getFoto3() {
        return foto3;
    }

    public void setFoto3(String foto3) {
        this.foto3 = foto3;
    }
}
