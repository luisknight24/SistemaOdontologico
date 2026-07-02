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
  public class PacienteController : ControllerBase
  {
    private readonly IPacienteRepository _PacienteServicios;
    public PacienteController(IPacienteRepository pacienteServicios)
    {
      _PacienteServicios = pacienteServicios;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista()
    {
      var rsp = new Response<List<PacienteDTO>>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _PacienteServicios.listaPacientes();
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteDTO>> ObtenerPorId(int id)
    {
      try
      {
        var odontologo = await _PacienteServicios.obtenerPorIdPaciente(id);
        if (odontologo == null)
          return NotFound();
        return Ok(odontologo);
      }
      catch
      {
        return StatusCode(500, "Error al obtener el Odontólogo por ID");
      }
    }

    [HttpPost]
    [Route("Guardar")]
    public async Task<IActionResult> Guardar([FromBody] PacienteDTO paciente)
    {
     var rsp = new Response<PacienteDTO>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _PacienteServicios.crearPaciente(paciente);
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
    public async Task<IActionResult> Editar([FromBody] PacienteDTO paciente)
    {
     var rsp = new Response<bool>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _PacienteServicios.editarPaciente(paciente);
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
        rsp.valor = await _PacienteServicios.eliminarPaciente(id);
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