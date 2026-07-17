using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using System.Linq;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Models;
using SistemaOdontologico.DTO;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace SistemaOdontologico.Repositorios.Implemetacion
{
  public class UsuarioRepository : IUsuarioRepository
  {
    private readonly IGenericRepository<Usuario> _UsuarioRepositorio;
    private readonly IGenericRepository<Paciente> _pacienteRepositorio;
    private readonly IGenericRepository<Rol> _rolRepositorio;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private static Dictionary<string, (string Codigo, DateTime Expiracion)> _otpCache = new Dictionary<string, (string, DateTime)>();
    private static Dictionary<string, UsuarioDTO> _pendingRegistrations = new Dictionary<string, UsuarioDTO>();

    public UsuarioRepository(
        IGenericRepository<Usuario> usuarioRepositorio,
        IGenericRepository<Paciente> pacienteRepositorio,
        IGenericRepository<Rol> rolRepositorio,
        IMapper mapper,
        IConfiguration configuration)
    {
      _UsuarioRepositorio = usuarioRepositorio;
      _pacienteRepositorio = pacienteRepositorio;
      _rolRepositorio = rolRepositorio;
      _mapper = mapper;
      _configuration = configuration;
    }

    public async Task<List<UsuarioDTO>> listaUsuarios()
    {
      try
      {
        var queryUsuario = await _UsuarioRepositorio.Consultar();
        var listaUsuario = queryUsuario.Include(rol => rol.Rol).ToList();
        return _mapper.Map<List<UsuarioDTO>>(listaUsuario);
      }
      catch
      {

        throw;
      }
    }

    public async Task<UsuarioDTO> obtenerPorIdUsuario(int id)
    {
      try
      {
        var odontologoEncontrado = await _UsuarioRepositorio
            .Obtenerid(u => u.Id == id);
        var listaUsuario = odontologoEncontrado.Include(rol => rol.Rol).ToList();
        var odontologo = listaUsuario.FirstOrDefault();
        if (odontologo == null)
          throw new TaskCanceledException("Usuario no encontrado");
        return _mapper.Map<UsuarioDTO>(odontologo);
      }
      catch
      {
        throw;
      }
    }
    
    private string GenerarTokenJwt(Usuario usuario)
    {
      var manejadorToken = new JwtSecurityTokenHandler();
      var clave = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

      var descriptorToken = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
        {
          new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
          new Claim(ClaimTypes.Email, usuario.Correo ?? string.Empty),
          new Claim(ClaimTypes.Role, usuario.Rol?.Descripcion ?? "Paciente")
        }),
        Expires = DateTime.UtcNow.AddDays(1),
        Issuer = _configuration["Jwt:Issuer"],
        Audience = _configuration["Jwt:Audience"],
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(clave), SecurityAlgorithms.HmacSha256Signature)
      };

      var token = manejadorToken.CreateToken(descriptorToken);
      return manejadorToken.WriteToken(token);
    }

    public async Task<SesionDTO> ValidarCredenciales(string correo, string clave)
    {
      try
      {  
        var queryUsuario = await _UsuarioRepositorio.Consultar(
          u => u.Correo == correo
        );
        if (queryUsuario.FirstOrDefault() == null)
          throw new TaskCanceledException("El usuario no existe");
        Usuario devolverUsuario = queryUsuario.Include(rol => rol.Rol).First();
        if (devolverUsuario.EsActivo == false)
          throw new TaskCanceledException("El usuario está inactivo");
        if (!BCrypt.Net.BCrypt.Verify(clave, devolverUsuario.Clave))
          throw new TaskCanceledException("La contraseña es incorrecta");
        
        var sesion = _mapper.Map<SesionDTO>(devolverUsuario);
        // Se genera el token firmado con los datos del usuario para el control de accesos
        sesion.Token = GenerarTokenJwt(devolverUsuario);
        return sesion;
      }
      catch
      {
        throw;
      }
    }

    public async Task<UsuarioDTO> crearUsuario(UsuarioDTO modelo)
    {
      try
      {
        var existingUser = await _UsuarioRepositorio.Consultar(u => u.Correo == modelo.Correo);
        if (existingUser.FirstOrDefault() != null)
          throw new TaskCanceledException("El correo ya está registrado");

        // Se aplica hash seguro a la contraseña antes de persistir el registro
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(modelo.Clave);
        modelo.Clave = hashedPassword;

        var UsuarioCreado = await _UsuarioRepositorio.Crear(_mapper.Map<Usuario>(modelo));

        if (UsuarioCreado.Id == 0)
          throw new TaskCanceledException("No se pudo Crear");

        await AutoCrearPacienteClase(UsuarioCreado);

        var query = await _UsuarioRepositorio.Consultar(u => u.Id == UsuarioCreado.Id);
        UsuarioCreado = query.Include(rol => rol.Rol).First();
        return _mapper.Map<UsuarioDTO>(UsuarioCreado);
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> editarUsuario(UsuarioDTO modelo)
    {
      try
      {
        var existingUserQuery = await _UsuarioRepositorio.Consultar(u => u.Correo == modelo.Correo && u.Id != modelo.Id);
        if (existingUserQuery.FirstOrDefault() != null)
          throw new TaskCanceledException("El correo ya está registrado por otro usuario");

        // Se aplica hash seguro a la contraseña antes de persistir el registro
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(modelo.Clave);
        modelo.Clave = hashedPassword;

        var UsuarioModelo = _mapper.Map<Usuario>(modelo);

        var UsuarioEncontrado = await _UsuarioRepositorio.Obtener(u => u.Id == UsuarioModelo.Id);
        if (UsuarioEncontrado == null)
          throw new TaskCanceledException("El usuario no existe");
        UsuarioEncontrado.NombreApellidos = UsuarioModelo.NombreApellidos;
        UsuarioEncontrado.Correo = UsuarioModelo.Correo;
        UsuarioEncontrado.RolId = UsuarioModelo.RolId;
        UsuarioEncontrado.Clave = UsuarioModelo.Clave;
        UsuarioEncontrado.EsActivo = UsuarioModelo.EsActivo;
        bool respuesta = await _UsuarioRepositorio.Editar(UsuarioEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }

    public async Task<bool> eliminarUsuario(int id)
    {
      try
      {
        var UsuarioEncontrado = await _UsuarioRepositorio.Obtener(u => u.Id == id);
        if (UsuarioEncontrado == null)
          throw new TaskCanceledException("Usuario no existe");
        bool respuesta = await _UsuarioRepositorio.Eliminar(UsuarioEncontrado);
        return respuesta;
      }
      catch
      {
        throw;
      }
    }

    public async Task<string> RegistroPendiente(UsuarioDTO modelo)
    {
        try
        {
            var existingUser = await _UsuarioRepositorio.Consultar(u => u.Correo == modelo.Correo);
            if (existingUser.FirstOrDefault() != null)
                throw new TaskCanceledException("El correo ya está registrado");

            // Registro temporal en caché para completar la validación OTP
            _pendingRegistrations[modelo.Correo] = modelo;

            return await GenerarOTP(modelo.Correo);
        }
        catch
        {
            throw;
        }
    }

    public async Task<string> GenerarOTP(string correo)
    {
        var random = new Random();
        var otp = random.Next(100000, 999999).ToString();
        _otpCache[correo] = (otp, DateTime.Now.AddMinutes(10));
        
        // Se intenta enviar el correo real mediante SMTP
        try
        {
            var servidorSmtp = _configuration["EmailSettings:Server"];
            var puertoSmtp = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
            var correoRemitente = _configuration["EmailSettings:SenderEmail"];
            var contrasenaSmtp = _configuration["EmailSettings:Password"];

            if (!string.IsNullOrEmpty(servidorSmtp) && !string.IsNullOrEmpty(correoRemitente) && !string.IsNullOrEmpty(contrasenaSmtp))
            {
                using (var clienteMail = new System.Net.Mail.SmtpClient(servidorSmtp, puertoSmtp))
                {
                    clienteMail.Credentials = new System.Net.NetworkCredential(correoRemitente, contrasenaSmtp);
                    clienteMail.EnableSsl = true;

                    using (var mensaje = new System.Net.Mail.MailMessage())
                    {
                        mensaje.From = new System.Net.Mail.MailAddress(correoRemitente, "DentAgend Clínicas");
                        mensaje.To.Add(new System.Net.Mail.MailAddress(correo));
                        mensaje.Subject = "Código de verificación - DentAgend";
                        mensaje.IsBodyHtml = true;
                        
                        mensaje.Body = $@"
                            <div style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee;'>
                                <h2 style='color: #d97706;'>Código de validación de DentAgend</h2>
                                <p>Estimado usuario,</p>
                                <p>Se ha solicitado un código de verificación para registrar su cuenta en el sistema de reservaciones odontológicas.</p>
                                <div style='background-color: #fef3c7; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;'>
                                    <span style='font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #b45309;'>{otp}</span>
                                </div>
                                <p>Este código expira en 10 minutos por razones de seguridad.</p>
                                <hr style='border: 0; border-top: 1px solid #eee; margin-top: 30px;' />
                                <p style='font-size: 12px; color: #999;'>Este mensaje fue generado automáticamente. Por favor no responda a este correo.</p>
                            </div>";

                        await clienteMail.SendMailAsync(mensaje);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al enviar correo electrónico: {ex.Message}");
        }

        // Simulación en consola como respaldo y depuración local
        Console.WriteLine($"\n========================================");
        Console.WriteLine($"MOCK EMAIL SENT TO: {correo}");
        Console.WriteLine($"YOUR OTP CODE IS: {otp}");
        Console.WriteLine($"========================================\n");
        
        return otp;
    }

    public async Task<UsuarioDTO> ValidarOTP(string correo, string otp)
    {
        if (_otpCache.TryGetValue(correo, out var cache))
        {
            if (cache.Codigo == otp && cache.Expiracion > DateTime.Now)
            {
                _otpCache.Remove(correo);

                // Si es un registro pendiente, crear el usuario ahora
                if (_pendingRegistrations.TryGetValue(correo, out var pendingUser))
                {
                    _pendingRegistrations.Remove(correo);

                    // Se aplica hash seguro a la contraseña antes de persistir el registro
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(pendingUser.Clave);
                    pendingUser.Clave = hashedPassword;
                    pendingUser.EsActivo = 1;

                    // Si el correo es el del administrador de pruebas, forzar rol Administrador (1)
                    if (correo.Equals("luisknight24@gmail.com", StringComparison.OrdinalIgnoreCase))
                    {
                        pendingUser.RolId = 1;
                    }

                    var UsuarioCreado = await _UsuarioRepositorio.Crear(_mapper.Map<Usuario>(pendingUser));

                    if (UsuarioCreado.Id == 0)
                        throw new TaskCanceledException("No se pudo Crear el usuario tras validar OTP");

                    await AutoCrearPacienteClase(UsuarioCreado);

                    var query = await _UsuarioRepositorio.Consultar(u => u.Id == UsuarioCreado.Id);
                    UsuarioCreado = query.Include(rol => rol.Rol).First();
                    return _mapper.Map<UsuarioDTO>(UsuarioCreado);
                }
                else
                {
                    var queryUsuario = await _UsuarioRepositorio.Consultar(u => u.Correo == correo);
                    var usuario = queryUsuario.FirstOrDefault();
                    if (usuario != null)
                    {
                        usuario.EsActivo = true;
                        await _UsuarioRepositorio.Editar(usuario);
                        var query = await _UsuarioRepositorio.Consultar(u => u.Id == usuario.Id);
                        usuario = query.Include(rol => rol.Rol).First();
                        return _mapper.Map<UsuarioDTO>(usuario);
                    }
                }
            }
        }
        return null;
    }

    private async Task AutoCrearPacienteClase(Usuario usuarioCreado)
    {
        try
        {
            var rolesQuery = await _rolRepositorio.Consultar(r => r.Id == usuarioCreado.RolId);
            var rol = rolesQuery.FirstOrDefault();
            if (rol != null && rol.Descripcion == "Paciente")
            {
                var pacientesQuery = await _pacienteRepositorio.Consultar(p => p.Email == usuarioCreado.Correo);
                var pacienteExistente = pacientesQuery.FirstOrDefault();
                if (pacienteExistente == null)
                {
                    var nombres = usuarioCreado.NombreApellidos.Split(' ');
                    var nombre = nombres.Length > 0 ? nombres[0] : "Paciente";
                    var apellido = nombres.Length > 1 ? string.Join(' ', nombres.Skip(1)) : "Registrado";

                    var nuevoPaciente = new Paciente
                    {
                        Nombre = nombre,
                        Apellido = apellido,
                        Email = usuarioCreado.Correo,
                        Edad = 0,
                        Genero = "No especificado",
                        Direccion = "No especificada",
                        Telefono = "No especificado"
                    };
                    await _pacienteRepositorio.Crear(nuevoPaciente);
                }
            }
        }
        catch
        {
            // Se omiten excepciones secundarias para no interrumpir el flujo principal de registro
        }
    }
  }
}