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
  public class OdontologoController : ControllerBase
  {
    private readonly IOdontologoRepository _OdontologoServicios;

    public OdontologoController(IOdontologoRepository odontologoServicios)
    {
      _OdontologoServicios = odontologoServicios;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista()
    {
      var rsp = new Response<List<OdontologoDTO>>();
      try
      {
        rsp.status = true;
        rsp.value = await _OdontologoServicios.listaOdontontologos();
      }
      catch (Exception ex)
      {
        rsp.status = false;
        rsp.msg = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpPost]
    [Route("Guardar")]
    public async Task<IActionResult> Guardar([FromBody] OdontologoDTO odontologo)
    {
      var rsp = new Response<OdontologoDTO>();
      try
      {
        rsp.status = true;
        rsp.value = await _OdontologoServicios.crearOdontontologo(odontologo);
      }
      catch (Exception ex)
      {
        rsp.status = false;
        rsp.msg = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpPut]
    [Route("Editar")]
    public async Task<IActionResult> Editar([FromBody] OdontologoDTO odontologo)
    {
      var rsp = new Response<bool>();
      try
      {
        rsp.status = true;
        rsp.value = await _OdontologoServicios.editarOdontontologo(odontologo);
      }
      catch (Exception ex)
      {
        rsp.status = false;
        rsp.msg = ex.Message;
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
        rsp.status = true;
        rsp.value = await _OdontologoServicios.eliminarOdontontologo(id);
      }
      catch (Exception ex)
      {
        rsp.status = false;
        rsp.msg = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OdontologoDTO>> GetById(int id)
    {
      try
      {
        var odontologo = await _OdontologoServicios.obtenerPorIdOdontontologo(id);
        if (odontologo == null)
          return NotFound();
        return Ok(odontologo);
      }
      catch
      {
        return StatusCode(500, "Error al obtener el Odontólogo por ID");
      }
    }
  }
}