
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using Microsoft.EntityFrameworkCore;

namespace SistemaOdontologico.Repositorios.Implemetacion
{
  public class ServicioRepository: IServicioRepository
  {
    private readonly IGenericRepository<Servicio> _ServicioRepositorio;
    private readonly IMapper _mapper;

    public ServicioRepository(IGenericRepository<Servicio> servicioRepositorio, IMapper mapper)
    {
      _ServicioRepositorio = servicioRepositorio;
      _mapper = mapper;
    }
    public async Task<List<ServicioDTO>> listaServicios()
    {
      try
      {
        var queryServicio = await _ServicioRepositorio.Consultar();
        var listaServicio = queryServicio.ToList();
        return _mapper.Map<List<ServicioDTO>>(listaServicio);
      }
      catch
      {
        throw;
      }
    }

    public async Task<ServicioDTO> crearServicio(ServicioDTO modelo)
    {
      try
      {
        var ServicioCreado = await _ServicioRepositorio.Crear(_mapper.Map<Servicio>(modelo));
        if (ServicioCreado.Id == 0)
          throw new TaskCanceledException("No se pudo Crear");
        return _mapper.Map<ServicioDTO>(ServicioCreado);
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> editarServicio(ServicioDTO modelo)
    {
      try
      {
        var ServicioModelo = _mapper.Map<Servicio>(modelo);
        var ServicioEncontrado = await _ServicioRepositorio.Obtener(u => u.Id == ServicioModelo.Id);
        if (ServicioEncontrado == null)
          throw new TaskCanceledException("El servicio no existe");
        ServicioEncontrado.NombreServicio = ServicioModelo.NombreServicio;
        ServicioEncontrado.precio = ServicioModelo.precio;
        bool respuesta = await _ServicioRepositorio.Editar(ServicioEncontrado);
        return respuesta; 
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> eliminarServicio(int id)
    {
      try
      {
        var ServicioEncontrado = await _ServicioRepositorio.Obtener(u => u.Id == id);
        if (ServicioEncontrado == null)
          throw new TaskCanceledException("Servicio no existe");
        bool respuesta = await _ServicioRepositorio.Eliminar(ServicioEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }

    public async Task<ServicioDTO> obtenerPorIdServicio(int id)
    {
      try
      {
        var odontologoEncontrado = await _ServicioRepositorio.Obtener(u => u.Id == id);
        if (odontologoEncontrado == null)
          throw new TaskCanceledException("Sevicio no encontrado");
        return _mapper.Map<ServicioDTO>(odontologoEncontrado);
      }
      catch
      {
        throw;
      }
    }
  }
}