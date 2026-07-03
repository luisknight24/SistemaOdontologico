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
    private readonly IUsuarioRepository _UsuarioRepositorio;

    public OdontologoController(IOdontologoRepository odontologoServicios, IUsuarioRepository usuarioRepositorio)
    {
      _OdontologoServicios = odontologoServicios;
      _UsuarioRepositorio = usuarioRepositorio;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista()
    {
      var rsp = new Response<List<OdontologoDTO>>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _OdontologoServicios.listaOdontontologos();
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
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
        rsp.estado = true;
        rsp.valor = await _OdontologoServicios.crearOdontontologo(odontologo);

        if (rsp.valor != null)
        {
          try
          {
            var nuevoUsuario = new UsuarioDTO
            {
              NombreApellidos = $"{odontologo.Nombre} {odontologo.Apellido}",
              Correo = odontologo.Email,
              RolId = 2, // 2 = Odontólogo
              Clave = "Odonto2026*",
              EsActivo = 1
            };
            await _UsuarioRepositorio.crearUsuario(nuevoUsuario);
          }
          catch (Exception ex)
          {
            // Logging the error, but we don't fail the Odontologo creation
            Console.WriteLine($"Error automatizando creación de usuario para odontólogo: {ex.Message}");
          }
        }
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
    public async Task<IActionResult> Editar([FromBody] OdontologoDTO odontologo)
    {
      var rsp = new Response<bool>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _OdontologoServicios.editarOdontontologo(odontologo);
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
        rsp.valor = await _OdontologoServicios.eliminarOdontontologo(id);
      }
      catch (Exception ex)
      {
        rsp.estado = false;
        rsp.mensaje = ex.Message;
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