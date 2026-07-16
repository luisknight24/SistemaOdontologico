namespace SistemaOdontologico.DTO
{
  public class CitaDTO
  {
   public int Id { get; set; }
   public String? NumeroDocumento { get; set; }
   public String? TotalTexto { get; set; }
   public string? Estado { get; set; }
   public ICollection<DetalleCitaDTO> DetalleCita { get; set; }
  }

}
