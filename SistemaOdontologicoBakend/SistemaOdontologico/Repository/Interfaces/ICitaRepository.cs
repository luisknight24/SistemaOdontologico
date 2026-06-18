using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;
namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface ICitaRepository
  {
    Task<CitaDTO> registrarCita(CitaDTO modelo);
    Task<List<ReporteDTO>> ReporteCita(string fechaInicio, string fechaFin);
    Task<List<ReporteDTO>> Reporte2();
    Task<List<CitaDTO>> listaCitas();
    Task<bool> eliminarCita(int id);
    Task<bool> editarCita(CitaDTO modelo);
    Task<CitaDTO> obtenerPorIdCita(int id);
  }
}