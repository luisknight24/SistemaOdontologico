# Sistema de Administración de Reservaciones Odontológicas

Este repositorio contiene el código fuente para un sistema completo de gestión de citas y pacientes de una clínica odontológica. El proyecto incluye tanto el backend (API RESTful) como el frontend (aplicación web SPA), proporcionando un flujo de trabajo integral para administradores, odontólogos y pacientes.

## Características principales

- **Gestión de citas:** Programación, seguimiento y cancelación de citas médicas.
- **Autenticación y roles:** Sistema seguro basado en roles (Administrador, Odontólogo, Paciente).
- **Gestión de usuarios:** Registro de pacientes y creación automatizada de credenciales para odontólogos.
- **Reportes:** Generación de reportes en formato PDF para análisis de datos clínicos y métricas de negocio.
- **Validación OTP:** Sistema de contraseñas de un solo uso (One-Time Password) para confirmación de identidades.
- **Dashboard interactivo:** Visualización de estadísticas y resúmenes mediante gráficos dinámicos.

## Tecnologías utilizadas

### Frontend
- **Framework:** Angular 15
- **UI/UX:** Angular Material, Bootstrap 5
- **Visualización:** Chart.js
- **Generación de documentos:** pdfmake
- **Alertas:** SweetAlert2

### Backend
- **Framework:** ASP.NET Core 6.0 (API REST)
- **Base de datos:** SQL Server con Entity Framework Core 6.0
- **Seguridad:** BCrypt.Net para hashing de contraseñas
- **Mapeo de objetos:** AutoMapper
- **Documentación de API:** Swagger (Swashbuckle)

## Requisitos previos

> [!NOTE]
> Asegúrate de tener instalado el software necesario antes de comenzar la configuración.

- [Node.js](https://nodejs.org/) (versión compatible con Angular 15, preferentemente 16.x o 18.x).
- [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0).
- [SQL Server](https://www.microsoft.com/es-es/sql-server/sql-server-downloads) (o SQL Express).
- Angular CLI instalado de manera global (`npm install -g @angular/cli@15`).

## Instalación y configuración

### 1. Configuración de la base de datos

1. Asegúrate de que el motor de base de datos SQL Server esté en ejecución.
2. Navega al archivo `appsettings.json` en `SistemaOdontologicoBakend/SistemaOdontologico/` y ajusta la cadena de conexión (`ConnectionStrings`) para apuntar a tu instancia local de SQL Server.

```json
"ConnectionStrings": {
  "cadenaSQL": "Server=TU_SERVIDOR;Database=SistemaOdontologicoDB;Trusted_Connection=True;"
}
```

> [!TIP]
> El sistema incluye un inicializador de base de datos (`DbInitializer`) que creará las tablas, los roles y el usuario administrador automáticamente durante el primer arranque.

### 2. Ejecución del backend

Abre una terminal, navega a la carpeta del backend y ejecuta la API:

```powershell
cd SistemaOdontologicoBakend\SistemaOdontologico
dotnet restore
dotnet build
dotnet run
```

> [!IMPORTANT]
> Swagger estará disponible en `/swagger` (usualmente en `https://localhost:7196/swagger`). Revisa tu consola para confirmar el puerto exacto.

### 3. Ejecución del frontend

Abre otra terminal, navega a la carpeta del frontend, instala las dependencias y levanta el servidor de desarrollo de Angular:

```bash
cd SistemaOdontologicoFrontend
npm install
ng serve --open
```

El navegador se abrirá automáticamente en `http://localhost:4200/`.

## Estructura del proyecto

- `SistemaOdontologicoBakend/`: Contiene la solución en C# de ASP.NET Core. Incluye controladores, interfaces de repositorio, modelos de Entity Framework Core, DTOs y utilidades de configuración (AutoMapper, inicializadores de datos).
- `SistemaOdontologicoFrontend/`: Contiene la aplicación Angular, organizada lógicamente por componentes de páginas (citas, usuarios, dashboard, reportes), servicios HTTP para la comunicación con la API, modales de interacción y utilidades globales.

## Licencia y autores

Desarrollado para gestionar operaciones de clínicas dentales de forma escalable y eficiente. Todos los derechos reservados.
