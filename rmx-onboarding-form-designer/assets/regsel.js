/* Register selector: the multi-select that sits above a register (Type, Status ...).
   <div class="rmx-field rmx-field--filter" data-rmx-regsel data-rmx-options="Past|Current|Future" data-rmx-target="#tenants" data-rmx-col="6">
     <span class="rmx-field__label">Status</span>
     <button type="button" class="rmx-field__box" data-rs-trigger><span class="rs-value">All selected</span><svg ...chevron></button>
   </div>
   Opens a panel under the field: a Select All checkbox beside a search box, one checkbox per option, and a footer with
   "N selected" and a blue "clear". Everything starts selected. The register's rows are shown or hidden by the text of
   column data-rmx-col, and the [data-rmx-count] line is recounted. */
(function () {
  var open = null;
  function ic(n) { return '<svg class="rmx-icon rmx-icon--16"><use href="#' + n + '"></use></svg>'; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function init(field) {
    var opts = (field.getAttribute('data-rmx-options') || '').split('|').filter(Boolean);
    var sel = opts.slice();
    var trigger = field.querySelector('[data-rs-trigger]'), val = field.querySelector('.rs-value');
    var tbl = document.querySelector(field.getAttribute('data-rmx-target') || ''), col = +field.getAttribute('data-rmx-col');
    var panel = document.createElement('div');
    panel.className = 'rs-panel'; panel.hidden = true; panel.setAttribute('data-rmx-component', 'Dropdown Menu');
    panel.innerHTML = '<div class="rs-top"><label class="rmx-check" data-checked="true" data-rs-all><span class="rmx-check__box">' + ic('check') + '</span></label>' +
      '<div class="rs-search"><input type="text" placeholder="Search" aria-label="Search"></div></div>' +
      '<div class="rs-list"></div>' +
      '<div class="rs-foot"><span data-rs-count></span><button type="button" class="rs-clear" data-rs-clear>clear</button></div>';
    document.body.appendChild(panel);
    var list = panel.querySelector('.rs-list'), search = panel.querySelector('input');

    function label() {
      val.textContent = sel.length === opts.length ? 'All selected' : sel.length === 0 ? '' : sel.length === 1 ? sel[0] : sel.length + ' selected';
      panel.querySelector('[data-rs-count]').textContent = sel.length + ' selected';
    }
    function render() {
      var q = search.value.trim().toLowerCase();
      list.innerHTML = opts.filter(function (o) { return !q || o.toLowerCase().indexOf(q) !== -1; }).map(function (o) {
        return '<label class="rmx-check" data-checked="' + (sel.indexOf(o) !== -1) + '" data-rs-opt="' + esc(o) + '"><span class="rmx-check__box">' + ic('check') + '</span><span class="rmx-text">' + esc(o) + '</span></label>';
      }).join('');
      panel.querySelector('[data-rs-all]').dataset.checked = String(sel.length === opts.length);
      label();
    }
    function apply() {
      if (tbl) {
        [].forEach.call(tbl.tBodies[0].rows, function (r) {
          var t = r.cells[col] ? r.cells[col].textContent.trim() : '';
          r.toggleAttribute('data-rs-hide', sel.indexOf(t) === -1);
        });
        recount(tbl);
      }
      field.dispatchEvent(new CustomEvent('rmx:regsel', { bubbles: true, detail: { values: sel.slice(), all: sel.length === opts.length } }));
    }
    function place() {
      var r = trigger.getBoundingClientRect();
      panel.style.cssText = 'position:fixed;z-index:2500;left:' + r.left + 'px;top:' + (r.bottom + 4) + 'px;width:' + Math.max(r.width, 248) + 'px';
    }
    function close() { panel.hidden = true; if (open === close) open = null; }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!panel.hidden) { close(); return; }
      if (open) open();
      search.value = ''; render(); place(); panel.hidden = false; open = close; search.focus();
    });
    search.addEventListener('input', render);
    panel.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-rs-clear]')) { sel = []; render(); apply(); return; }
      var all = e.target.closest('[data-rs-all]'), one = e.target.closest('[data-rs-opt]');
      if (all) sel = all.dataset.checked === 'true' ? [] : opts.slice();   // this panel flips the boxes itself (the click does not reach app.js)
      else if (one) { var n = one.dataset.rsOpt; sel = sel.indexOf(n) !== -1 ? sel.filter(function (x) { return x !== n; }) : sel.concat(n); }
      else return;
      sel = opts.filter(function (o) { return sel.indexOf(o) !== -1; });
      render(); apply();
    });
    render();
  }
  function recount(tbl) {
    var n = [].filter.call(tbl.tBodies[0].rows, function (r) { return !r.hidden && !r.hasAttribute('data-rs-hide'); }).length;
    [].forEach.call(document.querySelectorAll('[data-rmx-count="#' + tbl.id + '"]'), function (c) { c.textContent = n; });
  }
  document.addEventListener('click', function () { if (open) open(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) open(); });
  window.addEventListener('scroll', function (e) { if (open && !(e.target.closest && e.target.closest('.rs-panel'))) open(); }, true);
  /* a search in the same register recounts what is left after both filters */
  document.addEventListener('input', function (e) {
    var f = e.target.matches && e.target.matches('[data-rmx-filter]') && document.querySelector(e.target.getAttribute('data-rmx-filter'));
    if (f) setTimeout(function () { recount(f); }, 0);
  });
  [].forEach.call(document.querySelectorAll('[data-rmx-regsel]'), init);
})();
