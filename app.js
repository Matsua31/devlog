// app.js — Lógica principal de la bitácora

// ─── Estado ────────────────────────────────────────────────────────────────
let allEntries = [...ENTRIES];
let activeFilter = 'all';
let activeTag = null;

// ─── Utilidades ────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

function daysBetween(d1, d2) {
  const ms = Math.abs(new Date(d2) - new Date(d1));
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function getStreak(entries) {
  if (!entries.length) return 0;
  const sorted = [...entries]
    .map(e => e.date)
    .sort((a, b) => b.localeCompare(a));
  const unique = [...new Set(sorted)];
  let streak = 1;
  for (let i = 0; i < unique.length - 1; i++) {
    if (daysBetween(unique[i], unique[i + 1]) === 1) streak++;
    else break;
  }
  return streak;
}

function typeLabel(type) {
  const map = { nota: '📝 nota', recurso: '🔗 recurso', proyecto: '🛠️ proyecto', logro: '🏆 logro' };
  return map[type] || type;
}

function generateId() {
  return Date.now();
}

// ─── Render ────────────────────────────────────────────────────────────────
function renderEntries() {
  const feed = document.getElementById('feed');
  let filtered = [...allEntries].sort((a, b) => b.date.localeCompare(a.date));

  if (activeFilter !== 'all') {
    filtered = filtered.filter(e => e.type === activeFilter);
  }

  if (activeTag) {
    filtered = filtered.filter(e => e.tags.map(t => t.trim().toLowerCase()).includes(activeTag));
  }

  if (!filtered.length) {
    feed.innerHTML = `
      <div class="empty-state">
        <span class="big">📖</span>
        No hay entradas aún.<br>
        Empieza agregando lo que aprendiste hoy.
      </div>`;
    return;
  }

  feed.innerHTML = filtered.map(entry => `
    <article class="entry-card" data-id="${entry.id}">
      <div class="entry-meta">
        <span class="entry-type-dot dot-${entry.type}"></span>
        <span class="entry-date">${formatDate(entry.date)}</span>
        <span class="entry-type-label">${typeLabel(entry.type)}</span>
      </div>
      <h2 class="entry-title">${entry.title}</h2>
      <p class="entry-content">${entry.content}</p>
      ${entry.link ? `<div class="entry-link"><a href="${entry.link}" target="_blank" rel="noopener">↗ ${entry.link.replace(/^https?:\/\//, '')}</a></div>` : ''}
      ${entry.tags.length ? `
        <div class="entry-tags">
          ${entry.tags.map(t => `<span class="entry-tag tag-${entry.type}">${t.trim()}</span>`).join('')}
        </div>` : ''}
    </article>
  `).join('');
}

function renderStats() {
  const dates = allEntries.map(e => e.date);
  const uniqueDays = new Set(dates).size;

  document.getElementById('total-entries').textContent = allEntries.length;
  document.getElementById('days-count').textContent = uniqueDays;
  document.getElementById('streak-count').textContent = getStreak(allEntries);
}

function renderTags() {
  const tagCount = {};
  allEntries.forEach(e => {
    e.tags.forEach(t => {
      const key = t.trim().toLowerCase();
      tagCount[key] = (tagCount[key] || 0) + 1;
    });
  });

  const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const cloud = document.getElementById('tags-cloud');

  cloud.innerHTML = sorted.map(([tag]) => `
    <span class="tag-pill ${activeTag === tag ? 'active-tag' : ''}" data-tag="${tag}">${tag}</span>
  `).join('');

  cloud.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const tag = pill.dataset.tag;
      activeTag = activeTag === tag ? null : tag;
      renderAll();
    });
  });
}

function renderAll() {
  renderStats();
  renderTags();
  renderEntries();
}

// ─── Filtros ────────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    activeTag = null;
    renderAll();
  });
});

// ─── Modal ─────────────────────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const openBtn  = document.getElementById('open-modal');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-modal');

function openModal() { overlay.classList.add('open'); }
function closeModal() {
  overlay.classList.remove('open');
  clearForm();
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

function clearForm() {
  document.getElementById('entry-title').value = '';
  document.getElementById('entry-type').value = 'nota';
  document.getElementById('entry-tags').value = '';
  document.getElementById('entry-content').value = '';
  document.getElementById('entry-link').value = '';
}

// ─── Guardar entrada ────────────────────────────────────────────────────────
document.getElementById('save-entry').addEventListener('click', () => {
  const title   = document.getElementById('entry-title').value.trim();
  const type    = document.getElementById('entry-type').value;
  const tagsRaw = document.getElementById('entry-tags').value.trim();
  const content = document.getElementById('entry-content').value.trim();
  const link    = document.getElementById('entry-link').value.trim();

  if (!title || !content) {
    alert('El título y el contenido son obligatorios.');
    return;
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const today = new Date().toISOString().split('T')[0];

  const entry = { id: generateId(), date: today, type, title, content, tags, link };

  // Guardar en memoria + localStorage
  allEntries.push(entry);
  saveToLocalStorage();
  closeModal();
  renderAll();

  // Mostrar instrucción para agregar al archivo
  showSaveHint(entry);
});

// ─── LocalStorage (persistencia mientras no editas el archivo) ──────────────
function saveToLocalStorage() {
  localStorage.setItem('devlog_entries', JSON.stringify(allEntries));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('devlog_entries');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Merge: entradas del archivo + las guardadas localmente que no estén en el archivo
    const fileIds = new Set(ENTRIES.map(e => e.id));
    const extra = parsed.filter(e => !fileIds.has(e.id));
    allEntries = [...ENTRIES, ...extra];
  }
}

// ─── Hint para actualizar el archivo ───────────────────────────────────────
function showSaveHint(entry) {
  const snippet = `  {\n    id: ${entry.id},\n    date: "${entry.date}",\n    type: "${entry.type}",\n    title: "${entry.title}",\n    content: "${entry.content.replace(/\n/g, '\\n')}",\n    tags: [${entry.tags.map(t => `"${t}"`).join(', ')}],\n    link: "${entry.link}"\n  },`;

  const hint = document.createElement('div');
  hint.style.cssText = `
    position: fixed; bottom: 1.5rem; right: 1.5rem; max-width: 420px;
    background: #1a1814; color: #f7f5f2; border-radius: 6px;
    padding: 1rem 1.25rem; font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem; line-height: 1.6; z-index: 200;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  `;
  hint.innerHTML = `
    <div style="color:#8a8278; margin-bottom:0.5rem;">✅ Entrada guardada</div>
    <div style="margin-bottom:0.5rem;">Para hacerla permanente, agrega esto a <strong>data/entries.js</strong> y haz commit:</div>
    <pre style="background:#111; padding:0.6rem; border-radius:4px; overflow-x:auto; white-space:pre; font-size:0.65rem;">${snippet}</pre>
    <button onclick="this.parentElement.remove()" style="margin-top:0.75rem; background:none; border:1px solid #444; color:#aaa; padding:0.3rem 0.75rem; border-radius:3px; cursor:pointer; font-family:inherit; font-size:0.7rem;">Cerrar</button>
  `;
  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 15000);
}

// ─── Init ───────────────────────────────────────────────────────────────────
loadFromLocalStorage();
renderAll();
