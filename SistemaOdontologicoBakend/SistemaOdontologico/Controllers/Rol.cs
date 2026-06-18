using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
  public class Rol : ControllerBase
  {
    private readonly IRolRepository _rolServicios;
    public Rol(IRolRepository rolServicios) {
      _rolServicios = rolServicios;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista() {
      var rsp = new Response<List<RolDTO>>();
      try
      {
        rsp.status = true;
        rsp.value = await _rolServicios.listaRoles();
      }
      catch(Exception ex) {
        rsp.status = false;
        rsp.msg = ex.Message;
      }
      return Ok(rsp);
    }
  }
}
