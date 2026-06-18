using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;
namespace SistemaOdontologico.Models
{
  public class Paciente
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
