/* Form designer page list.
   - Add Page adds an empty page under the others and selects it.
   - Clicking a page selects it: its name, help text and questions come back as you left them.
   - The kebab on a page offers Duplicate and Delete.
   Each page keeps its questions as DOM nodes (the designer's own question objects live on them), so switching is just
   moving them out of and back into the canvas. The form saved for the Portal Preview is every page's questions in page order. */
(function () {
  var list = document.querySelector('.fd-pages');
  if (!list) return;
  var stage = document.querySelector('.fd-stage');
  var nameIn = document.querySelector('.fd-pane__head .wt-w248 input');
  var helpIn = document.querySelector('.fd-pane__head .wt-w490 input');
  var EMPTY = '<span>Add fields to get started.</span><button type="button" class="rmx-btn rmx-btn--text" data-rmx-open="add-fields" data-rmx-component="Button"><svg class="rmx-icon"><use href="#add"></use></svg><span class="rmx-btn__label">Add Field</span></button>';
  var KEBAB = '<button type="button" class="fd-page__kebab" data-fd-kebab aria-label="Page actions" aria-haspopup="menu"><svg class="rmx-icon"><use href="#more-vert"></use></svg></button>';
  var DRAG = '<span data-rmx-todo="Reordering is not built in this prototype"><svg class="rmx-icon"><use href="#drag-indicator"></use></svg></span>';

  function rows() { return [].slice.call(list.querySelectorAll('.fd-page')); }
  function current() { return list.querySelector('.fd-page.is-current'); }
  function box() { return stage.querySelector('.fd-box'); }
  function qs() { return [].slice.call(box().querySelectorAll('.fd-q')); }
  function label(row) { return row.querySelector('.fd-page__name'); }

  /* the page on screen is "live" in the DOM; every other page keeps its state on its row */
  function stash(row) {
    row._p = { name: nameIn.value, help: helpIn.value, nodes: qs() };
    row._p.nodes.forEach(function (n) { n.remove(); });
  }
  function show(row) {
    var p = row._p || { name: '', help: '', nodes: [] };
    nameIn.value = p.name; helpIn.value = p.help;
    var b = box();
    if (p.nodes.length) { b.className = 'fd-box'; b.innerHTML = ''; p.nodes.forEach(function (n) { b.appendChild(n); }); }
    else { b.className = 'fd-box fd-box--empty'; b.innerHTML = EMPTY; }
    row._p = null;
    if (window.FD) { FD.renumber(); }
  }
  function select(row) {
    var cur = current();
    if (cur === row) return;
    if (window.FD) FD.closeEditors();
    if (cur) { stash(cur); cur.classList.remove('is-current'); }
    row.classList.add('is-current');
    show(row);
    if (window.FD) FD.save();
  }
  function newRow(name) {
    var r = document.createElement('div');
    r.className = 'fd-page';
    r.innerHTML = '<span class="fd-page__name"></span>' + KEBAB + DRAG;
    label(r).textContent = name;
    return r;
  }
  function addPage(name, state) {
    var r = newRow(name || 'Page ' + (rows().length + 1));
    r._p = state || { name: label(r).textContent, help: '', nodes: [] };
    var last = rows().pop();
    (last ? last : list.querySelector('.fd-pages__add')).after(r);
    select(r);
    return r;
  }

  var first = rows()[0];
  if (first) first.classList.add('is-current');

  /* keep the page list in step with the Page Name field */
  nameIn.addEventListener('input', function () { var c = current(); if (c) label(c).textContent = nameIn.value; });

  /* the Portal Preview reads the whole form */
  window.FD = window.FD || {};
  FD.pageQs = function (all) {
    var out = [];
    rows().forEach(function (r) { (r === current() ? all() : (r._p ? r._p.nodes : [])).forEach(function (q) { out.push(q); }); });
    return out;
  };

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-fd-addpage]')) { e.preventDefault(); addPage(); return; }
    var row = e.target.closest('.fd-page');
    if (row && !e.target.closest('[data-fd-kebab], [data-rmx-todo]')) select(row);
  });

  /* ---- kebab menu ---- */
  var menu = null;
  function close() { if (menu) { menu.remove(); menu = null; } }
  function open(btn) {
    close();
    var page = btn.closest('.fd-page'), r = btn.getBoundingClientRect();
    menu = document.createElement('div');
    menu.className = 'rmx-menu fd-page__menu'; menu.setAttribute('role', 'menu');
    menu.innerHTML = '<button type="button" data-value="Duplicate" role="menuitem">Duplicate</button><button type="button" data-value="Delete" role="menuitem">Delete</button>';
    menu.style.cssText = 'position:fixed;z-index:2000;min-width:140px;top:' + (r.bottom + 4) + 'px;left:' + Math.max(8, r.right - 140) + 'px';
    menu._page = page;
    document.body.appendChild(menu);
  }
  function snapshot(row) {   // the page's state, whether it is on screen or stashed
    if (row !== current()) return row._p;
    return { name: nameIn.value, help: helpIn.value, nodes: qs() };
  }
  function duplicate(row) {
    var p = snapshot(row), copy = newRow(label(row).textContent.trim() + ' Copy');
    var nodes = p.nodes.map(function (n) {
      var c = n.cloneNode(true);
      c._fd = JSON.parse(JSON.stringify(n._fd));   // the copy edits independently
      c.classList.remove('fd-q--active');
      return c;
    });
    copy._p = { name: label(copy).textContent, help: p.help, nodes: nodes };
    row.after(copy);
  }
  function remove(row) {
    var all = rows(), idx = all.indexOf(row), wasCurrent = row === current();
    if (wasCurrent) {
      if (window.FD) FD.closeEditors();
      qs().forEach(function (n) { n.remove(); });
    }
    row.remove();
    if (!rows().length) { addPage('Page 1'); return; }
    if (wasCurrent) { var next = rows()[Math.min(idx, rows().length - 1)]; next.classList.add('is-current'); show(next); if (window.FD) FD.save(); }
  }
  document.addEventListener('click', function (e) {
    var kebab = e.target.closest('[data-fd-kebab]');
    if (kebab) { e.stopPropagation(); if (menu && menu._page === kebab.closest('.fd-page')) close(); else open(kebab); return; }
    var item = menu && e.target.closest('.fd-page__menu [data-value]');
    if (item) {
      var page = menu._page, act = item.dataset.value;
      close();
      if (act === 'Delete') remove(page); else if (act === 'Duplicate') duplicate(page);
      return;
    }
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
})();
