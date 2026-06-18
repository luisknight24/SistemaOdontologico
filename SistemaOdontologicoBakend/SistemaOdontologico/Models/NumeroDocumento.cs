using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;
namespace SistemaOdontologico.Models
{
  public class NumeroDocumento
  {
    public int Id { get; set; }
    public int UltimoNumero { get; set; } 
  }
}
