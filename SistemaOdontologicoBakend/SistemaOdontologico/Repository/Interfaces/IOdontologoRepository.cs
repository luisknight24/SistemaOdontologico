
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;
namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface IOdontologoRepository
  {
    Task<List<OdontologoDTO>> listaOdontontologos();
    Task<OdontologoDTO> crearOdontontologo(OdontologoDTO modelo);
    Task<bool> editarOdontontologo(OdontologoDTO modelo);
    Task<bool> eliminarOdontontologo(int id);
    Task<OdontologoDTO> obtenerPorIdOdontontologo(int id);
  }
}