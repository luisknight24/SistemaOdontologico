using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using SistemaOdontologico.Utilidades;
using System.Globalization;

using Microsoft.AspNetCore.Authorization;

namespace SistemaOdontologico.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly SistemaOdontologicoDbContext _dbContext;

        public DashboardController(SistemaOdontologicoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("Resumen")]
        public async Task<IActionResult> Resumen()
        {
            var rsp = new Response<DashboardDTO>();
            try
            {
                var dto = new DashboardDTO();

                dto.TotalPacientes = await _dbContext.Pacientes.CountAsync();
                dto.TotalOdontologos = await _dbContext.Odontologos.CountAsync();
                dto.TotalCitas = await _dbContext.Citas.Where(c => c.Estado == "Confirmada").CountAsync();

                decimal? totalIngresos = await _dbContext.Citas.Where(c => c.Estado == "Confirmada").SumAsync(c => c.Total);
                dto.TotalIngresos = Convert.ToString(totalIngresos.GetValueOrDefault(), new CultureInfo("es-EC"));

                // Agrupamos citas por mes de reserva.
                var detalles = await _dbContext.DetalleCita
                    .Include(d => d.Cita)
                    .Where(d => d.FechaReserva != null && d.Cita.Estado == "Confirmada")
                    .ToListAsync();

                var agrupado = detalles
                    .GroupBy(d => d.FechaReserva.Value.Month)
                    .OrderBy(g => g.Key)
                    .Select(g => new CitasPorMesDTO
                    {
                        Mes = char.ToUpper(g.First().FechaReserva.Value.ToString("MMMM", new CultureInfo("es-ES"))[0]) 
                              + g.First().FechaReserva.Value.ToString("MMMM", new CultureInfo("es-ES")).Substring(1),
                        Cantidad = g.Count()
                    })
                    .ToList();

                dto.GraficoCitas = agrupado;

                rsp.estado = true;
                rsp.valor = dto;
            }
            catch (Exception ex)
            {
                rsp.estado = false;
                rsp.mensaje = ex.Message;
            }
            return Ok(rsp);
        }
    }
}
