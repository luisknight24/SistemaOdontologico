using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using System.Linq;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Cryptography;

namespace SistemaOdontologico.Repositorios.Implemetacion
{
  public class UsuarioRepository : IUsuarioRepository
  {
    private readonly IGenericRepository<Usuario> _UsuarioRepositorio;
    private readonly IMapper _mapper;

    public UsuarioRepository(IGenericRepository<Usuario> usuarioRepositorio, IMapper mapper)
    {
      _UsuarioRepositorio = usuarioRepositorio;
      _mapper = mapper;
    }

    public async Task<List<UsuarioDTO>> listaUsuarios()
    {
      try
      {
        var queryUsuario = await _UsuarioRepositorio.Consultar();
        var listaUsuario = queryUsuario.Include(rol => rol.Rol).ToList();
        // Recorremos la lista de usuarios y reemplazamos el hash de la contraseña por el texto plano
        return _mapper.Map<List<UsuarioDTO>>(listaUsuario);
      }
      catch
      {

        throw;
      }
    }

    public async Task<UsuarioDTO> obtenerPorIdUsuario(int id)
    {
      try
      {
        var usuarioEncontrado = await _UsuarioRepositorio
            .Obtenerid(u => u.Id == id);
        var listaUsuario = usuarioEncontrado.Include(rol => rol.Rol).ToList();
        var usuario = listaUsuario.FirstOrDefault();
        if (usuario == null)
          throw new TaskCanceledException("Usuario no encontrado");
        return _mapper.Map<UsuarioDTO>(usuario);
      }
      catch
      {
        throw;
      }
    }
    
    public async Task<SesionDTO> ValidarCredenciales(string correo, string clave)
    {
      try
      {  
        var queryUsuario = await _UsuarioRepositorio.Consultar(
        u => u.Correo == correo
       );
        if (queryUsuario.FirstOrDefault() == null)
          throw new TaskCanceledException("El usuario no existe");
        Usuario devolverUsuario = queryUsuario.Include(rol => rol.Rol).First();
        if (devolverUsuario.EsActivo == false) // Verificar el estado del usuario
          throw new TaskCanceledException("El usuario está inactivo");
        if (!BCrypt.Net.BCrypt.Verify(clave, devolverUsuario.Clave))
          throw new TaskCanceledException("La contraseña es incorrecta");
        return _mapper.Map<SesionDTO>(devolverUsuario);
      }
      catch
      {
        throw;
      }
    }

    public async Task<UsuarioDTO> crearUsuario(UsuarioDTO modelo)
    {
      try
      {
        // Encripta la contraseña del modelo
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(modelo.Clave);
        // Actualiza la propiedad 'Clave' del modelo con la contraseña encriptada
        modelo.Clave = hashedPassword;

        var UsuarioCreado = await _UsuarioRepositorio.Crear(_mapper.Map<Usuario>(modelo));

        if (UsuarioCreado.Id == 0)
          throw new TaskCanceledException("No se pudo Crear");
        var query = await _UsuarioRepositorio.Consultar(u => u.Id == UsuarioCreado.Id);
        UsuarioCreado = query.Include(rol => rol.Rol).First();
        return _mapper.Map<UsuarioDTO>(UsuarioCreado);
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> editarUsuario(UsuarioDTO modelo)
    {
      try
      {
        // Encripta la contraseña del modelo
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(modelo.Clave);
        // Actualiza la propiedad 'Clave' del modelo con la contraseña encriptada
        modelo.Clave = hashedPassword;

        var UsuarioModelo = _mapper.Map<Usuario>(modelo);

        var UsuarioEncontrado = await _UsuarioRepositorio.Obtener(u => u.Id == UsuarioModelo.Id);
        if (UsuarioEncontrado == null)
          throw new TaskCanceledException("El usuario no existe");
        UsuarioEncontrado.NombreApellidos = UsuarioModelo.NombreApellidos;
        UsuarioEncontrado.Correo = UsuarioModelo.Correo;
        UsuarioEncontrado.RolId = UsuarioModelo.RolId;
        UsuarioEncontrado.Clave = UsuarioModelo.Clave;
        UsuarioEncontrado.EsActivo = UsuarioModelo.EsActivo;
        bool respuesta = await _UsuarioRepositorio.Editar(UsuarioEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> eliminarUsuario(int id)
    {
      try
      {
        var UsuarioEncontrado = await _UsuarioRepositorio.Obtener(u => u.Id == id);
        if (UsuarioEncontrado == null)
          throw new TaskCanceledException("Usuario no existe");
        bool respuesta = await _UsuarioRepositorio.Eliminar(UsuarioEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
  }
}