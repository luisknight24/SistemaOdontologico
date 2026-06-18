using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaOdontologico.DTO;

namespace SistemaOdontologico.Repositorios.Interfaces
{
  public interface IUsuarioRepository
  {
    Task<List<UsuarioDTO>> listaUsuarios();
    Task<SesionDTO> ValidarCredenciales(string correo, string clave);
    Task<UsuarioDTO> crearUsuario(UsuarioDTO modelo);
    Task<bool> editarUsuario(UsuarioDTO modelo);
    Task<bool> eliminarUsuario(int id);
    Task<UsuarioDTO> obtenerPorIdUsuario(int id);
  }
}