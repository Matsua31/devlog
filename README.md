# 📖 DevLog — Mi bitácora de aprendizaje

Un diario de aprendizaje personal para documentar mi camino como desarrollador web.

## ¿Qué es esto?

Una página web estática (sin frameworks, sin build tools) donde registro:

- 📝 **Notas** — conceptos aprendidos, apuntes
- 🔗 **Recursos** — links útiles, tutoriales, documentación
- 🛠️ **Proyectos** — cosas que construyo en el camino
- 🏆 **Logros** — hitos importantes

## Estructura

```
devlog/
├── index.html        # Página principal
├── style.css         # Estilos
├── app.js            # Lógica (filtros, modal, render)
├── data/
│   └── entries.js    # Todas las entradas (aquí se hace commit)
└── README.md
```

## Cómo usar

1. Abrir `index.html` en el navegador (doble clic, o con Live Server en VS Code)
2. Agregar entradas desde el botón **+ Nueva entrada**
3. Copiar el snippet que aparece al `data/entries.js`
4. Hacer `git add . && git commit -m "nueva entrada"` → ¡GitHub verde!

## Cómo subir a GitHub Pages (gratis)

1. Crear repo en GitHub con el nombre `devlog` (o el que quieras)
2. Subir todos los archivos
3. Ir a **Settings → Pages → Deploy from branch → main**
4. Tu bitácora va a estar en: `https://tu-usuario.github.io/devlog`

---

*Proyecto construido desde cero como parte del aprendizaje de desarrollo web.*
