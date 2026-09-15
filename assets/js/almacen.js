// Almacén local de la aplicación.
// Prototipo sin servidor: la información se guarda en el navegador de cada usuario
// (localStorage). El portal de administración permite exportarla e importarla.

(function () {
  const CLAVE = "rutas-curriculares-v1";

  const CATALOGOS_BASE = {
    modalidades: ["Presencial", "Híbrida", "Virtual", "Dual"],
    nivelesFormacion: ["Pregrado", "Especialización universitaria", "Especialización médico-quirúrgica",
                       "Maestría", "Doctorado"],
    estadosPrograma: ["Activo", "En creación", "Inactivo", "En proceso de cierre"],
    estadosProceso: ["En curso", "En pausa", "Finalizado", "Cancelado"]
  };

  function estadoInicial() {
    const s = JSON.parse(JSON.stringify(window.SEMILLA || { divisiones: [], departamentos: [] }));
    return {
      divisiones: s.divisiones || [],
      departamentos: s.departamentos || [],
      programas: [],
      catalogos: JSON.parse(JSON.stringify(CATALOGOS_BASE)),
      rutas: JSON.parse(JSON.stringify(window.RUTAS || [])),
      procesos: [],
      version: 1
    };
  }

  let estado = null;

  function cargar() {
    if (estado) return estado;
    try {
      const crudo = localStorage.getItem(CLAVE);
      estado = crudo ? JSON.parse(crudo) : estadoInicial();
    } catch (e) {
      estado = estadoInicial();
    }
    if (!estado.rutas || !estado.rutas.length) estado.rutas = JSON.parse(JSON.stringify(window.RUTAS || []));
    if (!estado.catalogos) estado.catalogos = JSON.parse(JSON.stringify(CATALOGOS_BASE));
    return estado;
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {
      alert("No fue posible guardar la información en este navegador. Exporte una copia de seguridad desde el portal de administración.");
    }
  }

  function reiniciar() {
    estado = estadoInicial();
    guardar();
  }

  function id(prefijo) {
    return prefijo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  }

  // ------------------------------------------------------------ procesos

  function crearProceso(datos) {
    const ruta = cargar().rutas.find(r => r.id === datos.rutaId);
    const proceso = {
      id: id("p"),
      rutaId: datos.rutaId,
      rutaNombre: ruta ? ruta.nombre : datos.rutaId,
      programa: datos.programa || "",
      division: datos.division || "",
      departamento: datos.departamento || "",
      lider: datos.lider || "",
      correo: datos.correo || "",
      notas: datos.notas || "",
      respuestas: datos.respuestas || {},
      estado: "En curso",
      creado: new Date().toISOString(),
      etapas: (ruta ? ruta.etapas : []).map(e => ({
        nombre: e.n, responsable: e.resp, dias: e.dias, hecho: false, fecha: "", observacion: ""
      })),
      bitacora: [{ fecha: new Date().toISOString(), texto: "Proceso creado." }]
    };
    cargar().procesos.push(proceso);
    guardar();
    return proceso;
  }

  function proceso(pid) {
    return cargar().procesos.find(p => p.id === pid);
  }

  function procesosDePrograma(nombrePrograma) {
    return cargar().procesos.filter(
      p => p.programa === nombrePrograma && p.estado !== "Finalizado" && p.estado !== "Cancelado"
    );
  }

  function avance(p) {
    if (!p.etapas.length) return 0;
    return Math.round(p.etapas.filter(e => e.hecho).length / p.etapas.length * 100);
  }

  function diasRestantes(p) {
    return p.etapas.filter(e => !e.hecho).reduce((a, e) => a + (Number(e.dias) || 0), 0);
  }

  function registrarBitacora(p, texto) {
    p.bitacora.push({ fecha: new Date().toISOString(), texto: texto });
    guardar();
  }

  // ------------------------------------------------------------ csv

  function leerCSV(texto) {
    const filas = [];
    let campo = "", fila = [], dentro = false;
    texto = texto.replace(/^\uFEFF/, "");
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (dentro) {
        if (c === '"') {
          if (texto[i + 1] === '"') { campo += '"'; i++; }
          else dentro = false;
        } else campo += c;
      } else if (c === '"') dentro = true;
      else if (c === ",") { fila.push(campo); campo = ""; }
      else if (c === "\n") { fila.push(campo); filas.push(fila); fila = []; campo = ""; }
      else if (c !== "\r") campo += c;
    }
    if (campo.length || fila.length) { fila.push(campo); filas.push(fila); }
    if (!filas.length) return [];
    const enc = filas[0].map(h => h.trim());
    return filas.slice(1).filter(f => f.some(v => v.trim() !== "")).map(f => {
      const o = {};
      enc.forEach((h, i) => { o[h] = (f[i] || "").trim(); });
      return o;
    });
  }

  function escribirCSV(filas, columnas) {
    const esc = v => '"' + String(v === undefined || v === null ? "" : v).replace(/"/g, '""') + '"';
    const lineas = [columnas.map(esc).join(",")];
    filas.forEach(f => lineas.push(columnas.map(c => esc(f[c])).join(",")));
    return "\uFEFF" + lineas.join("\r\n");
  }

  function descargar(nombre, contenido, tipo) {
    const b = new Blob([contenido], { type: (tipo || "text/plain") + ";charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ------------------------------------------------------------ utilidades de vista

  function esc(t) {
    return String(t === undefined || t === null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fecha(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
  }

  function meses(dias) {
    const m = dias / 20; // días hábiles por mes
    if (m < 1) return "menos de un mes";
    if (m < 1.6) return "cerca de un mes";
    return "cerca de " + Math.round(m) + " meses";
  }

  function marcarNav() {
    const actual = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".rail nav a").forEach(a => {
      if (a.getAttribute("href") === actual) a.setAttribute("aria-current", "page");
    });
  }

  window.App = {
    cargar, guardar, reiniciar, id,
    crearProceso, proceso, procesosDePrograma, avance, diasRestantes, registrarBitacora,
    leerCSV, escribirCSV, descargar, esc, fecha, meses, marcarNav,
    CATALOGOS_BASE
  };

  document.addEventListener("DOMContentLoaded", marcarNav);
})();
