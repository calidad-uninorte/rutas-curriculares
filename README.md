# Rutas Curriculares

Aplicación web para que un profesor o coordinador de la Universidad del Norte pueda iniciar y seguir por su cuenta un proceso curricular: creación de un programa, modificación, renovación del registro calificado, autoevaluación permanente o inactivación.

Prototipo funcional para revisión interna de la Dirección de Calidad y Proyectos Académicos.

## Qué resuelve

Los líderes de programa reportan tres problemas: no saben cuánto tarda un trámite, no saben qué sigue, y no pueden ver en qué punto está su solicitud. La aplicación responde a los tres mostrando, para cada proceso, sus etapas en orden, el responsable de cada una, la duración estimada y el avance real.

## Páginas

| Página | Para qué sirve |
|---|---|
| `index.html` | Explica los cinco procesos y muestra lo que está en curso. |
| `programas.html` | Listado de programas filtrable por división, departamento, nivel y estado, con marca de proceso abierto. |
| `proceso.html` | Asistente de tres pasos para abrir un proceso, y vista de seguimiento con etapas y bitácora. |
| `admin.html` | Mantenimiento de tablas básicas, listas de selección, rutas, procesos y copia de seguridad. |

## Cómo se ejecuta

No requiere instalación ni servidor. Abra `index.html` en un navegador, o publique la carpeta en GitHub Pages.

Para probar en local con un servidor, desde la carpeta del proyecto:

```
python3 -m http.server 8000
```

y abra `http://localhost:8000`.

## Dónde se guarda la información

En el navegador de cada persona, mediante `localStorage`. Esto es suficiente para revisar el prototipo y discutirlo con el equipo, pero tiene un límite importante: **dos personas que abran la misma dirección no ven la misma información**. Para uso real se necesita una base de datos y autenticación institucional.

Desde `admin.html`, pestaña Copia de seguridad, se puede exportar todo a un archivo JSON e importarlo en otro equipo.

## Datos

| Archivo | Origen | Estado |
|---|---|---|
| `datos/Divisiones_Académicas.csv` | Tablas institucionales | 10 divisiones |
| `datos/Departamentos_Académicos.csv` | Tablas institucionales | 26 departamentos |
| `datos/Programas_Académicos.csv` | Tablas institucionales | **Vacío**: el archivo llegó solo con la fila de encabezados |

Las divisiones y los departamentos vienen precargados en `assets/js/datos.js`. Los programas se cargan desde `admin.html`, pestaña Programas, con el botón Importar CSV, usando los mismos encabezados del reporte institucional.

## Las rutas de proceso

Están definidas en `assets/js/rutas.js` y se derivan de los procedimientos del Sistema Integrado de Gestión de Calidad:

| Ruta | Procedimiento de referencia | Etapas |
|---|---|---|
| Creación de un programa nuevo | FOES-PR-007 y FOES-PR-008 | 14 |
| Modificación de un programa existente | FOES-PR-007 y FOES-PR-008 | 10 |
| Renovación del registro calificado | FOES-PR-008 | 9 |
| Autoevaluación permanente | FOES-PR-010 | 8 |
| Inactivación o no renovación | FOES-PR-009 | 10 |

Las duraciones están expresadas en días hábiles y son estimaciones de referencia. Deben validarse con la DCPA antes de publicarlas a los profesores.

## Estructura

```
index.html
programas.html
proceso.html
admin.html
assets/css/app.css
assets/js/datos.js      datos semilla de divisiones y departamentos
assets/js/rutas.js      definición de las cinco rutas y sus etapas
assets/js/almacen.js    persistencia, CSV y utilidades
datos/                  archivos CSV originales
docs/GUIA_GITHUB.md     cómo publicar y compartir este repositorio
```

## Qué falta para que sea un sistema, no un prototipo

- Base de datos compartida y autenticación con las credenciales institucionales.
- Roles: profesor, coordinador, decano, DCPA, calidad institucional.
- Notificaciones por correo en los cambios de etapa.
- Carga de archivos reales en cada etapa.
- Integración con GAP, Banner y SNIES para no volver a digitar lo que ya existe.
- Trazabilidad auditable: quién hizo qué y cuándo, sin posibilidad de borrado.

## Licencia y uso

Material interno de la Universidad del Norte. La identidad visual sigue la norma de marca institucional.
