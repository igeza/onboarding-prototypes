/* Select Files dialog: a Sidebar List of files on the left (RMX Sidebar List + Sidebar List Item, with the kebab and a
   drag handle in each item's trailing content) and the selected file's editor on the right (File Name, Help Text, Mapping, Allow multiple uploads). Add, Delete (trash icon) and drag-to-reorder all work; nothing is saved.
   Usage: <div id="files-root"></div>. */
(function () {
  const root = document.getElementById('files-root');
  if (!root) return;

  const MAP = [
    "Tenants > Documents > Driver's License",
    'Tenants > Documents > Proof of Income',
    'Tenants > Documents > Vehicle Registration',
    'Tenants > Documents > Lease Addendum'
  ];
  let uid = 0;
  const file = (name, help, map, multi) => ({ id: ++uid, name: name || '', help: help || '', map: map || '', multi: !!multi });
  /* Empty on first open; files saved earlier in this tab come back for editing. */
  let saved = []; try { saved = JSON.parse(sessionStorage.getItem('rmx-files') || '[]'); } catch (e) {}
  const files = saved.map(f => file(f.name, f.help, f.map, f.multi));
  let openId = files.length ? files[0].id : 0;

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [].slice.call((r || document).querySelectorAll(s));
  const find = id => files.find(f => f.id === id);
  const label = f => f.name ? esc(f.name) : '<span class="rmx-placeholder">Untitled file</span>';

  const trash = () => '<button type="button" class="fm-del wt-blue" data-fm-delete aria-label="Delete file" title="Delete"><svg class="rmx-icon"><use href="#delete-filled"></use></svg></button>';
  const handle = () => '<span class="wt-blue wt-handle" data-fm-handle aria-label="Drag to reorder" title="Drag to reorder"><svg class="rmx-icon"><use href="#drag-indicator"></use></svg></span>';

  const item = (f, on) =>
    '<div class="rmx-sidebar-item fm-item' + (on ? ' is-selected' : '') + '" data-id="' + f.id + '" data-rmx-component="Sidebar List Item">' +
    '<span class="rmx-sidebar-item__text" data-fm-title>' + label(f) + '</span>' +
    '<span class="rmx-sidebar-item__trailing">' + trash() + handle() + '</span></div>';

  const editor = f =>
    '<div class="fm-box">' +
      '<div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">File Name *</span><div class="rmx-field__box"><input type="text" data-fm-name value="' + esc(f.name) + '"></div></div>' +
      '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label wt-info">Help Text <svg class="rmx-icon rmx-icon--16"><use href="#info"></use></svg></span><div class="rmx-field__box wt-textbox"><textarea class="wt-textarea" data-fm-help aria-label="Help Text" rows="2">' + esc(f.help) + '</textarea></div></div>' +
      '<div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">Map to Rent Manager Field</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="wt-value' + (f.map ? '' : ' rmx-placeholder') + '" data-rmx-value>' + (f.map ? esc(f.map) : '') + '</span><svg class="rmx-icon"><use href="#keyboard-arrow-down"></use></svg></button>' +
      '<div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + MAP.map(m => '<button type="button" data-value="' + esc(m) + '">' + esc(m) + '</button>').join('') + '</div></div>' +
      '<label class="rmx-check" data-checked="' + f.multi + '" data-fm-multi data-rmx-component="Checkbox"><span class="rmx-check__box"><svg class="rmx-icon rmx-icon--16"><use href="#check"></use></svg></span><span class="rmx-text">Allow multiple uploads</span></label>' +
    '</div>';

  function render() {
    const cur = find(openId) || files[0];
    root.innerHTML = '<div class="fm-split"><aside class="rmx-sidebar" data-rmx-component="Sidebar List">' +
      '<div class="rmx-sidebar__header"><a class="rmx-btn rmx-btn--text" href="#" data-fm-add data-rmx-component="Button"><svg class="rmx-icon"><use href="#add"></use></svg><span class="rmx-btn__label">Add</span></a></div>' +
      '<div class="rmx-sidebar__list fm-list">' + files.map(f => item(f, cur && f.id === cur.id)).join('') + '</div></aside>' +
      '<div class="fm-editor" data-id="' + (cur ? cur.id : 0) + '">' + (cur ? editor(cur) : '<p class="rmx-text fm-empty">No files yet. Use Add to get started.</p>') + '</div></div>';
    if (window.RMX && RMX.dropdowns) RMX.dropdowns();
  }

  const idOf = el => +el.closest('[data-id]').dataset.id;
  root.addEventListener('input', e => {
    const f = find(idOf(e.target));
    if (e.target.matches('[data-fm-name]')) { f.name = e.target.value; const t = $('.fm-item[data-id="' + f.id + '"] [data-fm-title]', root); if (t) t.innerHTML = label(f); }
    if (e.target.matches('[data-fm-help]')) f.help = e.target.value;
  });
  root.addEventListener('rmx:select', e => { if (e.target.closest('.fm-editor')) find(idOf(e.target)).map = e.detail.value; });
  root.addEventListener('click', e => {
    const multi = e.target.closest('[data-fm-multi]');
    if (multi) { const f = find(idOf(multi)); f.multi = !f.multi; multi.dataset.checked = String(f.multi); return; }
    if (e.target.closest('[data-fm-add]')) {
      e.preventDefault();
      const f = file(); files.push(f); openId = f.id; render();
      const n = $('[data-fm-name]', root); if (n) n.focus();
      return;
    }
    const it = e.target.closest('.fm-item');
    if (it && !e.target.closest('[data-fm-delete], [data-fm-handle]')) { openId = +it.dataset.id; render(); }
  });
  root.addEventListener('click', e => {
    const del = e.target.closest('[data-fm-delete]');
    if (!del) return;
    const id = idOf(del), i = files.findIndex(f => f.id === id);
    files.splice(i, 1);
    if (openId === id) openId = files.length ? files[Math.min(i, files.length - 1)].id : 0;
    render();
  });

  /* drag a file by its handle to reorder (same pointer-event drag as the step table) */
  root.addEventListener('pointerdown', e => {
    const h = e.target.closest('[data-fm-handle]'), it = h && h.closest('.fm-item');
    if (!it) return;
    e.preventDefault();
    const list = it.parentElement;
    it.classList.add('is-dragging');
    h.setPointerCapture(e.pointerId);
    const move = ev => {
      const over = document.elementsFromPoint(ev.clientX, ev.clientY).map(el => el.closest && el.closest('.fm-item')).find(r => r && r !== it && r.parentElement === list);
      if (!over) return;
      const box = over.getBoundingClientRect(), after = ev.clientY > box.top + box.height / 2;
      if (after && over.nextElementSibling !== it) over.after(it);
      else if (!after && over.previousElementSibling !== it) over.before(it);
    };
    const end = () => {
      it.classList.remove('is-dragging');
      h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', end);
      h.removeEventListener('pointercancel', end); h.removeEventListener('lostpointercapture', end);
      const order = $$('.fm-item', list).map(el => +el.dataset.id);
      files.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end); h.addEventListener('lostpointercapture', end);
  });

  /* Save keeps the named files for the File Attachment cell (and the resident preview); unnamed ones are dropped. */
  const save = document.querySelector('.wt-dialog .rmx-overlay__footer .rmx-btn--primary');
  if (save) save.addEventListener('click', () => {
    try { sessionStorage.setItem('rmx-files', JSON.stringify(files.filter(f => f.name.trim()).map(f => ({ name: f.name.trim(), help: f.help, map: f.map, multi: f.multi })))); } catch (e) {}
  });

  render();
})();
