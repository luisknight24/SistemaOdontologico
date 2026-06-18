using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using SistemaOdontologico.Models;
using System.Collections.Generic;
namespace SistemaOdontologico.Repositorios.Contratos
{
  public interface ICitaRepositorycs:IGenericRepository<Cita>
  {
    Task<Cita> Registrar(Cita modelo);
    Task<Cita> ObtenerPorId(int citaId);
    Task<bool> Editar(Cita modelo);
  }
}
