using SistemaOdontologico.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;

namespace SistemaOdontologico.DTO
{
  public class RolDTO
  {
    public int Id { get; set; }
    public string? Descripcion { get; set; }
  }
}