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
  public class CitaRepository:ICitaRepository
  {
    private readonly ICitaRepositorycs _citaRepository;
    private readonly IGenericRepository<DetalleCita> _DetalleCitaRepositorio;
    private readonly IMapper _mapper;
    public CitaRepository(ICitaRepositorycs citaRepository, IGenericRepository<DetalleCita> detalleCitaRepositorio, IMapper mapper)
    {
      _citaRepository = citaRepository;
      _DetalleCitaRepositorio = detalleCitaRepositorio;
      _mapper = mapper;
    }
    public async Task<CitaDTO> registrarCita(CitaDTO modelo)
    {
      try
      {
        var CitaGenerada = await _citaRepository.Registrar(_mapper.Map<Cita>(modelo));

        if (CitaGenerada.Id == 0)
          throw new TaskCanceledException("No se pudo crear la cita");
        return _mapper.Map<CitaDTO>(CitaGenerada);
      }
      catch
      {
        throw;
      }
    }
    public async Task<List<ReporteDTO>> ReporteCita(string fechaInicio, string fechaFin)
    {
      IQueryable<DetalleCita> query = await _DetalleCitaRepositorio.Consultar();
      var listaResultado = new List<DetalleCita>();
      try
      {
        if (string.IsNullOrEmpty(fechaInicio) || string.IsNullOrEmpty(fechaFin))
        {
          listaResultado = await query
              .Include(p => p.Odontologo)
              .Include(p => p.Paciente)
              .Include(p => p.Servicio)
              .Include(p => p.Cita)
              .ToListAsync();
        }
        else
        {
          DateTime fech_Inicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-EC"));
          DateTime fech_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-EC"));
          listaResultado = await query
              .Include(p => p.Odontologo)
              .Include(p => p.Paciente)
              .Include(p => p.Servicio)
              .Include(p => p.Cita)
              .Where(dv =>
                  dv.FechaReserva.Value.Date >= fech_Inicio.Date &&
                  dv.FechaReserva.Value.Date <= fech_Fin.Date
              ).ToListAsync();
        }
      }
      catch
      {
        throw;
      }
      return _mapper.Map<List<ReporteDTO>>(listaResultado);
    }
    public async Task<List<ReporteDTO>> Reporte2()
    {
      IQueryable<DetalleCita> query = await _DetalleCitaRepositorio.Consultar();
      var listaResultado = new List<DetalleCita>();
      try
      {
        listaResultado = await query

             .Include(p => p.Odontologo)
             .Include(p => p.Paciente)
             .Include(p => p.Servicio)
             .Include(p => p.Cita)
             .ToListAsync();
      }
      catch
      {
        throw;
      }
      return _mapper.Map<List<ReporteDTO>>(listaResultado);
    }
    public async Task<bool> eliminarCita(int id)
    {
      try
      {
        var OdontologoEncontrado = await _DetalleCitaRepositorio.Obtener(u => u.Id == id);
        if (OdontologoEncontrado == null)
          throw new TaskCanceledException("Cita no existe");
        bool respuesta = await _DetalleCitaRepositorio.Eliminar(OdontologoEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }
    public async Task<List<CitaDTO>> listaCitas()
    {
      try
      {
        var queryOdontologo = await _citaRepository.Consultar();
        IQueryable<DetalleCita> query = await _DetalleCitaRepositorio.Consultar();
        List<DetalleCita> listaResultado;
        try
        {
          listaResultado = await query
              .Include(p => p.Odontologo)
              .Include(p => p.Paciente)
              .Include(p => p.Servicio)
              .Include(p => p.Cita)
              .ToListAsync();
        }
        catch
        {
          throw;
        }
        foreach (var citaDto in queryOdontologo)
        {
          var detallesPorCita = new Dictionary<int, List<DetalleCita>>();
          foreach (var detalle in listaResultado)
          {
            if (!detallesPorCita.ContainsKey(detalle.Id))
            {
              detallesPorCita[detalle.Id] = new List<DetalleCita>();
            }
            detallesPorCita[detalle.Id].Add(detalle);
          }
          if (detallesPorCita.ContainsKey(citaDto.Id))
          {
            citaDto.DetalleCita = detallesPorCita[citaDto.Id];
          }
          else
          {
            citaDto.DetalleCita = new List<DetalleCita>();
          }
        }
        return _mapper.Map<List<CitaDTO>>(queryOdontologo);
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> editarCita(CitaDTO modelo)
    {
      try
      {
        var OdontolgoModelo = _mapper.Map<Cita>(modelo);
        var OdontologoEncontrado = await _citaRepository.Obtener(u => u.Id == OdontolgoModelo.Id);
        if (OdontologoEncontrado == null)          
            throw new TaskCanceledException("La cita no existe");
        OdontologoEncontrado.DetalleCita = OdontolgoModelo.DetalleCita;
        bool respuesta = await _citaRepository.Editar(OdontologoEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    } 
    public async Task<CitaDTO> obtenerPorIdCita(int id)
    {
        try
        {
            var odontologoEncontrado = await _citaRepository.Obtenerid(u => u.Id == id);
            var listaUsuario = odontologoEncontrado.Include(rol => rol.DetalleCita)
                                                        .ThenInclude(detalleCita => detalleCita.Paciente)
                                                      .Include(cita => cita.DetalleCita)
                                                        .ThenInclude(detalleCita => detalleCita.Odontologo)
                                                       .Include(cita => cita.DetalleCita)
                                                        .ThenInclude(detalleCita => detalleCita.Servicio)
                                                       .ToList();

            var odontologo = listaUsuario.FirstOrDefault();
            if (odontologo == null)
              throw new TaskCanceledException("Cita no encontrado");
            return _mapper.Map<CitaDTO>(odontologo);
        }
        catch
        {
          throw;
        }
    } 
  }
}



