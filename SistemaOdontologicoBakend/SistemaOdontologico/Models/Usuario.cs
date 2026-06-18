using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;


namespace SistemaOdontologico.Models
{
  public partial class Usuario
  {
    public int Id { get; set; }
    public string? NombreApellidos { get; set; }
    public string? Correo { get; set; }  
    public int? RolId { get; set; }
    public string? Clave { get; set; }
    public bool? EsActivo { get; set; }
    public DateTime? FechaRegistro { get; set; }
    public  Rol Rol { get; set; }
  }
}
