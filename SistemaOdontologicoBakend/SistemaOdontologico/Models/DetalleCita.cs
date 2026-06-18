using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;

namespace SistemaOdontologico.Models
{
  public class DetalleCita
  {
    public int Id { get; set; }
    public int? CitaId { get; set; }
    public int? PacienteId { get; set; }
    public int? OdontologoId { get; set; }
    public int? ServicioId { get; set; }
    public DateTime? FechaReserva { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public Decimal? Precio { get; set; }
    public  Servicio? Servicio { get; set; }
    public Cita? Cita { get; set; }
    public Paciente? Paciente { get; set; }
    public Odontologo? Odontologo { get; set; }
  }
}
