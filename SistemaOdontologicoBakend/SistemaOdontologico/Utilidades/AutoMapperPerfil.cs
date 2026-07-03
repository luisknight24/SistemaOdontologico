using AutoMapper;
using SistemaOdontologico.DTO;
using SistemaOdontologico.Models;
using System.Globalization;

namespace SistemaOdontologico.Utilidades
{
  public class AutoMapperPerfil : Profile
  {
    public AutoMapperPerfil()
    {
      #region Rol
      CreateMap<Rol, RolDTO>().ReverseMap();
      #endregion Rol

      #region Menu
      CreateMap<Menu, MenuDTO>().ReverseMap();
      #endregion Menu

      #region Usuario
      CreateMap<Usuario, UsuarioDTO>()
          .ForMember(destino =>
              destino.RolDescripcion,
              opt => opt.MapFrom(origen => origen.Rol.Descripcion)
          )

          .ForMember(destino =>
          destino.EsActivo,
          opt => opt.MapFrom(origen => origen.EsActivo == true ? 1 : 0)
      );


      CreateMap<Usuario, SesionDTO>()
          .ForMember(destino =>
              destino.RolDescripcion,
              opt => opt.MapFrom(origen => origen.Rol.Descripcion)
          );

      CreateMap<UsuarioDTO, Usuario>()

           .ForMember(destino =>
              destino.Rol,
              opt => opt.Ignore()
             )
           .ForMember(destino =>
              destino.EsActivo,
              opt => opt.MapFrom(origen => origen.EsActivo == 1 ? true : false)
             );

      #endregion Usuario

      #region Paciente
      CreateMap<PacienteDTO, Paciente>();
      CreateMap<Paciente, PacienteDTO>();
      #endregion Paciente

      #region Servicio

      CreateMap<Servicio, ServicioDTO>()
           .ForMember(destino =>
                destino.precio,
                opt => opt.MapFrom(origen => Convert.ToString(origen.precio.Value, new CultureInfo("es-EC")))
            );
      CreateMap<ServicioDTO, Servicio>()
            .ForMember(destiono =>
                destiono.precio,
                opt => opt.MapFrom(origen => Convert.ToDecimal(origen.precio))
            );

      #endregion Servicio

      #region Odontologo
      CreateMap<Odontologo, OdontologoDTO>();
      CreateMap<OdontologoDTO, Odontologo>();
      #endregion Odontologo

      #region Cita
      CreateMap<CitaDTO, Cita>()       
           .ForMember(destino =>
                    destino.Total,
                    opt => opt.MapFrom(origen => Convert.ToDecimal(origen.TotalTexto))
                );
      CreateMap<Cita, CitaDTO>()       
          .ForMember(dest => dest.TotalTexto, opt => opt.MapFrom(src => src.Total.ToString()));
      #endregion Cita
    
      #region DetalleCita
      CreateMap<DetalleCita, DetalleCitaDTO>()
          .ForMember(destino => destino.DescripcionPaciente, opt => opt.MapFrom(origen =>  origen.Paciente.Apellido +" " + origen.Paciente.Nombre))
          .ForMember(destino => destino.DescripcionOdontologo, opt => opt.MapFrom(origen => origen.Odontologo.Nombre + " " + origen.Odontologo.Apellido))
          .ForMember(destino => destino.DescripcionServicio, opt => opt.MapFrom(origen => origen.Servicio.NombreServicio))
          .ForMember(destino =>
            destino.PrecioTexto,
            opt => opt.MapFrom(origen => Convert.ToString(origen.Precio.Value, new CultureInfo("es-EC")))
      )
          .ForMember(destino =>
            destino.FechaReserva,
            opt => opt.MapFrom(origen => origen.FechaReserva.Value.ToString("dd/MM/yyyy"))
        );
      CreateMap<DetalleCitaDTO, DetalleCita>()
          .ForMember(destino => destino.Paciente, opt => opt.Ignore())
          .ForMember(destino => destino.Odontologo, opt => opt.Ignore())
          .ForMember(destino => destino.Servicio, opt => opt.Ignore()) 
          .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Decimal.Parse(origen.PrecioTexto)))
          .ForMember(destino => destino.FechaReserva, opt => opt.MapFrom(origen => DateTime.ParseExact(origen.FechaReserva, "dd/MM/yyyy", CultureInfo.InvariantCulture)));
      #endregion DetalleCita

      #region Reporte
      CreateMap<DetalleCita, ReporteDTO>()
         .ForMember(destino =>
                    destino.NumeroDocumento,
                    opt => opt.MapFrom(origen => origen.Cita.NumeroDocumento)
                )
          .ForMember(destino =>
              destino.fechaReserva,
            opt => opt.MapFrom(origen => origen.FechaReserva.Value.ToString("dd/MM/yyyy"))
           )
        .ForMember(destino => destino.odontologo, opt => opt.MapFrom(origen => origen.Odontologo.Apellido + " " + origen.Odontologo.Nombre))
        .ForMember(destino => destino.paciente, opt => opt.MapFrom(origen => origen.Paciente.Apellido + " " + origen.Paciente.Nombre))
        .ForMember(destino => destino.servicio, opt => opt.MapFrom(origen => origen.Servicio.NombreServicio))
        .ForMember(destino =>
                    destino.precio,
                  opt => opt.MapFrom(origen => Convert.ToString(origen.Precio.Value, new CultureInfo("es-PE")))
            );
      #endregion Reporte 
    }
  }
}
