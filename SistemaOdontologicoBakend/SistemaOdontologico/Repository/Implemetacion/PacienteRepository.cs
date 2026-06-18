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
  public class PacienteRepository: IPacienteRepository
  {
    private readonly IGenericRepository<Paciente> _PacienteRepositorio;

    private readonly IMapper _mapper;
    public PacienteRepository(IGenericRepository<Paciente> pacienteRepositorio, IMapper mapper)
    {
      _PacienteRepositorio = pacienteRepositorio;
      _mapper = mapper;
    }
    public async Task<List<PacienteDTO>> listaPacientes()
    {
      var queryPaciente = await _PacienteRepositorio.Consultar();
      var listaServicio = queryPaciente.ToList();
      return _mapper.Map<List<PacienteDTO>>(listaServicio);
    }
    public async Task<PacienteDTO> crearPaciente(PacienteDTO modelo)
    {
      try
      {
        var PacienteCreado = await _PacienteRepositorio.Crear(_mapper.Map<Paciente>(modelo));
        if (PacienteCreado.Id == 0)
          throw new TaskCanceledException("No se pudo registrar el paciente");

        return _mapper.Map<PacienteDTO>(PacienteCreado);
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> editarPaciente(PacienteDTO modelo)
    {
      try
      {
        var PacienteModelo = _mapper.Map<Paciente>(modelo);
        var PacienteEncontrado = await _PacienteRepositorio.Obtener(u => u.Id == PacienteModelo.Id);
        if (PacienteEncontrado == null)
          throw new TaskCanceledException("El Paciente no existe");

        PacienteEncontrado.Nombre = PacienteModelo.Nombre;
        PacienteEncontrado.Apellido = PacienteModelo.Apellido;
        PacienteEncontrado.Edad = PacienteModelo.Edad;
        PacienteEncontrado.Genero = PacienteModelo.Genero;
        PacienteEncontrado.Direccion = PacienteModelo.Direccion;
        PacienteEncontrado.Telefono = PacienteModelo.Telefono;
        PacienteEncontrado.Email = PacienteModelo.Email;

        bool respuesta = await _PacienteRepositorio.Editar(PacienteEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> eliminarPaciente(int id)
    {
      try
      {
        var PacienteEncontrado = await _PacienteRepositorio.Obtener(u => u.Id == id);
        if (PacienteEncontrado == null)
          throw new TaskCanceledException("Paciente no existe");

        bool respuesta = await _PacienteRepositorio.Eliminar(PacienteEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
    public async Task<PacienteDTO> obtenerPorIdPaciente(int id)
    {
      try
      {
        var pacienteEncontrado = await _PacienteRepositorio.Obtener(u => u.Id == id);
        if (pacienteEncontrado == null)
          throw new TaskCanceledException("Paciente no encontrado");

        return _mapper.Map<PacienteDTO>(pacienteEncontrado);
      }
      catch
      {
        throw;
      }
    }
  }
}
