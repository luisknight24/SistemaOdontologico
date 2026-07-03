using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SistemaOdontologico.Models;

namespace SistemaOdontologico.Utilidades
{
    public static class DbInitializer
    {
        public static void Initialize(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<SistemaOdontologicoDbContext>();
                    // Ejecuta migraciones pendientes de manera automática
                    context.Database.Migrate();

                    // 1. Sembrar Roles
                    if (!context.Rol.Any())
                    {
                        var roles = new List<Rol>
                        {
                            new Rol { Descripcion = "Administrador", FechaRegistro = DateTime.Now },
                            new Rol { Descripcion = "Odontólogo", FechaRegistro = DateTime.Now },
                            new Rol { Descripcion = "Paciente", FechaRegistro = DateTime.Now }
                        };
                        context.Rol.AddRange(roles);
                        context.SaveChanges();
                    }

                    // Obtener IDs de Roles sembrados
                    var adminRol = context.Rol.FirstOrDefault(r => r.Descripcion == "Administrador");
                    var odontologoRol = context.Rol.FirstOrDefault(r => r.Descripcion == "Odontólogo");
                    var pacienteRol = context.Rol.FirstOrDefault(r => r.Descripcion == "Paciente");

                    // 2. Sembrar Menús
                    if (!context.Menus.Any())
                    {
                        var menus = new List<Menu>
                        {
                            new Menu { Nombre = "Dashboard", Icono = "dashboard", Url = "/pages/dashboard" },
                            new Menu { Nombre = "Usuarios", Icono = "group", Url = "/pages/usuario" },
                            new Menu { Nombre = "Pacientes", Icono = "accessibility", Url = "/pages/paciente" },
                            new Menu { Nombre = "Odontólogos", Icono = "medical_services", Url = "/pages/odontologo" },
                            new Menu { Nombre = "Servicios", Icono = "star", Url = "/pages/servicio" },
                            new Menu { Nombre = "Citas", Icono = "calendar_today", Url = "/pages/cita" },
                            new Menu { Nombre = "Reportes", Icono = "assessment", Url = "/pages/reporte" }
                        };
                        context.Menus.AddRange(menus);
                        context.SaveChanges();
                    }

                    // 3. Sembrar MenuRols (Permisos)
                    if (!context.MenuRols.Any())
                    {
                        var menus = context.Menus.ToList();
                        var menuRols = new List<MenuRol>();

                        // Admin tiene acceso a todos los menús
                        if (adminRol != null)
                        {
                            foreach (var menu in menus)
                            {
                                menuRols.Add(new MenuRol { MenuId = menu.Id, RolId = adminRol.Id });
                            }
                        }

                        // Odontólogo tiene acceso a: Dashboard, Pacientes, Odontólogos, Servicios, Citas, Reportes
                        if (odontologoRol != null)
                        {
                            foreach (var menu in menus)
                            {
                                if (menu.Nombre != "Usuarios")
                                {
                                    menuRols.Add(new MenuRol { MenuId = menu.Id, RolId = odontologoRol.Id });
                                }
                            }
                        }

                        // Paciente tiene acceso a: Dashboard, Citas
                        if (pacienteRol != null)
                        {
                            foreach (var menu in menus)
                            {
                                if (menu.Nombre == "Dashboard" || menu.Nombre == "Citas")
                                {
                                    menuRols.Add(new MenuRol { MenuId = menu.Id, RolId = pacienteRol.Id });
                                }
                            }
                        }

                        context.MenuRols.AddRange(menuRols);
                        context.SaveChanges();
                    }

                    // 4. Sembrar Usuario Administrador por defecto
                    if (!context.Usuarios.Any())
                    {
                        if (adminRol != null)
                        {
                            var adminUser = new Usuario
                            {
                                NombreApellidos = "Administrador Sistema",
                                Correo = "admin@gmail.com",
                                RolId = adminRol.Id,
                                Clave = BCrypt.Net.BCrypt.HashPassword("123456"),
                                EsActivo = true,
                                FechaRegistro = DateTime.Now
                            };
                            context.Usuarios.Add(adminUser);
                            context.SaveChanges();
                        }
                    }

                    // 5. Sembrar NumeroDocumento inicial
                    if (!context.NumeroDocumentos.Any())
                    {
                        context.NumeroDocumentos.Add(new NumeroDocumento
                        {
                            UltimoNumero = 0
                        });
                        context.SaveChanges();
                    }

                    // 6. Sembrar Pacientes de prueba
                    if (!context.Pacientes.Any())
                    {
                        var pacientes = new List<Paciente>
                        {
                            new Paciente { Nombre = "María", Apellido = "Gómez", Edad = 34, Genero = "Femenino", Direccion = "Calle 1", Telefono = "12345678", Email = "maria@example.com" },
                            new Paciente { Nombre = "Pedro", Apellido = "López", Edad = 45, Genero = "Masculino", Direccion = "Calle 2", Telefono = "87654321", Email = "pedro@example.com" }
                        };
                        context.Pacientes.AddRange(pacientes);
                        context.SaveChanges();
                    }

                    // 7. Sembrar Odontólogos de prueba
                    if (!context.Odontologos.Any())
                    {
                        var odontologos = new List<Odontologo>
                        {
                            new Odontologo { Nombre = "Dr. Carlos", Apellido = "Ruiz", Experiencia = 10, Especialidad = "Ortodoncia", Edad = 40, Email = "carlos@example.com" },
                            new Odontologo { Nombre = "Dra. Ana", Apellido = "Silva", Experiencia = 5, Especialidad = "Endodoncia", Edad = 32, Email = "ana@example.com" }
                        };
                        context.Odontologos.AddRange(odontologos);
                        context.SaveChanges();
                    }

                    // 8. Sembrar Servicios de prueba
                    if (!context.Servicios.Any())
                    {
                        var servicios = new List<Servicio>
                        {
                            new Servicio { NombreServicio = "Limpieza Dental", precio = 50.00m },
                            new Servicio { NombreServicio = "Extracción", precio = 80.00m },
                            new Servicio { NombreServicio = "Blanqueamiento", precio = 150.00m }
                        };
                        context.Servicios.AddRange(servicios);
                        context.SaveChanges();
                    }

                    // 9. Sembrar Citas de prueba
                    if (!context.Citas.Any())
                    {
                        var paciente1 = context.Pacientes.First();
                        var odontologo1 = context.Odontologos.First();
                        var servicio1 = context.Servicios.First();

                        var cita = new Cita
                        {
                            NumeroDocumento = "00001",
                            Total = servicio1.precio,
                            DetalleCita = new List<DetalleCita>
                            {
                                new DetalleCita
                                {
                                    PacienteId = paciente1.Id,
                                    OdontologoId = odontologo1.Id,
                                    ServicioId = servicio1.Id,
                                    FechaReserva = DateTime.Now.AddDays(1),
                                    Precio = servicio1.precio
                                }
                            }
                        };
                        context.Citas.Add(cita);
                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    // Manejo del error
                    var logger = services.GetRequiredService<ILogger<WebApplication>>();
                    logger.LogError(ex, "Un error ocurrió durante el sembrado de la base de datos.");
                }
            }
        }
    }
}
