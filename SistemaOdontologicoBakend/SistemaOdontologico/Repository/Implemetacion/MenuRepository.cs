using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace SistemaOdontologico.Repositorios.Implemetacion
{
  public class MenuRepository:IMenuRepository
  {
    private readonly IGenericRepository<Usuario> _UsuarioRepositorio;
    private readonly IGenericRepository<MenuRol> _MenuRolRepositorio;
    private readonly IGenericRepository<Menu> _MenuRepositorio;
    private readonly IMapper _mapper;
    public MenuRepository(IGenericRepository<Usuario> usuarioRepositorio, IGenericRepository<MenuRol> menuRolRepositorio, IGenericRepository<Menu> menuRepositorio, IMapper mapper)
    {
      _UsuarioRepositorio = usuarioRepositorio;
      _MenuRolRepositorio = menuRolRepositorio;
      _MenuRepositorio = menuRepositorio;
      _mapper = mapper;
    }
    public async Task<List<MenuDTO>> listaMenus(int usuarioId)
    {
      IQueryable<Usuario> tbUsuario = await _UsuarioRepositorio.Consultar(u => u.Id == usuarioId);
      IQueryable<MenuRol> tbMenuRol = await _MenuRolRepositorio.Consultar();
      IQueryable<Menu> tbMenu = await _MenuRepositorio.Consultar();
      try
      {
        IQueryable<Menu> tbResultado = (from u in tbUsuario
                                        join mr in tbMenuRol on u.RolId equals mr.RolId
                                        join m in tbMenu on mr.MenuId equals m.Id
                                        select m).AsQueryable();

        var usuario = tbUsuario.FirstOrDefault();
        if (usuario != null)
        {
            if (usuario.RolId == 3) // Paciente
            {
                tbResultado = tbResultado.Where(m => m.Nombre != "Dashboard");
            }
            else if (usuario.RolId == 2) // Odontólogo
            {
                tbResultado = tbResultado.Where(m => m.Nombre != "Usuarios" && m.Nombre != "Servicios");
            }
        }

        var listaMenus = tbResultado.ToList();
        return _mapper.Map<List<MenuDTO>>(listaMenus);
      }
      catch {
        throw;
      }
    }
  }
}
