namespace SistemaOdontologico.DTO
{
  public class ReporteDTO
  {
    public int Id { get; set; }
    public string? fechaReserva { get; set; }
    public string? NumeroDocumento { get; set; }
    public string? odontologo { get; set; }
    public string? paciente { get; set; }
    public string? servicio { get; set; }
    public string? precio { get; set; }
    public string? estado { get; set; }
    public string? pacienteEmail { get; set; }
  }
}