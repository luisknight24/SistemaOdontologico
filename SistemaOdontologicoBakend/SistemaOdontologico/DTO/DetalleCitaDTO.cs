namespace SistemaOdontologico.DTO
{
  public class DetalleCitaDTO
  {
   public int Id { get; set; }
   public int? PacienteId { get; set; }
   public string? DescripcionPaciente { get; set; }
   public int? OdontologoId { get; set; }
   public string? DescripcionOdontologo { get; set; }
   public int? ServicioId { get; set; }
   public string? DescripcionServicio { get; set; }
   public String? FechaReserva { get; set; }
   public String? PrecioTexto { get; set; }
  }
}
