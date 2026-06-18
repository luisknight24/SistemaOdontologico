using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;
namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface IServicioRepository
  {
    Task<List<ServicioDTO>> listaServicios();
    Task<ServicioDTO> crearServicio(ServicioDTO modelo);
    Task<bool> editarServicio(ServicioDTO modelo);
    Task<bool> eliminarServicio(int id);
    Task<ServicioDTO> obtenerPorIdServicio(int id);
  }
}