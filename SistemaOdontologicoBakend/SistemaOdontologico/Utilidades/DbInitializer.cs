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

                    // Asegurar que la columna Estado existe en la tabla Citas
                    context.Database.ExecuteSqlRaw(@"
                        IF NOT EXISTS (
                            SELECT * FROM sys.columns 
                            WHERE object_id = OBJECT_ID(N'[Citas]') 
                            AND name = N'Estado'
                        )
                        BEGIN
                            ALTER TABLE [Citas] ADD [Estado] nvarchar(max) NULL;
                        END
                    ");

                    // 1. Limpieza de usuarios de prueba solicitados
                    var correosABorrar = new List<string> { "luisknight1411@gmail.com", "luisballa1111@gmail.com" };
                    var usuariosABorrar = context.Usuarios.Where(u => correosABorrar.Contains(u.Correo)).ToList();
                    if (usuariosABorrar.Any())
                    {
                        context.Usuarios.RemoveRange(usuariosABorrar);
                    }
                    var pacientesABorrar = context.Pacientes.Where(p => correosABorrar.Contains(p.Email)).ToList();
                    if (pacientesABorrar.Any())
                    {
                        context.Pacientes.RemoveRange(pacientesABorrar);
                    }
                    context.SaveChanges();

                    // 2. Sembrar Roles
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
                    if (adminRol != null)
                    {
                        var cambios = false;
                        
                        // Configuración para admin@gmail.com
                        var adminUser = context.Usuarios.FirstOrDefault(u => u.Correo == "admin@gmail.com");
                        if (adminUser == null)
                        {
                            adminUser = new Usuario
                            {
                                NombreApellidos = "Administrador Sistema",
                                Correo = "admin@gmail.com",
                                RolId = adminRol.Id,
                                Clave = BCrypt.Net.BCrypt.HashPassword("123456"),
                                EsActivo = true,
                                FechaRegistro = DateTime.Now
                            };
                            context.Usuarios.Add(adminUser);
                            cambios = true;
                        }
                        else
                        {
                            adminUser.Clave = BCrypt.Net.BCrypt.HashPassword("123456");
                            adminUser.EsActivo = true;
                            adminUser.RolId = adminRol.Id;
                            context.Usuarios.Update(adminUser);
                            cambios = true;
                        }

                        // Configuración para luisknight24@gmail.com
                        var adminLuis = context.Usuarios.FirstOrDefault(u => u.Correo == "luisknight24@gmail.com");
                        if (adminLuis == null)
                        {
                            adminLuis = new Usuario
                            {
                                NombreApellidos = "Luis Knight Administrador",
                                Correo = "luisknight24@gmail.com",
                                RolId = adminRol.Id,
                                Clave = BCrypt.Net.BCrypt.HashPassword("123456"),
                                EsActivo = true,
                                FechaRegistro = DateTime.Now
                            };
                            context.Usuarios.Add(adminLuis);
                            cambios = true;
                        }
                        else
                        {
                            adminLuis.Clave = BCrypt.Net.BCrypt.HashPassword("123456");
                            adminLuis.EsActivo = true;
                            adminLuis.RolId = adminRol.Id;
                            context.Usuarios.Update(adminLuis);
                            cambios = true;
                        }

                        if (cambios)
                        {
                            context.SaveChanges();
                        }
                    }

                    // Verificación e Inyección de datos reales solicitados
                    // Pacientes: 47, Odontólogos: 19, Citas totales: 73
                    if (context.Pacientes.Count() != 47 || context.Odontologos.Count() != 19 || context.Citas.Count() != 73)
                    {
                        // Limpiar tablas para evitar duplicados y conflictos
                        context.DetalleCita.RemoveRange(context.DetalleCita);
                        context.Citas.RemoveRange(context.Citas);
                        context.Pacientes.RemoveRange(context.Pacientes);
                        context.Odontologos.RemoveRange(context.Odontologos);
                        context.Servicios.RemoveRange(context.Servicios);
                        context.SaveChanges();

                        // 5. Sembrar 12 Servicios reales
                        var servicios = new List<Servicio>
                        {
                            new Servicio { NombreServicio = "Consulta Diagnóstica", precio = 40.00m },
                            new Servicio { NombreServicio = "Profilaxis Dental", precio = 80.00m },
                            new Servicio { NombreServicio = "Resina Simple", precio = 120.00m },
                            new Servicio { NombreServicio = "Resina Compuesta", precio = 180.00m },
                            new Servicio { NombreServicio = "Extracción Simple", precio = 150.00m },
                            new Servicio { NombreServicio = "Extracción de Tercera Molar", precio = 350.00m },
                            new Servicio { NombreServicio = "Endodoncia Unirradicular", precio = 400.00m },
                            new Servicio { NombreServicio = "Endodoncia Multirradicular", precio = 600.00m },
                            new Servicio { NombreServicio = "Blanqueamiento LED", precio = 300.00m },
                            new Servicio { NombreServicio = "Corona Metal Cerámica", precio = 750.00m },
                            new Servicio { NombreServicio = "Corona Libre de Metal (Zirconio)", precio = 1100.00m },
                            new Servicio { NombreServicio = "Instalación de Brackets Metálicos", precio = 1500.00m }
                        };
                        context.Servicios.AddRange(servicios);
                        context.SaveChanges();

                        // 6. Sembrar exactamente 47 Pacientes reales
                        var pacientes = new List<Paciente>
                        {
                            new Paciente { Nombre = "Juan", Apellido = "Pérez", Edad = 34, Genero = "Masculino", Direccion = "Av. Larco 456, Miraflores", Telefono = "987654321", Email = "juan.perez@example.com" },
                            new Paciente { Nombre = "María", Apellido = "Gómez", Edad = 28, Genero = "Femenino", Direccion = "Jr. Junín 123, Centro de Lima", Telefono = "912345678", Email = "maria.gomez@example.com" },
                            new Paciente { Nombre = "Pedro", Apellido = "López", Edad = 45, Genero = "Masculino", Direccion = "Av. Arequipa 1420, Lince", Telefono = "934567890", Email = "pedro.lopez@example.com" },
                            new Paciente { Nombre = "Sofía", Apellido = "Rodríguez", Edad = 31, Genero = "Femenino", Direccion = "Calle Los Pinos 789, San Isidro", Telefono = "923456789", Email = "sofia.rodriguez@example.com" },
                            new Paciente { Nombre = "Carlos", Apellido = "Sánchez", Edad = 50, Genero = "Masculino", Direccion = "Av. Javier Prado 2350, San Borja", Telefono = "945678901", Email = "carlos.sanchez@example.com" },
                            new Paciente { Nombre = "Ana", Apellido = "Martínez", Edad = 22, Genero = "Femenino", Direccion = "Av. Brasil 890, Jesús María", Telefono = "956789012", Email = "ana.martinez@example.com" },
                            new Paciente { Nombre = "Luis", Apellido = "García", Edad = 37, Genero = "Masculino", Direccion = "Jr. Carabaya 555, Centro de Lima", Telefono = "967890123", Email = "luis.garcia@example.com" },
                            new Paciente { Nombre = "Elena", Apellido = "Fernández", Edad = 29, Genero = "Femenino", Direccion = "Av. Reducto 302, Miraflores", Telefono = "978901234", Email = "elena.fernandez@example.com" },
                            new Paciente { Nombre = "Miguel", Apellido = "Torres", Edad = 41, Genero = "Masculino", Direccion = "Jr. Ica 245, Centro de Lima", Telefono = "989012345", Email = "miguel.torres@example.com" },
                            new Paciente { Nombre = "Lucía", Apellido = "Díaz", Edad = 25, Genero = "Femenino", Direccion = "Calle Tulipanes 124, Santiago de Surco", Telefono = "990123456", Email = "lucia.diaz@example.com" },
                            new Paciente { Nombre = "Javier", Apellido = "Ruiz", Edad = 33, Genero = "Masculino", Direccion = "Jr. Lampa 870, Centro de Lima", Telefono = "911223344", Email = "javier.ruiz@example.com" },
                            new Paciente { Nombre = "Carmen", Apellido = "Morales", Edad = 58, Genero = "Femenino", Direccion = "Av. La Marina 1500, San Miguel", Telefono = "922334455", Email = "carmen.morales@example.com" },
                            new Paciente { Nombre = "Diego", Apellido = "Castro", Edad = 19, Genero = "Masculino", Direccion = "Av. Universitaria 3200, San Miguel", Telefono = "933445566", Email = "diego.castro@example.com" },
                            new Paciente { Nombre = "Isabel", Apellido = "Ortiz", Edad = 62, Genero = "Femenino", Direccion = "Jr. Cusco 410, Centro de Lima", Telefono = "944556677", Email = "isabel.ortiz@example.com" },
                            new Paciente { Nombre = "Alejandro", Apellido = "Ramos", Edad = 27, Genero = "Masculino", Direccion = "Av. Salaverry 2400, San Isidro", Telefono = "955667788", Email = "alejandro.ramos@example.com" },
                            new Paciente { Nombre = "Teresa", Apellido = "Flores", Edad = 48, Genero = "Femenino", Direccion = "Calle Alcanfores 360, Miraflores", Telefono = "966778899", Email = "teresa.flores@example.com" },
                            new Paciente { Nombre = "Fernando", Apellido = "Gutiérrez", Edad = 35, Genero = "Masculino", Direccion = "Jr. Huallaga 520, Centro de Lima", Telefono = "977889900", Email = "fernando.gutierrez@example.com" },
                            new Paciente { Nombre = "Patricia", Apellido = "Romero", Edad = 43, Genero = "Femenino", Direccion = "Av. Canevaro 850, Lince", Telefono = "988990011", Email = "patricia.romero@example.com" },
                            new Paciente { Nombre = "Roberto", Apellido = "Salazar", Edad = 52, Genero = "Masculino", Direccion = "Jr. Quilca 312, Centro de Lima", Telefono = "999001122", Email = "roberto.salazar@example.com" },
                            new Paciente { Nombre = "Gabriela", Apellido = "Vargas", Edad = 30, Genero = "Femenino", Direccion = "Av. Primavera 1100, Santiago de Surco", Telefono = "910111213", Email = "gabriela.vargas@example.com" },
                            new Paciente { Nombre = "Manuel", Apellido = "Castillo", Edad = 46, Genero = "Masculino", Direccion = "Jr. Azángaro 650, Centro de Lima", Telefono = "920222324", Email = "manuel.castillo@example.com" },
                            new Paciente { Nombre = "Olga", Apellido = "Peralta", Edad = 67, Genero = "Femenino", Direccion = "Av. Sucre 420, Pueblo Libre", Telefono = "930333435", Email = "olga.peralta@example.com" },
                            new Paciente { Nombre = "Ricardo", Apellido = "Mendoza", Edad = 39, Genero = "Masculino", Direccion = "Jr. Callao 150, Centro de Lima", Telefono = "940444546", Email = "ricardo.mendoza@example.com" },
                            new Paciente { Nombre = "Beatriz", Apellido = "Cabrera", Edad = 24, Genero = "Femenino", Direccion = "Av. Angamos 1200, Surquillo", Telefono = "950555657", Email = "beatriz.cabrera@example.com" },
                            new Paciente { Nombre = "Francisco", Apellido = "Soto", Edad = 61, Genero = "Masculino", Direccion = "Jr. Camaná 820, Centro de Lima", Telefono = "960666768", Email = "francisco.soto@example.com" },
                            new Paciente { Nombre = "Gloria", Apellido = "Delgado", Edad = 55, Genero = "Femenino", Direccion = "Av. Arenales 2100, Lince", Telefono = "970777879", Email = "gloria.delgado@example.com" },
                            new Paciente { Nombre = "Andrés", Apellido = "Medina", Edad = 32, Genero = "Masculino", Direccion = "Jr. Trujillo 425, Rímac", Telefono = "980888980", Email = "andres.medina@example.com" },
                            new Paciente { Nombre = "Rosa", Apellido = "Vega", Edad = 47, Genero = "Femenino", Direccion = "Jr. Chiclayo 180, Rímac", Telefono = "990999091", Email = "rosa.vega@example.com" },
                            new Paciente { Nombre = "Jose", Apellido = "Maldonado", Edad = 44, Genero = "Masculino", Direccion = "Jr. Puno 380, Centro de Lima", Telefono = "911335577", Email = "jose.maldonado@example.com" },
                            new Paciente { Nombre = "Diana", Apellido = "Rojas", Edad = 26, Genero = "Femenino", Direccion = "Calle Las Acacias 240, Miraflores", Telefono = "922446688", Email = "diana.rojas@example.com" },
                            new Paciente { Nombre = "Hugo", Apellido = "Benítez", Edad = 38, Genero = "Masculino", Direccion = "Jr. Cañete 450, Centro de Lima", Telefono = "933557799", Email = "hugo.benitez@example.com" },
                            new Paciente { Nombre = "Alicia", Apellido = "Silva", Edad = 53, Genero = "Femenino", Direccion = "Av. Bolívar 610, Pueblo Libre", Telefono = "944668800", Email = "alicia.silva@example.com" },
                            new Paciente { Nombre = "Tomás", Apellido = "Cruz", Edad = 36, Genero = "Masculino", Direccion = "Jr. Ocoña 210, Centro de Lima", Telefono = "955779911", Email = "tomas.cruz@example.com" },
                            new Paciente { Nombre = "Julia", Apellido = "Herrera", Edad = 29, Genero = "Femenino", Direccion = "Av. Benavides 2800, Santiago de Surco", Telefono = "966880022", Email = "julia.herrera@example.com" },
                            new Paciente { Nombre = "Valeria", Apellido = "Ortiz", Edad = 31, Genero = "Femenino", Direccion = "Calle El Alamo 567, La Molina", Telefono = "977991133", Email = "valeria.ortiz@example.com" },
                            new Paciente { Nombre = "Guillermo", Apellido = "Ramos", Edad = 40, Genero = "Masculino", Direccion = "Av. Tacna 350, Centro de Lima", Telefono = "988002244", Email = "guillermo.ramos@example.com" },
                            new Paciente { Nombre = "Victoria", Apellido = "Flores", Edad = 27, Genero = "Femenino", Direccion = "Calle Cantuarias 120, Miraflores", Telefono = "999113355", Email = "victoria.flores@example.com" },
                            new Paciente { Nombre = "Raúl", Apellido = "Gutiérrez", Edad = 49, Genero = "Masculino", Direccion = "Jr. Cuzco 620, Centro de Lima", Telefono = "911447700", Email = "raul.gutierrez@example.com" },
                            new Paciente { Nombre = "Natalia", Apellido = "Romero", Edad = 33, Genero = "Femenino", Direccion = "Av. Petit Thouars 1800, Lince", Telefono = "922558811", Email = "natalia.romero@example.com" },
                            new Paciente { Nombre = "Sergio", Apellido = "Salazar", Edad = 42, Genero = "Masculino", Direccion = "Jr. Carabaya 910, Centro de Lima", Telefono = "933669922", Email = "sergio.salazar@example.com" },
                            new Paciente { Nombre = "Claudia", Apellido = "Vargas", Edad = 35, Genero = "Femenino", Direccion = "Calle Grimaldo del Solar 240, Miraflores", Telefono = "944770033", Email = "claudia.vargas@example.com" },
                            new Paciente { Nombre = "Ignacio", Apellido = "Castillo", Edad = 57, Genero = "Masculino", Direccion = "Jr. Huanta 430, Centro de Lima", Telefono = "955881144", Email = "ignacio.castillo@example.com" },
                            new Paciente { Nombre = "Marcela", Apellido = "Peralta", Edad = 29, Genero = "Femenino", Direccion = "Av. La Paz 850, Miraflores", Telefono = "966992255", Email = "marcela.peralta@example.com" },
                            new Paciente { Nombre = "Fernando", Apellido = "Mendoza", Edad = 46, Genero = "Masculino", Direccion = "Jr. Junín 815, Centro de Lima", Telefono = "977003366", Email = "fernando.mendoza@example.com" },
                            new Paciente { Nombre = "Laura", Apellido = "Cabrera", Edad = 31, Genero = "Femenino", Direccion = "Calle Shell 340, Miraflores", Telefono = "988114477", Email = "laura.cabrera@example.com" },
                            new Paciente { Nombre = "Gabriel", Apellido = "Soto", Edad = 38, Genero = "Masculino", Direccion = "Jr. Ocoña 320, Centro de Lima", Telefono = "999225588", Email = "gabriel.soto@example.com" },
                            new Paciente { Nombre = "Silvia", Apellido = "Delgado", Edad = 50, Genero = "Femenino", Direccion = "Av. Arequipa 3800, San Isidro", Telefono = "911336699", Email = "silvia.delgado@example.com" }
                        };
                        context.Pacientes.AddRange(pacientes);
                        context.SaveChanges();

                        // 7. Sembrar exactamente 19 Odontólogos reales
                        var odontologos = new List<Odontologo>
                        {
                            new Odontologo { Nombre = "Carlos", Apellido = "Ruiz", Experiencia = 12, Especialidad = "Ortodoncia", Edad = 39, Email = "carlos.ruiz@dentagend.com" },
                            new Odontologo { Nombre = "Ana", Apellido = "Silva", Experiencia = 8, Especialidad = "Endodoncia", Edad = 34, Email = "ana.silva@dentagend.com" },
                            new Odontologo { Nombre = "Fernando", Apellido = "Valdez", Experiencia = 15, Especialidad = "Rehabilitación Oral", Edad = 42, Email = "fernando.valdez@dentagend.com" },
                            new Odontologo { Nombre = "Sofia", Apellido = "Castano", Experiencia = 6, Especialidad = "Odontopediatría", Edad = 31, Email = "sofia.castano@dentagend.com" },
                            new Odontologo { Nombre = "Gabriela", Apellido = "Molina", Experiencia = 5, Especialidad = "Odontología General", Edad = 30, Email = "gabriela.molina@dentagend.com" },
                            new Odontologo { Nombre = "Hector", Apellido = "Salazar", Experiencia = 10, Especialidad = "Periodoncia", Edad = 37, Email = "hector.salazar@dentagend.com" },
                            new Odontologo { Nombre = "Patricia", Apellido = "Cortes", Experiencia = 9, Especialidad = "Cirugía Bucal", Edad = 36, Email = "patricia.cortes@dentagend.com" },
                            new Odontologo { Nombre = "Emilio", Apellido = "Vargas", Experiencia = 11, Especialidad = "Ortodoncia", Edad = 38, Email = "emilio.vargas@dentagend.com" },
                            new Odontologo { Nombre = "Lucia", Apellido = "Méndez", Experiencia = 7, Especialidad = "Odontopediatría", Edad = 32, Email = "lucia.mendez@dentagend.com" },
                            new Odontologo { Nombre = "Alberto", Apellido = "Rojas", Experiencia = 14, Especialidad = "Rehabilitación Oral", Edad = 41, Email = "alberto.rojas@dentagend.com" },
                            new Odontologo { Nombre = "Elena", Apellido = "Castro", Experiencia = 6, Especialidad = "Endodoncia", Edad = 33, Email = "elena.castro@dentagend.com" },
                            new Odontologo { Nombre = "Ricardo", Apellido = "Peralta", Experiencia = 13, Especialidad = "Periodoncia", Edad = 40, Email = "ricardo.peralta@dentagend.com" },
                            new Odontologo { Nombre = "Carmen", Apellido = "Ortiz", Experiencia = 4, Especialidad = "Odontología General", Edad = 29, Email = "carmen.ortiz@dentagend.com" },
                            new Odontologo { Nombre = "Oscar", Apellido = "Medina", Experiencia = 8, Especialidad = "Cirugía Bucal", Edad = 35, Email = "oscar.medina@dentagend.com" },
                            new Odontologo { Nombre = "Beatriz", Apellido = "Delgado", Experiencia = 10, Especialidad = "Periodoncia", Edad = 36, Email = "beatriz.delgado@dentagend.com" },
                            new Odontologo { Nombre = "Manuel", Apellido = "Soto", Experiencia = 16, Especialidad = "Rehabilitación Oral", Edad = 44, Email = "manuel.soto@dentagend.com" },
                            new Odontologo { Nombre = "Diana", Apellido = "Cabrera", Experiencia = 5, Especialidad = "Odontopediatría", Edad = 30, Email = "diana.cabrera@dentagend.com" },
                            new Odontologo { Nombre = "Hugo", Apellido = "Flores", Experiencia = 9, Especialidad = "Endodoncia", Edad = 36, Email = "hugo.flores@dentagend.com" },
                            new Odontologo { Nombre = "Alicia", Apellido = "Vega", Experiencia = 6, Especialidad = "Odontología General", Edad = 31, Email = "alicia.vega@dentagend.com" }
                        };
                        context.Odontologos.AddRange(odontologos);
                        context.SaveChanges();

                        // 8. Sembrar exactamente 73 Citas con valores reales
                        var random = new Random();
                        var dbPacientes = context.Pacientes.ToList();
                        var dbOdontologos = context.Odontologos.ToList();
                        var dbServicios = context.Servicios.ToList();

                        var citas = new List<Cita>();
                        var distribucionFechas = new List<DateTime>();

                        // Distribuimos 73 citas de Febrero a Agosto del año 2023
                        // Febrero: 9, Marzo: 10, Abril: 11, Mayo: 10, Junio: 12, Julio: 11, Agosto: 10. Total = 73
                        for (int i = 0; i < 9; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 2, random.Next(1, 28), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 10; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 3, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 11; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 4, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 10; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 5, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 12; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 6, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 11; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 7, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }
                        for (int i = 0; i < 10; i++)
                        {
                            distribucionFechas.Add(new DateTime(2023, 8, random.Next(1, 29), random.Next(8, 18), 0, 0));
                        }

                        // Barajamos las fechas
                        distribucionFechas = distribucionFechas.OrderBy(x => random.Next()).ToList();

                        for (int i = 0; i < 73; i++)
                        {
                            var paciente = dbPacientes[random.Next(dbPacientes.Count)];
                            var odontologo = dbOdontologos[random.Next(dbOdontologos.Count)];
                            
                            // Seleccionar servicios
                            Servicio servicio;
                            int roll = random.Next(100);
                            if (roll < 30) // 30% Consulta Diagnóstica (S/. 40)
                                servicio = dbServicios[0];
                            else if (roll < 60) // 30% Profilaxis Dental (S/. 80)
                                servicio = dbServicios[1];
                            else if (roll < 80) // 20% Resina Simple (S/. 120)
                                servicio = dbServicios[2];
                            else if (roll < 90) // 10% Extracción Simple (S/. 150)
                                servicio = dbServicios[4];
                            else // 10% Otros servicios
                                servicio = dbServicios[random.Next(5, dbServicios.Count)];

                            var fecha = distribucionFechas[i];

                            var cita = new Cita
                            {
                                NumeroDocumento = (i + 1).ToString("D5"),
                                Total = servicio.precio,
                                Estado = "Confirmada",
                                DetalleCita = new List<DetalleCita>
                                {
                                    new DetalleCita
                                    {
                                        PacienteId = paciente.Id,
                                        OdontologoId = odontologo.Id,
                                        ServicioId = servicio.Id,
                                        FechaReserva = fecha,
                                        Precio = servicio.precio
                                    }
                                }
                            };
                            citas.Add(cita);
                        }
                        context.Citas.AddRange(citas);
                        context.SaveChanges();

                        // 9. Actualizar último número de documento
                        var ultimoDoc = context.NumeroDocumentos.FirstOrDefault();
                        if (ultimoDoc != null)
                        {
                            ultimoDoc.UltimoNumero = 73;
                            context.NumeroDocumentos.Update(ultimoDoc);
                        }
                        else
                        {
                            context.NumeroDocumentos.Add(new NumeroDocumento { UltimoNumero = 73 });
                        }
                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<WebApplication>>();
                    logger.LogError(ex, "Un error ocurrió durante el sembrado de la base de datos.");
                }
            }
        }
    }
}
