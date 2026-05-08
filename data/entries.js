// data/entries.js
// Aquí se van guardando todas tus entradas.
// Cada vez que agregas una desde la página, se actualiza este archivo (o localStorage).
// También puedes agregar entradas manualmente en este array para hacer commits a GitHub.

const ENTRIES = [
  {
    id: 1,
    date: "2025-01-01",
    type: "logro",
    title: "Empecé mi journey como desarrollador web 🚀",
    content: "Hoy decidí formalmente empezar a aprender desarrollo web. Voy a documentar todo aquí para no perder el hilo y mantener mi GitHub activo.",
    tags: ["inicio", "motivación"],
    link: ""
  },
  {
    id: 2,
    date: "2025-01-02",
    type: "recurso",
    title: "The Odin Project — el mejor camino para aprender desde cero",
    content: "Encontré este recurso gratuito que tiene una ruta de aprendizaje muy bien estructurada. Cubre HTML, CSS, JavaScript y más. Lo voy a seguir como guía principal.",
    tags: ["html", "css", "javascript", "recursos"],
    link: "https://www.theodinproject.com"
  },
  {
    id: 3,
    date: "2025-01-03",
    type: "nota",
    title: "Diferencia entre display: block, inline e inline-block",
    content: "Block: ocupa todo el ancho disponible, genera salto de línea (div, p, h1).\nInline: solo ocupa lo que necesita, no acepta width/height (span, a, strong).\nInline-block: lo mejor de los dos, respeta dimensiones pero fluye con el texto.",
    tags: ["css", "display", "layout"],
    link: ""
  }
];
