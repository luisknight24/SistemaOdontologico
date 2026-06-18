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
  public class OdontologoRepository:IOdontologoRepository
  {
    private readonly IGenericRepository<Odontologo> _OdontologoRepositorio;
    private readonly IMapper _mapper;
    public OdontologoRepository(IGenericRepository<Odontologo> odontologoRepositorio, IMapper mapper)
    {
      _OdontologoRepositorio = odontologoRepositorio;
      _mapper = mapper;
    }
    public async Task<List<OdontologoDTO>> listaOdontontologos()
    {
      try
      {
        var queryOdontologo = await _OdontologoRepositorio.Consultar();
        var listaServicio = queryOdontologo.ToList();
        return _mapper.Map<List<OdontologoDTO>>(listaServicio);
      }
      catch
      {
        throw;
      }
    }
    public async Task<OdontologoDTO> crearOdontontologo(OdontologoDTO modelo)
    {
      try
      {
        var OdontologoCreado = await _OdontologoRepositorio.Crear(_mapper.Map<Odontologo>(modelo));
        if (OdontologoCreado.Id == 0)
          throw new TaskCanceledException("No se pudo registrar el odontólogo");
        return _mapper.Map<OdontologoDTO>(OdontologoCreado);
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> editarOdontontologo(OdontologoDTO modelo)
    {
      try
      {
        var OdontolgoModelo = _mapper.Map<Odontologo>(modelo);
        var OdontologoEncontrado = await _OdontologoRepositorio.Obtener(u => u.Id == OdontolgoModelo.Id);
        if (OdontologoEncontrado == null)
          throw new TaskCanceledException("El Odontólogo no existe");

        OdontologoEncontrado.Nombre = OdontolgoModelo.Nombre;
        OdontologoEncontrado.Apellido = OdontolgoModelo.Apellido;
        OdontologoEncontrado.Experiencia = OdontolgoModelo.Experiencia;
        OdontologoEncontrado.Especialidad = OdontolgoModelo.Especialidad;
        OdontologoEncontrado.Edad = OdontolgoModelo.Edad;
        OdontologoEncontrado.Email = OdontolgoModelo.Email;

        bool respuesta = await _OdontologoRepositorio.Editar(OdontologoEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> eliminarOdontontologo(int id)
    {
      try
      {
        var OdontologoEncontrado = await _OdontologoRepositorio.Obtener(u => u.Id == id);
        if (OdontologoEncontrado == null)
          throw new TaskCanceledException("Odontólogo no existe");
        bool respuesta = await _OdontologoRepositorio.Eliminar(OdontologoEncontrado);      
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
    public async Task<OdontologoDTO> obtenerPorIdOdontontologo(int id)
    {
      try
      {
        var odontologoEncontrado = await _OdontologoRepositorio.Obtener(u => u.Id == id);
        if (odontologoEncontrado == null)
          throw new TaskCanceledException("Odontólogo no encontrado");
        return _mapper.Map<OdontologoDTO>(odontologoEncontrado);
      }
      catch
      {
        throw;
      }
    }
  }
}
