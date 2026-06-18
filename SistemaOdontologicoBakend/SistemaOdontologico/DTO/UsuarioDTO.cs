namespace SistemaOdontologico.DTO
{
  public class UsuarioDTO
  {
    public int Id { get; set; }
    public string? NombreApellidos { get; set; }
    public string? Correo { get; set; }
    public int? RolId { get; set; }
    public String? RolDescripcion { get; set; }
    public string? Clave { get; set; }
    public int? EsActivo { get; set; }
  }
}