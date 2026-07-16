# DentAgend: Sistema de administración de reservaciones odontológicas

![.NET 6](https://img.shields.io/badge/.NET-6.0-512BD4?style=flat-square) ![Angular 15](https://img.shields.io/badge/Angular-15-DD0031?style=flat-square) ![SQL Server](https://img.shields.io/badge/SQL_Server-2019-CC2927?style=flat-square) ![JWT](https://img.shields.io/badge/JWT-JSON_Web_Token-000000?style=flat-square)

DentAgend es un sistema integrado para la administración de reservaciones y fichas clínicas en consultorios odontológicos. En este sentido, la plataforma proporciona un espacio de trabajo unificado donde pacientes, odontólogos y administradores interactúan en tiempo real para optimizar la asignación de citas.

El sistema se divide en un backend estructurado como una API RESTful con C# y un frontend dinámico desarrollado en Angular. De esta manera, se garantiza una separación limpia de responsabilidades y se facilita el mantenimiento independiente de ambos entornos.

---

## Características principales

* **Gestión de citas clínicas:** Programación, seguimiento y cancelación de citas médicas adaptadas según el rol del usuario.
* **Autenticación y roles:** Sistema de control de accesos basado en perfiles que restringe la navegación para administradores, odontólogos y pacientes.
* **Seguridad y tokens:** Protección de endpoints del backend mediante tokens JWT firmados digitalmente.
* **Reportes dinámicos:** Generación de reportes detallados en formato PDF para análisis de datos clínicos y métricas de negocio.
* **Confirmación OTP:** Validación de identidad a través de contraseñas de un solo uso enviadas por correo electrónico.
* **Panel interactivo:** Visualización gráfica de estadísticas de reservaciones en el panel principal.

---

## Requisitos de entorno

> [!NOTE]
> Asegúrate de contar con el software básico instalado en tu servidor o máquina local antes de iniciar la configuración.

* [Node.js](https://nodejs.org/) (versión compatible con Angular 15, preferentemente 16.x o 18.x).
* [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0).
* [SQL Server](https://www.microsoft.com/es-es/sql-server/sql-server-downloads) (o SQL Express).
* Angular CLI instalado de forma global (`npm install -g @angular/cli@15`).

---

## Instalación y arranque local

### 1. Configuración de la base de datos

1. Verifica que el motor de base de datos SQL Server esté en ejecución en tu entorno.
2. Navega al archivo `appsettings.json` en `SistemaOdontologicoBakend/SistemaOdontologico/` y ajusta la cadena de conexión local.

```json
"ConnectionStrings": {
  "cadenaSQL": "Server=TU_SERVIDOR;Database=SistemaOdontologicoDB;Trusted_Connection=True;"
}
```

> [!TIP]
> El sistema incluye un inicializador de base de datos (`DbInitializer`) que creará las tablas, los roles, los servicios y el usuario administrador automáticamente durante el primer arranque.

### 2. Ejecución del backend

Abre una terminal, navega al directorio del backend y ejecuta el proyecto:

```powershell
cd SistemaOdontologicoBakend\SistemaOdontologico
dotnet restore
dotnet build
dotnet run
```

> [!IMPORTANT]
> Swagger estará disponible para pruebas en `/swagger` (usualmente bajo el puerto configurado en `https://localhost:7196/swagger`).

### 3. Ejecución del frontend

Abre otra terminal, navega a la carpeta del frontend, instala los paquetes e inicializa el servidor de desarrollo:

```bash
cd SistemaOdontologicoFrontend
npm install
ng serve --open
```

La aplicación web se abrirá automáticamente en tu navegador web en `http://localhost:4200/`.

---

## Seguridad, autenticación JWT y validación OTP

La plataforma implementa un flujo híbrido de autenticación que combina la validación OTP con firmas digitales JWT. De este modo, se asegura que únicamente los usuarios registrados y validados mediante su correo electrónico puedan consumir los servicios de la API.

Cuando un paciente se registra en el sistema, se almacena de forma temporal en la caché y se le envía un código de seis dígitos a su correo electrónico. Tras ingresar y validar exitosamente dicho código, la API persiste el usuario y genera un token JWT firmado que Angular adjunta en las cabeceras HTTP de forma transparente.

---

## Guía de despliegue en producción

Para el despliegue del sistema en producción, se recomienda alojar el backend y la base de datos en servidores compatibles con .NET 6, mientras que el frontend puede ser servido de forma independiente. A continuación, se detallan las pautas generales para preparar ambos entornos.

### Despliegue del backend (.NET 6)

Para la subida del backend, es necesario compilar la API REST en modo producción y configurar la cadena de conexión definitiva en el servidor de destino. De manera general, se pueden utilizar servicios en la nube como Azure App Service o un servidor local IIS mediante los siguientes pasos:

1. Ejecutar el comando de publicación `dotnet publish -c Release` para generar los archivos binarios optimizados.
2. Copiar el directorio resultante en el servidor y configurar el archivo `appsettings.json` con las credenciales de la base de datos de producción.
3. Habilitar el puerto HTTPS correspondiente y configurar las reglas de CORS en `Program.cs` para permitir las peticiones únicamente desde el dominio del frontend.

### Despliegue del frontend (Angular 15)

El frontend se compila como un conjunto de archivos estáticos HTML, CSS y JavaScript que pueden alojarse en cualquier servidor web como Nginx o Apache. Puesto que la compilación es agnóstica al backend, se deben ajustar las variables de entorno antes de la subida:

1. Modificar el archivo `src/environments/environment.prod.ts` para que apunte a la URL pública donde se encuentra alojada la API del backend.
2. Ejecutar el comando de construcción `npm run build` o `ng build --configuration production` para generar la carpeta de distribución optimizada.
3. Transferir los archivos contenidos dentro del directorio `dist/` al servidor web y habilitar las reglas de redirección para soportar la navegación SPA de Angular.

---

## Arquitectura y estructura del repositorio

* `SistemaOdontologicoBakend/`: Contiene el código de ASP.NET Core estructurado por controladores, interfaces de repositorio, modelos de Entity Framework Core, DTOs y utilidades de configuración.
* `SistemaOdontologicoFrontend/`: Contiene la aplicación Angular organizada por componentes de páginas (citas, usuarios, dashboard, reportes), servicios HTTP para la comunicación con la API, interceptores de seguridad y modales de interacción.
