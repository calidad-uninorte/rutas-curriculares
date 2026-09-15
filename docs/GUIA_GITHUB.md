# Cómo subir esto a GitHub y compartirlo con la DCPA

Dos caminos. El primero no requiere instalar nada y sirve perfectamente para socializar un prototipo. El segundo conviene si va a haber varias rondas de cambios.

---

## Camino 1 — Desde el navegador, sin instalar nada

### 1. Cree la cuenta y el repositorio

1. Entre a `github.com` y cree una cuenta si no la tiene. Si la Universidad tiene organización en GitHub, pida que lo agreguen: el repositorio queda bajo control institucional y no bajo una cuenta personal.
2. Haga clic en **New repository**.
3. Nombre: `rutas-curriculares`.
4. Descripción: "Aplicación web para la gestión autónoma de procesos curriculares — Universidad del Norte".
5. Visibilidad: **Private** mientras esté en revisión. Puede cambiarla después.
6. No marque ninguna de las casillas de inicialización (README, .gitignore, licencia). El proyecto ya trae su README.
7. **Create repository**.

### 2. Suba los archivos

1. En el repositorio vacío, haga clic en **uploading an existing file**.
2. Descomprima el archivo del proyecto en su equipo.
3. Arrastre **el contenido** de la carpeta, no la carpeta: `index.html`, `programas.html`, `proceso.html`, `admin.html`, `README.md` y las carpetas `assets`, `datos` y `docs`.
4. En el campo de descripción del commit escriba: "Versión inicial del prototipo".
5. **Commit changes**.

`index.html` debe quedar en la raíz del repositorio. Si queda dentro de una subcarpeta, GitHub Pages no lo encontrará.

### 3. Publíquelo para que se pueda abrir desde el navegador

1. **Settings** → **Pages**.
2. En Source escoja **Deploy from a branch**.
3. Branch: `main`, carpeta `/ (root)`. **Save**.
4. Espere entre uno y tres minutos. La dirección aparece en esa misma pantalla, con la forma:
   `https://SU-USUARIO.github.io/rutas-curriculares/`

Si el repositorio es privado, GitHub Pages solo funciona en planes de pago. Dos salidas: dejarlo público mientras se socializa, o compartir el ZIP para que cada quien lo abra localmente haciendo doble clic en `index.html`.

### 4. Compártalo

Envíe a la DCPA la dirección de Pages y la del repositorio. Pida que los comentarios se registren como **Issues** en GitHub: quedan en un solo lugar, con responsable y estado, en vez de dispersos en correos.

---

## Camino 2 — Desde la línea de comandos

Si tiene Git instalado:

```bash
cd rutas-curriculares
git init
git add .
git commit -m "Versión inicial del prototipo"
git branch -M main
git remote add origin https://github.com/SU-USUARIO/rutas-curriculares.git
git push -u origin main
```

Para los cambios siguientes:

```bash
git add .
git commit -m "Describa aquí el cambio"
git push
```

---

## Recomendaciones para la socialización

**Diga qué es.** Es un prototipo navegable, no un sistema en producción. La diferencia importa: si alguien asume que ya funciona, la conversación se desvía hacia detalles de interfaz en vez de validar las rutas.

**Pida que validen tres cosas concretas.** Las etapas de cada ruta, los responsables y las duraciones estimadas. Eso es lo que solo la DCPA puede confirmar, y es lo que da o quita valor a la herramienta.

**Advierta el límite de la información local.** Cada persona que abra la aplicación verá su propia copia. Nadie va a ver los procesos que otro creó. Es esperado en un prototipo, pero si no se dice, se lee como una falla.

**Cargue los programas antes de la demostración.** Hoy el listado está vacío porque el archivo de programas llegó sin datos. Con el listado real cargado, la página de programas es mucho más convincente.

---

## Si después se decide construir el sistema real

Lo que hay aquí sirve como especificación funcional: las rutas, las etapas, los responsables, los campos y el vocabulario ya están decididos y revisados. Un equipo de desarrollo puede tomarlo como punto de partida en vez de empezar de una hoja en blanco.

Las decisiones que habría que tomar antes son: dónde se aloja, cómo se autentica contra el directorio institucional, qué se integra con GAP y Banner, y quién responde por el mantenimiento de las tablas básicas.
