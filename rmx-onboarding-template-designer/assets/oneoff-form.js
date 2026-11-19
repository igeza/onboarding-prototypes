/* Send New Form (one-off form): an overlay on the register (Prospects / Tenants).
   Figma "Send One-Off Form" 8071:51479. Opened by Send New Form (row menu, Bulk Actions) in send-onboarding.js via
   window.RMX_ONEOFF.open(names, kind). Not a template: nothing is added to Form Templates unless Save as Template is ticked.
   Layout: intro, a General tile (Form Name, Expiration Date, Require Approval, Save as Template, Send Message) and a Questions tile
   (Add Fields, then the questions with edit and delete).
   Add Fields and the field editor are the form designer's own: the Add Fields dialog (same groups, fields and styles) and the editor's
   fields (Question, Response Type, Help Text, Map to Rent Manager Field, Response Options, Required, Display conditionally) are read from
   rmx-onboarding-form-designer/screens/form-designer.html when the overlay first opens, so the two never drift apart. */
(function () {
  var SRC = document.currentScript && document.currentScript.src;
  var DESIGNER = new URL('../../rmx-onboarding-form-designer/screens/form-designer.html', SRC || location.href).href;
  var TYPES = { 'Yes/No': 'mc', 'Checkboxes': 'cb', 'Dropdown': 'dd', 'Short Answer': 'sa', 'Attachment': 'at', 'Paragraph': 'pa', 'Date': 'dt', 'Text Box': 'tx', 'File Upload': 'fl', 'Image Upload': 'iu' };
  var NAMES = { mc: 'Yes/No', cb: 'Checkboxes', dd: 'Dropdown', sa: 'Short Answer', at: 'Attachment', pa: 'Paragraph', dt: 'Date', tx: 'Text Box', fl: 'File Upload', iu: 'Image Upload' };
  var EXP = [' ', '3 days', '7 days', '14 days', '30 days', '60 days', '90 days'];
  function ic(n, c) { return '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>'; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function dd(label, opts, cur, cls) { return '<div class="rmx-field ' + (cls || '') + '" data-rmx-dropdown data-rmx-component="Input Field">' + (label ? '<span class="rmx-field__label">' + label + '</span>' : '') + '<button type="button" class="rmx-field__box" data-rmx-trigger><span class="wt-value" data-rmx-value>' + esc(cur) + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + opts.map(function (o) { return '<button type="button" data-value="' + esc(String(o).trim()) + '">' + esc(o) + '</button>'; }).join('') + '</div></div>'; }
  function chk(id, label, on, extra) { return '<label class="rmx-check" ' + (id ? 'id="' + id + '" ' : '') + (extra || '') + 'data-checked="' + (on ? 'true' : 'false') + '" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">' + label + '</span></label>'; }

  var css = document.createElement('style');
  css.textContent =
    '#oo-form { width: 680px; max-width: calc(100vw - 32px); }#oo-form.is-open { display: flex; flex-direction: column; max-height: calc(100vh - 32px); overflow: hidden; }' +
    '#oo-form .rmx-overlay__header { justify-content: space-between; flex: none; }#oo-form .rmx-overlay__footer { flex: none; }' +
    '.oo-hicons { display: flex; align-items: center; color: var(--icon-brand); }.oo-hicons button { display: inline-flex; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; }' +
    '#oo-form .oo-body { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--container-primary); }' +
    '#oo-form .oo-intro { margin: 0; color: var(--text-primary); font: var(--type-paragraph-s-regular); }' +
    '#oo-form .oo-row { display: flex; gap: var(--spacing-md); }#oo-form .oo-row > .rmx-field { flex: 1; min-width: 0; }#oo-form .oo-row > .oo-narrow { flex: none; width: 200px; }' +
    '#oo-form .rmx-field { width: 100%; }#oo-form .rmx-field__label { line-height: 16px; color: var(--text-primary); }' +
    '#oo-form .oo-sec { border: 1px solid var(--border-primary); border-radius: var(--radius-sm); }' +
    '#oo-form .oo-sechead { display: flex; align-items: center; justify-content: space-between; min-height: 36px; padding: 0 var(--spacing-xs); border-bottom: 2px solid var(--border-secondary); font: var(--type-paragraph-s-semibold); color: var(--text-secondary); }' +
    '#oo-form .oo-gen { display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); }#oo-form .oo-checks { display: flex; gap: var(--spacing-xl); align-items: center; }' +
    '#oo-form .oo-box { height: 96px; align-items: flex-start; padding: 0; }#oo-form .oo-box textarea { all: unset; box-sizing: border-box; width: 100%; height: 100%; padding: 8px; color: var(--text-secondary); font: var(--type-label-m-regular); }' +
    '#oo-form .oo-qs { display: flex; flex-direction: column; gap: var(--spacing-xs); padding: var(--spacing-md); }#oo-form .oo-empty { margin: 0; color: var(--text-disabled); font: var(--type-label-m-italic); }' +
    '#oo-form .fd-q { border: 1px solid transparent; border-radius: var(--radius-sm); cursor: default; }#oo-form .fd-q--active, #oo-form .fd-q:hover { border: 1px dashed var(--icon-disabled); }' +
    '#oo-form .fd-q:not(.fd-q--active) .fd-q__tools { visibility: hidden; }#oo-form .fd-q:hover .fd-q__tools, #oo-form .fd-q:focus-within .fd-q__tools, #oo-form .fd-q--active .fd-q__tools { visibility: visible; }' +
    '#oo-form .fd-q__body { pointer-events: none; }#oo-form .fd-q__tools button { pointer-events: auto; }#oo-form .fd-q--bad, #oo-form .fd-q--bad:hover { border: 1px dashed var(--border-error); }' +
    '#oo-form .fd-q__tools { position: absolute; top: 7px; right: 7px; display: inline-flex; gap: var(--spacing-xs); color: var(--icon-brand); }' +
    '#oo-form .fd-q__opts { display: flex; flex-direction: column; gap: var(--spacing-xs); }#oo-form .fd-q__opts--row { flex-direction: row; flex-wrap: wrap; gap: var(--spacing-xs) var(--spacing-xl); }#oo-form .fd-q__opts--checks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--spacing-xs) var(--spacing-xl); }' +
    '#oo-form .rmx-radio, .oo-pop .rmx-radio { display: inline-flex; align-items: center; gap: var(--spacing-xs); }' +
    '#oo-add-fields.is-open { display: flex; flex-direction: column; }' +
    '.fd-editor.oo-pop { z-index: 980; }.oo-pop .fd-fs { position: absolute; left: 0; right: 0; top: 100%; z-index: 5; }.oo-pop .fd-mapwrap { position: relative; }.oo-pop #oo-e-opts { display: flex; flex-direction: column; gap: var(--spacing-xs); }';
  document.head.appendChild(css);

  var PRESETS = {}, loaded = null;
  function loadDesigner() {
    if (loaded) return loaded;
    loaded = fetch(DESIGNER).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'), out = {};
      var add = doc.getElementById('add-fields'); out.add = add ? add.outerHTML : '';
      var fs = doc.getElementById('field-selector'); out.fs = fs ? fs.outerHTML : '';
      var m = /window\.FD_PRESETS\s*=\s*(\{[^}]*\})/.exec(html); try { if (m) PRESETS = (new Function('return ' + m[1]))(); } catch (e) {}
      var styles = ''; [].forEach.call(doc.querySelectorAll('style'), function (s) { styles += s.textContent + '\n'; });
      var keep = /(^|[\s,>])\.(af|fd-editor|fd-opt|fd-cond|fd-q|fd-chip|fd-fs|fs__|wt-|fd-close|fd-mapwrap|fd-tip)/;
      styles = styles.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');   /* the designer's responsive rules are not carried over */
      var rules = (styles.match(/[^{}@]+\{[^{}]*\}/g) || []).filter(function (r) { return keep.test(r.slice(0, r.indexOf('{'))); });
      out.css = rules.join('\n');
      var st = document.createElement('style'); st.setAttribute('data-oo-designer-css', ''); st.textContent = out.css; document.head.appendChild(st);
      return out;
    }).catch(function () { return { add: '', fs: '', css: '' }; });
    return loaded;
  }

  /* ---- the overlay ---- */
  var kind = 'Tenant', who = '', whoList = [], qs = [], editing = null, picked = [], D = { add: '', fs: '', css: '' };
  var dlg = document.createElement('div');
  dlg.className = 'rmx-overlay'; dlg.id = 'oo-form'; dlg.hidden = true; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Send New Form'); dlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  dlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send New Form</span><span class="oo-hicons"><button type="button" aria-label="Close" data-rmx-close>' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="oo-body"><p class="oo-intro">This form is a one-off form. It is not saved as a template unless you select Save as Template.</p>' +
    '<section class="oo-sec" data-rmx-component="Tile"><div class="oo-sechead">General</div><div class="oo-gen">' +
      '<div class="oo-row"><div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Form Name *</span><div class="rmx-field__box" id="oo-name-box"><input type="text" id="oo-name" aria-label="Form Name"></div></div>' + dd('Expiration Date', EXP, '7 days', 'oo-narrow') + '</div>' +
      '<div class="oo-checks">' + chk('oo-approval', 'Require Approval', false) + chk('oo-save-tpl', 'Save as Template', false) + '</div>' +
      '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send Message</span><div class="rmx-field__box oo-box"><textarea id="oo-msg" aria-label="Send Message"></textarea></div></div></div></section>' +
    '<section class="oo-sec" data-rmx-component="Tile"><div class="oo-sechead"><span>Questions</span><button type="button" class="rmx-btn rmx-btn--text" id="oo-add-fields-btn" data-rmx-component="Button">' + ic('add') + '<span class="rmx-btn__label">Add Fields</span></button></div><div class="oo-qs" id="oo-qs"></div></section></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="oo-send" data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(dlg);

  /* the questions, drawn like the designer's canvas */
  function preview(q) {
    var t = q.type, o = q.opts || {};
    var opts = (o.list && o.list.length ? o.list : (t === 'mc' ? ['Yes', 'No'] : ['Option 1', 'Option 2'])).filter(Boolean);
    if (t === 'mc') return '<div class="fd-q__opts fd-q__opts--row">' + opts.map(function (x, i) { return '<span class="rmx-radio" data-checked="' + (i === 0) + '"><span class="rmx-radio__dot"></span><span class="rmx-text">' + esc(x) + '</span></span>'; }).join('') + '</div>';
    if (t === 'cb') return '<div class="fd-q__opts fd-q__opts--checks">' + opts.map(function (x) { return '<span class="rmx-check" data-checked="false"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">' + esc(x) + '</span></span>'; }).join('') + '</div>';
    if (t === 'dd') return '<div class="rmx-field"><div class="rmx-field__box"><span class="wt-value"></span>' + ic('keyboard-arrow-down') + '</div></div>';
    if (t === 'pa' || t === 'tx') return '<div class="rmx-field"><div class="rmx-field__box" style="height:64px"></div></div>';
    if (t === 'dt') return '<div class="rmx-field"><div class="rmx-field__box"><span class="wt-value">mm/dd/yyyy</span>' + ic('calendar-today') + '</div></div>';
    if (t === 'fl' || t === 'iu' || t === 'at') return '<div class="rmx-field"><div class="rmx-field__box">' + ic('attach') + '<span class="wt-value">Choose a file or drag it here.</span></div></div>';
    return '<div class="rmx-field"><div class="rmx-field__box"></div></div>';
  }
  function render() {
    var box = document.getElementById('oo-qs');
    if (!qs.length) { box.innerHTML = '<p class="oo-empty">No fields yet. Choose Add Fields.</p>'; return; }
    box.innerHTML = qs.map(function (q, i) {
      return '<div class="fd-q' + (q.bad ? ' fd-q--bad' : '') + '" data-i="' + i + '"><div class="fd-q__head"><span class="fd-q__label">' + (i + 1) + '. ' + (q.title ? esc(q.title) : '<i>Untitled question</i>') + (q.required ? '*' : '') + '</span>' +
        '<span class="fd-q__tools"><button type="button" data-oo-edit aria-label="Edit question">' + ic('edit') + '</button><button type="button" data-oo-del aria-label="Delete question">' + ic('delete-filled') + '</button></span></div>' +
        (q.help ? '<p class="fd-q__help">' + esc(q.help) + '</p>' : '') + '<div class="fd-q__body">' + preview(q) + '</div></div>';
    }).join('');
  }

  /* ---- Add Fields: the designer's dialog ---- */
  function setupAdd() {
    if (document.getElementById('oo-add-fields')) return;
    var wrap = document.createElement('div'); wrap.innerHTML = D.add; var el = wrap.firstElementChild;
    if (!el) { wrap.innerHTML = '<div class="rmx-overlay" hidden><div class="af"><div class="rmx-overlay__header"><span class="rmx-type-heading-m-regular">Add Fields</span></div><div class="af__panes"><div class="af__avail"><p class="af__title">Available</p><div class="af__grp" data-af-grp><div class="af__grouphead"><button type="button" class="af__group" data-af-group aria-expanded="true">' + ic('keyboard-arrow-down') + '<span>Unmapped Fields</span></button></div><div class="af__items">' + Object.keys(TYPES).map(function (n) { return '<button type="button" class="af__item" data-af-item="' + n + '"><span>' + n + '</span>' + ic('add-circle') + '</button>'; }).join('') + '</div></div></div><div class="af__sel"><div class="af__selhead"><p class="af__title">Selected</p><button type="button" class="rmx-btn rmx-btn--text" data-af-clear>Clear All</button></div><div class="af__sellist" data-af-sellist></div></div></div><div class="rmx-overlay__footer"><button type="button" class="rmx-btn rmx-btn--primary" data-af-add data-rmx-close>Add</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-af-reset>Cancel</button></div></div></div>'; el = wrap.firstElementChild; }
    el.id = 'oo-add-fields'; el.hidden = true;
    /* Response Types and General Fields are one group, Unmapped Fields (as in the designer) */
    var gs = [].slice.call(el.querySelectorAll('[data-af-grp]')), by = function (n) { return gs.filter(function (g) { return g.querySelector('.af__group span').textContent === n; })[0]; };
    var a = by('Response Types'), b = by('General Fields');
    if (a && b) { a.querySelector('.af__group span').textContent = 'Unmapped Fields'; var bx = a.querySelector('.af__items'); [].slice.call(b.querySelectorAll('.af__items > *')).forEach(function (n) { bx.appendChild(n); }); b.parentNode.removeChild(b); }
    var pf = by('Prospect Fields'); if (pf && kind === 'Tenant') pf.querySelector('.af__group span').textContent = 'Tenant Fields';
    [].forEach.call(el.querySelectorAll('.af__items'), function (n) { n.hidden = true; }); [].forEach.call(el.querySelectorAll('[data-af-group]'), function (n) { n.setAttribute('aria-expanded', 'false'); });
    document.body.appendChild(el);
  }
  function drawSelected(el) {
    var list = el.querySelector('[data-af-sellist]');
    list.innerHTML = picked.map(function (n, i) { return '<div class="af__selrow" data-i="' + i + '"><span>' + esc(n) + '</span><button type="button" class="fd-opt__del" data-oo-unpick aria-label="Remove">' + ic('delete-filled') + '</button></div>'; }).join('');
    [].forEach.call(el.querySelectorAll('[data-af-item]'), function (b) { b.classList.toggle('is-picked', picked.indexOf(b.getAttribute('data-af-item')) >= 0); });
  }
  function openAdd() {
    setupAdd(); var el = document.getElementById('oo-add-fields'); picked = []; drawSelected(el);
    RMX.openOverlay('oo-add-fields');
  }
  function typeFor(name) { return PRESETS[name] || TYPES[name] || 'sa'; }
  document.addEventListener('click', function (e) {
    var el = document.getElementById('oo-add-fields'); if (!el || !el.contains(e.target)) return;
    var g = e.target.closest('[data-af-group]');
    if (g) { var open = g.getAttribute('aria-expanded') === 'true'; g.setAttribute('aria-expanded', String(!open)); g.closest('[data-af-grp]').querySelector('.af__items').hidden = open; return; }
    var all = e.target.closest('[data-af-selectall]');
    if (all) { [].forEach.call(all.closest('[data-af-grp]').querySelectorAll('[data-af-item]'), function (b) { var n = b.getAttribute('data-af-item'); if (picked.indexOf(n) < 0) picked.push(n); }); drawSelected(el); return; }
    var it = e.target.closest('[data-af-item]');
    if (it) { var nm = it.getAttribute('data-af-item'), k = picked.indexOf(nm); if (k < 0) picked.push(nm); else picked.splice(k, 1); drawSelected(el); return; }
    var un = e.target.closest('[data-oo-unpick]');
    if (un) { picked.splice(+un.closest('[data-i]').getAttribute('data-i'), 1); drawSelected(el); return; }
    if (e.target.closest('[data-af-clear]')) { picked = []; drawSelected(el); return; }
    if (e.target.closest('[data-af-add]')) {
      picked.forEach(function (n) {
        var isType = TYPES.hasOwnProperty(n); qs.push({ title: isType ? '' : n.replace(/ – /g, ' '), type: typeFor(n), preset: isType ? '' : n, help: '', map: '', required: false, cond: null, opts: { list: [] } });
      });
      picked = []; render();
    }
  }, true);

  /* ---- the field editor: the designer's popup, beside the question ---- */
  var ed = document.createElement('div');
  ed.className = 'fd-editor oo-pop'; ed.hidden = true; ed.setAttribute('data-rmx-component', 'Field Editor');
  document.body.appendChild(ed);
  function optRows(q) {
    var list = (q.opts && q.opts.list && q.opts.list.length) ? q.opts.list.slice() : (q.type === 'mc' ? ['Yes', 'No'] : ['Option 1', 'Option 2']);
    var fixed = q.type === 'mc';
    return list.map(function (v, i) { return '<div class="fd-opt' + (q.type === 'dd' ? ' fd-opt--plain' : '') + '" data-oo-opt>' + (q.type === 'mc' ? '<span class="rmx-radio" data-checked="false"><span class="rmx-radio__dot"></span></span>' : q.type === 'cb' ? '<label class="rmx-check" data-checked="false"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span></label>' : '') + '<div class="wt-flex"><div class="rmx-field"><div class="rmx-field__box"><input type="text" class="oo-opt" value="' + esc(v) + '" aria-label="Option ' + (i + 1) + '"></div></div></div>' + (!fixed && list.length > 2 ? '<button type="button" class="fd-opt__del" data-oo-delopt aria-label="Remove option">' + ic('delete-filled') + '</button>' : '') + '</div>'; }).join('');
  }
  function place() {
    var qEl = dlg.querySelector('.fd-q[data-i="' + editing + '"]'), pen = qEl && qEl.querySelector('[data-oo-edit]'); if (!pen) return;
    var r = pen.getBoundingClientRect(), w = ed.offsetWidth || 540; ed.style.maxHeight = ''; var need = ed.offsetHeight, below = window.innerHeight - (r.bottom + 6) - 8, above = r.top - 6 - 8, top;
    if (need <= below || below >= above) { top = r.bottom + 6; ed.style.maxHeight = Math.max(160, below) + 'px'; }
    else { var h = Math.min(need, above); top = r.top - 6 - h; ed.style.maxHeight = Math.max(100, above) + 'px'; }
    ed.style.top = Math.max(8, top) + 'px'; ed.style.left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8)) + 'px';
  }
  function paintEditor() {
    var q = qs[editing], t = q.type, hasOpts = t === 'mc' || t === 'cb' || t === 'dd', prior = qs.slice(0, editing).map(function (x, i) { return { i: i, x: x }; }).filter(function (o) { return o.x.type === 'mc' && o.x.title; });
    ed.innerHTML = '<div class="fd-editor__head"><span class="fd-editor__title">Question ' + (editing + 1) + '</span></div>' +
      '<div class="fd-editor__row"><div class="wt-flex"><div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Question *</span><div class="rmx-field__box"><input type="text" id="oo-e-title" value="' + esc(q.title) + '" aria-label="Question"></div></div></div>' +
      '<div class="wt-flex"><div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field" id="oo-e-type"><span class="rmx-field__label">Response Type</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="wt-value" data-rmx-value>' + esc(NAMES[t] || 'Short Answer') + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + ['Date', 'Yes/No', 'Checkboxes', 'Dropdown', 'File Upload', 'Image Upload', 'Short Answer', 'Paragraph', 'Text Box', 'Attachment'].map(function (n) { return '<button type="button" data-value="' + n + '">' + n + '</button>'; }).join('') + '</div></div></div></div>' +
      (t === 'tx' ? '' : '<div class="wt-w-fill"><div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label wt-info">Help Text</span><div class="rmx-field__box wt-textbox"><textarea class="wt-textarea" id="oo-e-help" aria-label="Help Text" rows="3">' + esc(q.help) + '</textarea></div></div></div>' +
        '<div class="wt-w-fill fd-mapwrap"><div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Map to Rent Manager Field</span><button type="button" class="rmx-field__box wt-mapfield" id="oo-e-mapopen" aria-haspopup="listbox"><span class="wt-value" id="oo-e-map">' + esc(q.map) + '</span>' + ic('keyboard-arrow-down') + '</button></div>' + (D.fs || '').replace(' id="field-selector"', ' id="oo-fs"').replace(/ id="fs-tree"/, ' id="oo-fs-tree"').replace('data-rmx-filter="#fs-tree"', 'data-rmx-filter="#oo-fs-tree"') + '</div>') +
      (hasOpts ? '<div class="fd-editor__opts"><div class="fd-editor__optshead"><span>Response Options</span></div><div id="oo-e-opts">' + optRows(q) + '</div>' + (t === 'mc' ? '' : '<div><button type="button" class="rmx-btn rmx-btn--text" id="oo-e-addopt"><span class="rmx-btn__label">Add Option</span></button></div>') + '</div>' : '') +
      (t === 'tx' ? '' : chk('oo-e-req', 'Required', q.required) + (prior.length ? chk('oo-e-cond', 'Display conditionally', !!q.cond) +
        '<div class="fd-cond" id="oo-e-condrow"' + (q.cond ? '' : ' hidden') + '><span>If</span><div class="wt-flex">' + dd('', prior.map(function (o) { return o.x.title; }), q.cond && qs[q.cond.q] ? qs[q.cond.q].title : prior[0].x.title, '') + '</div><span>is</span><div class="wt-flex">' + dd('', ['Yes', 'No'], q.cond ? q.cond.val : 'Yes', '') + '</div></div>' : ''));
    if (window.RMX && RMX.dropdowns) RMX.dropdowns();
    place();
  }
  function harvest() {
    var q = qs[editing]; if (!q) return; var g = function (id) { return document.getElementById(id); };
    q.title = (g('oo-e-title') || {}).value || ''; q.help = g('oo-e-help') ? g('oo-e-help').value : q.help; q.map = g('oo-e-map') ? g('oo-e-map').textContent.trim() : q.map;
    q.required = !!(g('oo-e-req') && g('oo-e-req').dataset.checked === 'true'); q.bad = false;
    var list = [].map.call(ed.querySelectorAll('.oo-opt'), function (i) { return i.value.trim(); }).filter(Boolean); if (list.length) q.opts = { list: list };
    var c = g('oo-e-cond'); if (c && c.dataset.checked === 'true') { var f = ed.querySelectorAll('#oo-e-condrow [data-rmx-value]'); var title = f[0].textContent.trim(); var idx = -1; qs.forEach(function (x, i) { if (i < editing && x.type === 'mc' && x.title === title) idx = i; }); q.cond = idx >= 0 ? { q: idx, val: f[1].textContent.trim() } : null; } else q.cond = null;
  }
  function live() { harvest(); render(); var el = dlg.querySelector('.fd-q[data-i="' + editing + '"]'); if (el) el.classList.add('fd-q--active'); place(); }
  function openEditor(i) {
    if (editing !== null) { harvest(); }
    editing = i; render(); var el = dlg.querySelector('.fd-q[data-i="' + i + '"]'); if (el) el.classList.add('fd-q--active');
    ed.hidden = false; paintEditor();
  }
  function closeEditor() { if (editing === null) return; harvest(); ed.hidden = true; editing = null; render(); }
  ed.addEventListener('input', function () { live(); });
  ed.addEventListener('rmx:select', function (e) {
    var f = e.target.closest && e.target.closest('#oo-e-type');
    setTimeout(function () {
      if (f) { harvest(); var q = qs[editing]; q.type = TYPES[f.querySelector('[data-rmx-value]').textContent.trim()] || 'sa'; q.opts = q.type === 'mc' ? { list: ['Yes', 'No'] } : { list: [] }; render(); var el = dlg.querySelector('.fd-q[data-i="' + editing + '"]'); if (el) el.classList.add('fd-q--active'); paintEditor(); }
      else live();
    }, 0);
  });
  ed.addEventListener('click', function (e) {
    var q = qs[editing];
    if (e.target.closest('#oo-e-mapopen')) { var p = document.getElementById('oo-fs'); if (p) p.hidden = !p.hidden; return; }
    var tg = e.target.closest('[data-fs-toggle]'); if (tg) { var nx = tg.nextElementSibling; if (nx) { nx.hidden = !nx.hidden; tg.classList.toggle('fs__row--closed', nx.hidden); } return; }
    var row = e.target.closest('[data-fs-path]'); if (row) { document.getElementById('oo-e-map').textContent = row.getAttribute('data-fs-path').replace(/&gt;/g, '>'); document.getElementById('oo-fs').hidden = true; live(); return; }
    if (e.target.closest('#oo-e-addopt')) { harvest(); var cur = (q.opts && q.opts.list && q.opts.list.length) ? q.opts.list : ['Option 1', 'Option 2']; q.opts = { list: cur.concat(['Option ' + (cur.length + 1)]) }; paintEditor(); live(); return; }
    var del = e.target.closest('[data-oo-delopt]'); if (del) { harvest(); var rows = [].slice.call(ed.querySelectorAll('[data-oo-opt]')), i = rows.indexOf(del.closest('[data-oo-opt]')); var l = q.opts.list.slice(); l.splice(i, 1); q.opts = { list: l }; paintEditor(); live(); return; }
    if (e.target.closest('#oo-e-cond')) { setTimeout(function () { var on = document.getElementById('oo-e-cond').dataset.checked === 'true'; document.getElementById('oo-e-condrow').hidden = !on; live(); }, 0); return; }
    if (e.target.closest('#oo-e-req')) setTimeout(live, 0);
  });
  /* the popup closes when you click anywhere else (dropdown menus and the field tree belong to it) */
  document.addEventListener('mousedown', function (e) {
    if (editing === null || ed.hidden) return;
    if (ed.contains(e.target) || e.target.closest('.rmx-menu-layer, .rmx-menu') || e.target.closest('[data-oo-edit]')) return;
    closeEditor();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeEditor(); });
  window.addEventListener('resize', function () { if (editing !== null) place(); });

  /* ---- wiring ---- */
  dlg.addEventListener('click', function (e) {
    if (e.target.closest('#oo-add-fields-btn')) { loadDesigner().then(function () { openAdd(); }); return; }
    var qEl = e.target.closest('.fd-q'); if (!qEl) return;
    [].forEach.call(dlg.querySelectorAll('.fd-q'), function (x) { x.classList.toggle('fd-q--active', x === qEl); });   /* click shows the editing controls, as on the designer canvas */
    var i = +qEl.getAttribute('data-i');
    if (e.target.closest('[data-oo-del]')) { closeEditor(); qs.splice(i, 1); render(); return; }
    if (e.target.closest('[data-oo-edit]')) { loadDesigner().then(function () { openEditor(i); }); }
  });
  dlg.addEventListener('input', function (e) { var b = e.target.closest('.rmx-field__box'); if (b) b.style.borderColor = ''; });
  document.getElementById('oo-send').addEventListener('click', function () {
    var ok = true, nm = document.getElementById('oo-name');
    document.getElementById('oo-name-box').style.borderColor = '';
    if (!nm.value.trim()) { document.getElementById('oo-name-box').style.borderColor = 'var(--border-error)'; ok = false; }
    qs.forEach(function (q) { q.bad = !q.title.trim(); if (q.bad) ok = false; });
    if (!qs.length) { var em = document.querySelector('#oo-qs .oo-empty'); if (em) em.style.color = 'var(--text-error)'; ok = false; }
    render();
    if (!ok) return;
    var name = nm.value.trim(), saveT = document.getElementById('oo-save-tpl').dataset.checked === 'true', due = (dlg.querySelector('.oo-narrow [data-rmx-value]').textContent || '').trim();
    try {
      var sent = JSON.parse(sessionStorage.getItem('rmx-sent-forms') || '[]'); sent.push({ form: name, due: due }); sessionStorage.setItem('rmx-sent-forms', JSON.stringify(sent));
      var reg = JSON.parse(sessionStorage.getItem('rmx-oneoff-sent') || '[]'), dd = new Date(), p2 = function (x) { return String(x).padStart(2, '0'); };
      (whoList.length ? whoList : [kind]).forEach(function (n) { reg.push({ name: n, form: name, date: p2(dd.getMonth() + 1) + '/' + p2(dd.getDate()) + '/' + String(dd.getFullYear()).slice(2), status: 'Sent' }); });
      sessionStorage.setItem('rmx-oneoff-sent', JSON.stringify(reg));
      if (saveT) {
        var forms = JSON.parse(sessionStorage.getItem('rmx-forms') || '[]'), d = new Date(), pad = function (x) { return String(x).padStart(2, '0'); };
        forms.push({ name: name, type: kind, props: 'All Properties', approval: document.getElementById('oo-approval').dataset.checked === 'true', publish: false, date: pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + String(d.getFullYear()).slice(2) });
        sessionStorage.setItem('rmx-forms', JSON.stringify(forms));
      }
    } catch (er) {}
    RMX.closeOverlay(dlg);
    if (window.RMX && RMX.toast) RMX.toast('"' + name + '" sent to ' + who + (saveT ? ' and saved as a template' : '') + '.', 'success');
  });
  window.RMX_ONEOFF = { open: function (names, k) {
    whoList = names.slice(); kind = k || 'Tenant'; who = names.length > 1 ? names.length + ' ' + kind.toLowerCase() + 's' : (names[0] || kind); qs = []; editing = null;
    var old = document.getElementById('oo-add-fields'); if (old) old.parentNode.removeChild(old);
    document.getElementById('oo-name').value = ''; document.getElementById('oo-msg').value = ''; document.getElementById('oo-name-box').style.borderColor = '';
    dlg.querySelector('.oo-narrow [data-rmx-value]').textContent = '7 days'; document.getElementById('oo-approval').dataset.checked = 'false'; document.getElementById('oo-save-tpl').dataset.checked = 'false';
    render(); loadDesigner().then(function (d) { D = d; });
    RMX.openOverlay('oo-form'); if (RMX.dropdowns) RMX.dropdowns();
  } };
})();
