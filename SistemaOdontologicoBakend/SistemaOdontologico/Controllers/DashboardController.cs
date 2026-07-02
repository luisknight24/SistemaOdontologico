using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using SistemaOdontologico.Utilidades;
using System.Globalization;

namespace SistemaOdontologico.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
                dto.TotalCitas = await _dbContext.Citas.CountAsync();

                decimal? totalIngresos = await _dbContext.Citas.SumAsync(c => c.Total);
                dto.TotalIngresos = Convert.ToString(totalIngresos.GetValueOrDefault(), new CultureInfo("es-EC"));

                // Agrupamos citas por mes de reserva.
                var detalles = await _dbContext.DetalleCita
                    .Where(d => d.FechaReserva != null)
                    .ToListAsync();

                var agrupado = detalles
                    .GroupBy(d => d.FechaReserva.Value.ToString("MMMM", new CultureInfo("es-ES")))
                    .Select(g => new CitasPorMesDTO
                    {
                        Mes = char.ToUpper(g.Key[0]) + g.Key.Substring(1),
                        Cantidad = g.Count()
                    })
                    .Take(4)
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
