// MyOS Calendar — month view with events saved to localStorage.
const KEY = 'myos.calendar';
const grid = document.getElementById('cal-grid');
const titleEl = document.getElementById('cal-title');

if (grid) {
  let events = {};
  try { events = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (e) {} };
  const key = (y, m, d) => y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');

  let view = new Date();
  let selected = null;
  const selEl = document.getElementById('cal-sel');
  const form = document.getElementById('cal-form');
  const input = document.getElementById('cal-input');
  const list = document.getElementById('cal-list');

  function renderMonth() {
    const y = view.getFullYear(), m = view.getMonth();
    titleEl.textContent = view.toLocaleDateString([], { month: 'long', year: 'numeric' });
    grid.replaceChildren();
    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    for (let i = 0; i < start; i++) grid.appendChild(document.createElement('div'));
    for (let d = 1; d <= days; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.textContent = d;
      const k = key(y, m, d);
      if (events[k] && events[k].length) cell.classList.add('has');
      if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) cell.classList.add('today');
      if (selected === k) cell.classList.add('sel');
      cell.addEventListener('click', () => { selected = k; renderMonth(); renderDay(); });
      grid.appendChild(cell);
    }
  }
  function renderDay() {
    if (!selected) { selEl.textContent = 'Pick a day'; form.style.display = 'none'; list.replaceChildren(); return; }
    selEl.textContent = selected;
    form.style.display = 'flex';
    list.replaceChildren();
    (events[selected] || []).forEach((ev, i) => {
      const li = document.createElement('li');
      const t = document.createElement('span'); t.textContent = ev;
      const x = document.createElement('span'); x.className = 'x'; x.textContent = '✕';
      x.addEventListener('click', () => { events[selected].splice(i, 1); if (!events[selected].length) delete events[selected]; save(); renderMonth(); renderDay(); });
      li.append(t, x); list.appendChild(li);
    });
  }

  document.getElementById('cal-prev').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderMonth(); });
  document.getElementById('cal-next').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim(); if (!v || !selected) return;
    (events[selected] = events[selected] || []).push(v); input.value = ''; save(); renderMonth(); renderDay();
  });

  renderMonth(); renderDay();
}
