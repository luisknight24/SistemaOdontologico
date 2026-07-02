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
