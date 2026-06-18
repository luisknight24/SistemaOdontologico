using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;

namespace SistemaOdontologico.Repositorios.Implementacion
{
  public class RolRepository: IRolRepository
  {
    private readonly IGenericRepository<Rol> _RolRepositorio;
    private readonly IMapper _mapper;

    public RolRepository(IGenericRepository<Rol> rolRepositorio, IMapper mapper)
    {
      _RolRepositorio = rolRepositorio;
      _mapper = mapper;
    }

    public async Task<List<RolDTO>> listaRoles()
    {
      try
      {
        var listaRoles = await _RolRepositorio.Consultar();
        return _mapper.Map<List<RolDTO>>(listaRoles.ToList());
      }
      catch {
        throw;
      }
    }
  }
}