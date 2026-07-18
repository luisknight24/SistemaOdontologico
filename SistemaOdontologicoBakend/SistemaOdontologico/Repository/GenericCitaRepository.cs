using Microsoft.EntityFrameworkCore;
using SistemaOdontologico.Models;
using SistemaOdontologico.Repositorios.Contratos;
using System.Linq.Expressions;
namespace SistemaOdontologico.Repositorios
{
  public class GenericCitaRepository : GenericRepository<Cita>, ICitaRepositorycs
  {
    private readonly SistemaOdontologicoDbContext _DbContext;
    public GenericCitaRepository(SistemaOdontologicoDbContext dbContext) : base(dbContext)
    {
      _DbContext = dbContext;
    }
    public async Task<Cita> Registrar(Cita entidad)
    {
      Cita citaGenerada = new Cita();
      //usaremos transacion, ya que si ocurre un error en algun insert a una tabla, debe reestablecer todo a cero, como si no hubo o no existió ningun insert
      using (var transaction = _DbContext.Database.BeginTransaction())
      {
        int CantidadDigitos = 4;
        try
        {
        foreach (DetalleCita dv in entidad.DetalleCita)
          {
            Servicio servicio_encontrado = _DbContext.Servicios.Where(p => p.Id == dv.ServicioId).First();
            Odontologo odontologo_encontrado = _DbContext.Odontologos.Where(p => p.Id == dv.OdontologoId).First();
            Paciente paciente_encontrado = _DbContext.Pacientes.Where(p => p.Id == dv.PacienteId).First();
            int appointmentCount = await _DbContext.DetalleCita
                .Where(dc => dc.OdontologoId == odontologo_encontrado.Id && dc.FechaReserva == dv.FechaReserva)
                .CountAsync();
            if (appointmentCount >= 7)
            {
              throw new Exception("El odontólogo ya cuenta con el límite de 7 citas asignadas para la fecha seleccionada.");
            }
          }
          await _DbContext.SaveChangesAsync();          
          NumeroDocumento correlativo = _DbContext.NumeroDocumentos.First();
          correlativo.UltimoNumero = correlativo.UltimoNumero + 1;
          _DbContext.NumeroDocumentos.Update(correlativo);          
          await _DbContext.SaveChangesAsync();
          string ceros = string.Concat(Enumerable.Repeat("0", CantidadDigitos));
          string numeroVenta = ceros + correlativo.UltimoNumero.ToString();
          numeroVenta = numeroVenta.Substring(numeroVenta.Length - CantidadDigitos, CantidadDigitos);
          entidad.NumeroDocumento = numeroVenta;
          if (string.IsNullOrEmpty(entidad.Estado))
          {
              entidad.Estado = "Pendiente";
          }
          await _DbContext.Citas.AddAsync(entidad);
          await _DbContext.SaveChangesAsync();
          citaGenerada = entidad;
          transaction.Commit();
        }
        catch (Exception ex)
        {
          transaction.Rollback();
          throw;
        }
      }
      return citaGenerada;
    }
    public async Task Eliminar(int citaId)
    {
      try
      {
        var cita = await _DbContext.Citas.FindAsync(citaId);
        if (cita != null)
        {
          _DbContext.Citas.Remove(cita);
          await _DbContext.SaveChangesAsync();
        }
      }
      catch
      {
        throw;
      }
    }
    public async Task<bool> Editar(Cita modelo)
    {
      try
      {
        _DbContext.Set<Cita>().Update(modelo);
        await _DbContext.SaveChangesAsync();
        return true;
      }
      catch
      {
        throw;
      }
    }
    public async Task<Cita> ObtenerPorId(int citaId)
    {
      return await _DbContext.Citas.FindAsync(citaId);
    }
  }
}