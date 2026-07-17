using SistemaOdontologico.Models;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SistemaOdontologico.Repositorios.Contratos;
using SistemaOdontologico.Repositorios.Interfaces;
using SistemaOdontologico.Repositorios.Implementacion;
using SistemaOdontologico.Utilidades;
using SistemaOdontologico.Repositorios;
using SistemaOdontologico.Repositorios.Implemetacion;
//using SistemaOdontologico.Utilidades;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<SistemaOdontologicoDbContext>(options =>
{
  options.UseSqlServer(builder.Configuration.GetConnectionString("sqlConection"));
});

// Registro y configuración de los servicios de autenticación JWT
builder.Services.AddAuthentication(opciones =>
{
  opciones.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  opciones.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opciones =>
{
  opciones.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
  };
});
builder.Services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddCors(options => {
  options.AddPolicy("NuevaPolitica", app =>
  {

    app.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod();

  });



}



  );
builder.Services.AddScoped<ICitaRepositorycs, SistemaOdontologico.Repositorios.GenericCitaRepository>();

builder.Services.AddAutoMapper(typeof(AutoMapperPerfil));
builder.Services.AddScoped<IRolRepository, RolRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IPacienteRepository, PacienteRepository>();
builder.Services.AddScoped<IOdontologoRepository, OdontologoRepository>();
builder.Services.AddScoped<IServicioRepository, ServicioRepository>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<ICitaRepository, SistemaOdontologico.Repositorios.Implemetacion.CitaRepository>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Inicializar base de datos y sembrar datos
SistemaOdontologico.Utilidades.DbInitializer.Initialize(app);


app.UseCors("NuevaPolitica");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");



app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(



  );

app.Run();


