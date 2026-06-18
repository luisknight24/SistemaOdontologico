using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;

namespace SistemaOdontologico.Models
{
  public class Servicio
  {
    public int Id { get; set; }
    public String? NombreServicio { get; set; }
    [Column(TypeName = "decimal(18, 2)")]
    public Decimal? precio { get; set; }
    public ICollection<DetalleCita> DetalleCita { get; set; }
  }
}
