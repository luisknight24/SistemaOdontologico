using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;
namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface IMenuRepository
  {
    Task<List<MenuDTO>> listaMenus(int usuarioId);
  }
}