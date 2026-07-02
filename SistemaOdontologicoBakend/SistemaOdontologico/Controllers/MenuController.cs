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
  public class MenuController : ControllerBase
  {
    private readonly IMenuRepository _menuServicio;
    public MenuController(IMenuRepository menuServicio)
    {
      _menuServicio = menuServicio;
    }

    [HttpGet]
    [Route("Lista")]
    public async Task<IActionResult> Lista(int idUsuario)
    {
      var rsp = new Response<List<MenuDTO>>();
      try
      {
        rsp.estado = true;
        rsp.valor = await _menuServicio.listaMenus(idUsuario);
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
