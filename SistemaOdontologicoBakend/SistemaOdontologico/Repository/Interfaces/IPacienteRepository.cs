using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;

namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface IPacienteRepository
  {
    Task<List<PacienteDTO>> listaPacientes();
    Task<PacienteDTO> crearPaciente(PacienteDTO modelo);
    Task<bool> editarPaciente(PacienteDTO modelo);
    Task<bool> eliminarPaciente(int id);
    Task<PacienteDTO> obtenerPorIdPaciente(int id);
  }
}