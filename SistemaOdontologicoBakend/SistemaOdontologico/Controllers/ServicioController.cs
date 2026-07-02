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
  public class ServicioController : ControllerBase
  {
    private readonly IServicioRepository _servicioServicio;
    public ServicioController(IServicioRepository servicioServicio)
    {
      _servicioServicio = servicioServicio;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista()
    {
      var rsp = new Response<List<ServicioDTO>>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _servicioServicio.listaServicios();
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
      }
      return Ok(rsp);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioDTO>> GetById(int id)
    {
      try
      {
        var odontologo = await _servicioServicio.obtenerPorIdServicio(id);
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
    public async Task<IActionResult> Guardar([FromBody] ServicioDTO servicio)
    {
      var rsp = new Response<ServicioDTO>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _servicioServicio.crearServicio(servicio);
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
    public async Task<IActionResult> Editar([FromBody] ServicioDTO Usuario)
    {
      var rsp = new Response<bool>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _servicioServicio.editarServicio(Usuario);
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
        rsp.valor = await _servicioServicio.eliminarServicio(id);
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