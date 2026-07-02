using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.DTO;
using SistemaOdontologico.Utilidades;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios.Implementacion;
using AutoMapper;

namespace SistemaOdontologico.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CitaController : ControllerBase
  {
    private readonly ICitaRepository _citaServicio;

    public CitaController(ICitaRepository citaServicio)
    {
      _citaServicio = citaServicio;
    }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            var rsp = new Response<List<CitaDTO>>();
            try
            {
                rsp.estado = true;
                rsp.valor = await _citaServicio.listaCitas();
            }
            catch (Exception ex)
            {
                rsp.estado = false;
                rsp.mensaje = ex.Message;
            }
            return Ok(rsp);
        }
        [HttpGet]
        [Route("Reporte")]
        public async Task<IActionResult> Reporte(string? fechaInicio, string? fechaFin)
        {
            var rsp = new Response<List<ReporteDTO>>();
            try
            {
                rsp.estado = true;
                rsp.valor = await _citaServicio.ReporteCita(fechaInicio, fechaFin);
            }
            catch (Exception ex)
            {
                rsp.estado = false;
                rsp.mensaje = ex.Message;
            }
            return Ok(rsp);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReporteDTO>> ObtenerPorId(int id)
        {
            try
            {
                var odontologo = await _citaServicio.obtenerPorIdCita(id);
                if (odontologo == null)
                    return NotFound();
                return Ok(odontologo);
            }
            catch
            {
                return StatusCode(500, "Error al obtener el Odontólogo por ID");
            }
        }

        [HttpGet]
        [Route("Reporte2")]
        public async Task<IActionResult> Reporte2SinFiltro()
        {
            var rsp = new Response<List<ReporteDTO>>();
            try
            {
                rsp.estado = true;
                rsp.valor = await _citaServicio.Reporte2();
            }
            catch (Exception ex)
            {
                rsp.estado = false;
                rsp.mensaje = ex.Message;
            }
            return Ok(rsp);
        }

    [HttpPost]
    [Route("Registrar")]
    public async Task<IActionResult> Registrar([FromBody] CitaDTO cita)
    {
      var rsp = new Response<CitaDTO>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _citaServicio.registrarCita(cita);
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpDelete]
    [Route("Eliminar/{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
      var rsp = new Response<bool>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _citaServicio.eliminarCita(id);
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpPut]
    [Route("Editar")]
    public async Task<IActionResult> Editar([FromBody] CitaDTO cita)
    {
      var rsp = new Response<bool>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _citaServicio.editarCita(cita);
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
