namespace SistemaOdontologico.DTO
{
  public class PacienteDTO
  {
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public int? Edad { get; set; }
    public string? Genero { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
  }
}