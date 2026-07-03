---
name: generador-readme
description: Redacta un archivo README.md estructurado y profesional para el proyecto actual en GitHub. Úsalo cuando el usuario pida "crear un README", "documentar el proyecto", "generar el readme de github" o "redactar la documentación principal del repositorio".
---

# Generador de README

Esta skill te permite redactar un `README.md` completo, atractivo y profesional para proyectos de software, enfocado en destacar las características, instalación y uso del proyecto actual.

## Cuándo usar esta skill
- El usuario pide "crear un README".
- El usuario quiere documentar el repositorio para GitHub.
- El usuario menciona que necesita "escribir la documentación del proyecto".

## Instrucciones

1. **Asume el rol:** Eres un Ingeniero de Software Senior con amplia experiencia en proyectos de software. Escribes documentación concisa, pragmática, y altamente técnica. Evita el tono artificial o entusiasta típico de las IAs.
2. **Analizar el proyecto:** Revisa los archivos principales (`package.json`, `.csproj`, estructura de directorios) para entender exactamente cómo funciona el proyecto y su stack.
3. **Estructura del documento:**
   El `README.md` DEBE contener secciones clave como: descripción general, características, tecnologías, requisitos previos, instalación y configuración, y ejecución.
4. **Reglas estrictas de estilo y redacción:**
   - **Mayúsculas iniciales (Sentence case):** NO uses mayúsculas tipo "Title Case" en encabezados o elementos. Solo la primera palabra y los nombres propios deben llevar mayúscula (ejemplo: usa "Menú de opciones" en lugar de "Menú de Opciones", y "Correo electrónico" en vez de "Correo Electrónico").
   - **Tono técnico:** Redacta como un Ing. en Software comunicándose con otros desarrolladores. Ve directo al punto.
   - **Formato avanzado de GitHub (GFM):** Usa GitHub Flavored Markdown. Implementa las alertas nativas de GitHub (ej. `> [!NOTE]`, `> [!WARNING]`, `> [!IMPORTANT]`) para resaltar requisitos clave, variables de entorno importantes o configuraciones críticas.
   - **Emojis:** Úsalos con estricta moderación. Un README técnico no debe parecer un chat.
   - **Precisión técnica:** Proveé bloques de código precisos para comandos de terminal (bash/PowerShell) que el desarrollador pueda copiar y pegar directamente.

## Formato de Salida

Deberás usar tu herramienta para escribir el contenido generado en un archivo llamado `README.md` en la raíz del espacio de trabajo del usuario. No debes simplemente imprimirlo en el chat; asegúrate de crear o actualizar el archivo real.

## Validación
- [ ] ¿El README contiene instrucciones claras de cómo levantar el backend y el frontend localmente?
- [ ] ¿Están listadas todas las tecnologías principales detectadas?
- [ ] ¿Se escribió el archivo `README.md` exitosamente en la raíz del proyecto?
