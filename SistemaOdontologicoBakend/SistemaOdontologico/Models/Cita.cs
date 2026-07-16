using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;
namespace SistemaOdontologico.Models
{
  public class Cita
  {
   public int Id { get; set; }
   public String? NumeroDocumento { get; set; }

   [Column(TypeName = "decimal(18, 2)")]
   public Decimal? Total { get; set; }
   public string? Estado { get; set; } = "Pendiente";
   public ICollection<DetalleCita> DetalleCita { get; set; }
  }
}
