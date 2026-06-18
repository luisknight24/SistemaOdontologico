using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;
namespace SistemaOdontologico.Models
{
  public class Odontologo
  {
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public int? Experiencia { get; set; }
    public string? Especialidad { get; set; }
    public int? Edad { get; set; }
    public string? Email { get; set; }

  }
}
