/* Smart Agents canvas behaviour — prototype-local. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const stage = $('[data-ag-stage]'), svg = $('[data-ag-wires]'), val = $('[data-ag-zoomval]');
  let z = 100;

  /* ---- connectors: drawn from the real node positions, so collapsing a node reflows them ---- */
  const N = id => $('[data-node="' + id + '"]');
  function box(el) {
    const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = z / 100;
    return { l: (r.left - s.left) / k, r: (r.right - s.left) / k, t: (r.top - s.top) / k, b: (r.bottom - s.top) / k, cx: (r.left + r.width / 2 - s.left) / k, cy: (r.top + r.height / 2 - s.top) / k };
  }
  function link(a, b) {
    const A = box(N(a)), B = box(N(b)), y1 = A.b, y2 = B.t, d = y2 - y1;
    /* straight where possible: if the two nodes overlap horizontally, run one vertical line through the overlap */
    const lo = Math.max(A.l, B.l) + 8, hi = Math.min(A.r, B.r) - 8;
    if (lo <= hi) { const x = Math.min(hi, Math.max(lo, A.cx)); return 'M' + x + ' ' + y1 + 'V' + y2; }
    /* otherwise: down, across, down (two bends with rounded corners). Lines merging into one node bend just above it, so they join together. */
    const x1 = A.cx, x2 = B.cx, sx = x2 > x1 ? 1 : -1;
    const merging = edges.filter(e => e.b === b && !e.loop).length > 1;
    const ym = merging ? y2 - 36 : y1 + d / 2;
    const r = Math.max(0, Math.min(12, Math.abs(x2 - x1) / 2, ym - y1, y2 - ym));
    return 'M' + x1 + ' ' + y1 + 'V' + (ym - r) + 'Q' + x1 + ' ' + ym + ' ' + (x1 + sx * r) + ' ' + ym + 'H' + (x2 - sx * r) + 'Q' + x2 + ' ' + ym + ' ' + x2 + ' ' + (ym + r) + 'V' + y2;
  }
  /* the workflow's connections: what the chart draws AND what the inspector lists */
  const edges = [['t1', 'onb'], ['onb', 'c1'], ['onb', 'c2'], ['onb', 'c3'], ['c1', 'a1'], ['c2', 'a2'], ['c3', 'a3'], ['a1', 't2'], ['a2', 't2'], ['a3', 't2'], ['t2', 'n'], ['onb', 't2', 'loop']]
    .map(e => ({ a: e[0], b: e[1], loop: e[2] === 'loop' }));
  function draw() {
    let d = edges.map(e => {
      if (!e.loop) return '<path d="' + link(e.a, e.b) + '"/>';
      const O = box(N(e.a)), T = box(N(e.b));   /* the dashed loop from the checklist round to the closing trigger */
      const y0 = O.t + Math.min(252, (O.b - O.t) / 2), r = 12;   /* out of the checklist, left, down, back in: two rounded bends */
      return '<path d="M' + O.l + ' ' + y0 + 'H' + (13 + r) + 'Q13 ' + y0 + ' 13 ' + (y0 + r) + 'V' + (T.cy - r) + 'Q13 ' + T.cy + ' ' + (13 + r) + ' ' + T.cy + 'H' + T.l + '"/>';
    }).join('');
    svg.innerHTML = d;
    sizeWrap();
  }
  /* the stage is scaled with a transform, so a wrapper carries its scaled size and the canvas scrolls (and shrinks) with the zoom */
  const canvas = $('.ag-canvas'), wrap = document.createElement('div');
  wrap.className = 'ag-zoomwrap'; stage.parentNode.insertBefore(wrap, stage); wrap.appendChild(stage);
  function sizeWrap() { wrap.style.width = stage.offsetWidth * z / 100 + 'px'; wrap.style.height = stage.offsetHeight * z / 100 + 'px'; canvas.style.setProperty('--ag-dot', 39.3 * z / 100 + 'px'); }
  draw();
  window.addEventListener('resize', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  /* ---- zoom ---- */
  const ZMIN = 25, ZMAX = 200;
  /* zoom about a point (viewport coordinates of the canvas), so what is under the cursor stays put */
  function setZoom(nz, cx, cy) {
    nz = Math.min(ZMAX, Math.max(ZMIN, nz)); if (nz === z) return;
    const r = canvas.getBoundingClientRect(); if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    const px = (canvas.scrollLeft + cx) / (z / 100), py = (canvas.scrollTop + cy) / (z / 100);
    z = nz; stage.style.transform = 'scale(' + z / 100 + ')'; val.textContent = Math.round(z) + '%';
    sizeWrap(); draw();
    canvas.scrollLeft = px * z / 100 - cx; canvas.scrollTop = py * z / 100 - cy;
  }
  $$('[data-ag-zoom]').forEach(b => b.addEventListener('click', () => { const d = +b.dataset.agZoom; setZoom(d === 0 ? 100 : z + d); }));
  /* trackpad pinch (a wheel event with ctrlKey) and Ctrl/Cmd + mouse wheel */
  canvas.addEventListener('wheel', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    setZoom(z * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.01)), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  /* Safari trackpad pinch */
  let z0 = 100;
  canvas.addEventListener('gesturestart', e => { e.preventDefault(); z0 = z; });
  canvas.addEventListener('gesturechange', e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); setZoom(z0 * e.scale, e.clientX - r.left, e.clientY - r.top); });

  /* ---- select / collapse Onboarding nodes; select a step ---- */
  const paneOnb = $('[data-ag-pane="onboarding"]'), paneStep = $('[data-ag-pane="step"]'), paneTrig = $('[data-ag-pane="trigger"]'), paneCond = $('[data-ag-pane="condition"]');
  const palSteps = $('.ag-pal-steps');
  let curOnb = N('onb');
  function showPane(which) { paneOnb.hidden = which !== 'onboarding'; paneStep.hidden = which !== 'step'; paneTrig.hidden = which !== 'trigger'; paneCond.hidden = which !== 'condition'; palSteps.hidden = which !== 'onboarding' && which !== 'step'; }
  /* The Onboarding steps list is only offered while an Onboarding node (or one of its steps) is selected. */
  function clearSel() { $$('.ag-step, .ag-node').forEach(x => x.classList.remove('is-selected')); }
  function selectOnb(n, stepEl) {
    curOnb = n; if (!stepEl) renderConns(n);
    $$('.ag-step').forEach(x => x.classList.toggle('is-selected', x === stepEl));
    $$('.ag-node').forEach(o => o.classList.toggle('is-selected', !stepEl && o === n));
    if (stepEl) { renderStep(stepEl); showPane('step'); } else showPane('onboarding');
  }
  $$('[data-ag-onb]').forEach(n => n.addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.closest('[data-ag-chev]')) { n.classList.toggle('is-collapsed'); draw(); return; }
    selectOnb(n, e.target.closest('.ag-step'));
  }));
  /* any other node, or empty canvas, deselects Onboarding */
  $$('.ag-node[data-node]:not([data-ag-onb])').forEach(n => n.addEventListener('click', e => {
    e.stopPropagation(); clearSel();
    if (n.classList.contains('ag-node--trigger')) { n.classList.add('is-selected'); renderTrigger(n); showPane('trigger'); }
    else if (n.classList.contains('ag-node--condition')) { n.classList.add('is-selected'); renderCondition(n); showPane('condition'); }
    else { n.classList.add('is-selected'); showPane('none'); }
  }));
  $('.ag-canvas').addEventListener('click', () => { clearSel(); showPane('none'); });

  /* ---- add a step to the bottom of an Onboarding node: click it in the palette, or drag it onto a node ---- */
  const SUBS = { 'Account Information': 'Name, phone, email, and mailing address', 'Payment Setup': 'Save a payment method and setup autopay', 'Make a Payment': 'Based on property payment policies', 'Renters Insurance': 'Allow enrollment in master policy', 'Form': 'Pet Addendum', 'File Upload': 'New File' };
  let stepSeq = 100;
  function addStep(type, node) {
    /* clicked from the palette with a step selected: the new step goes right after it; otherwise to the bottom of the node */
    const after = !node ? $('.ag-step.is-selected') : null;
    node = node || (after && after.closest('[data-ag-onb]')) || curOnb; if (!node || !SUBS[type]) return;
    const el = document.createElement('div');
    el.className = 'ag-step'; el.draggable = true; el.dataset.step = 's' + (++stepSeq); el.dataset.stype = type;
    el.innerHTML = '<div class="ag-step__text"><span class="ag-step__title rmx-type-paragraph-s-semibold"></span><span class="ag-step__sub rmx-type-label-s-regular"></span></div><svg class="rmx-icon"><use href="#drag-dots"></use></svg>';
    $('.ag-step__title', el).textContent = type; $('.ag-step__sub', el).textContent = SUBS[type];
    if (after && after.parentNode === $('.ag-node__steps', node)) after.after(el); else $('.ag-node__steps', node).appendChild(el);
    node.classList.remove('is-collapsed');
    selectOnb(node, el); draw();
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  $$('[data-pal]').forEach(b => {
    b.addEventListener('click', () => addStep(b.dataset.pal));
    b.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', b.dataset.pal); e.dataTransfer.effectAllowed = 'copy'; });
  });
  /* ---- move a step within its Onboarding node, or into another one, by dragging it ---- */
  let dragStep = null;
  const line = document.createElement('div'); line.className = 'ag-drop-line';
  function dropRef(node, y) {   /* the step the dragged one would sit above, or null for the bottom */
    return $$('.ag-step', node).filter(s => s !== dragStep).find(s => { const r = s.getBoundingClientRect(); return y < r.top + r.height / 2; }) || null;
  }
  $$('.ag-step').forEach(s => { s.draggable = true; });
  stage.addEventListener('dragstart', e => {
    const s = e.target.closest && e.target.closest('.ag-step'); if (!s) return;
    dragStep = s; e.dataTransfer.setData('text/plain', '__step__'); e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => s.classList.add('is-dragging'), 0);
  });
  stage.addEventListener('dragend', () => { if (dragStep) dragStep.classList.remove('is-dragging'); dragStep = null; line.remove(); $$('.is-droptarget').forEach(n => n.classList.remove('is-droptarget')); });
  $$('[data-ag-onb]').forEach(n => {
    n.addEventListener('dragover', e => {
      e.preventDefault(); e.dataTransfer.dropEffect = dragStep ? 'move' : 'copy'; n.classList.add('is-droptarget');
      if (dragStep && !n.classList.contains('is-collapsed')) { const box = $('.ag-node__steps', n), ref = dropRef(n, e.clientY); if (ref) box.insertBefore(line, ref); else box.appendChild(line); }
    });
    n.addEventListener('dragleave', e => { if (!n.contains(e.relatedTarget)) { n.classList.remove('is-droptarget'); line.remove(); } });
    n.addEventListener('drop', e => {
      e.preventDefault(); e.stopPropagation(); n.classList.remove('is-droptarget');
      if (dragStep) {
        const box = $('.ag-node__steps', n), ref = n.classList.contains('is-collapsed') ? null : dropRef(n, e.clientY), s = dragStep;
        line.remove(); box.insertBefore(s, ref); s.classList.remove('is-dragging'); dragStep = null;
        selectOnb(n, s); draw(); return;
      }
      addStep(e.dataTransfer.getData('text/plain'), n);
    });
  });

  /* ---- step settings: the same settings the Onboarding Template designer offers per step type ---- */
  const FORMS = ['Pet Addendum', 'Pet Information', 'Gym Access', 'Notice to Vacate'];
  const CALL = { 'Payment Setup': 'Payment Setup step displays Autopay options based on Charges & Payments settings.', 'Make a Payment': 'Make a Payment reflects payment options based on Payment Policies set for each property.' };
  const state = new Map(); let curEl = null;
  const esc = t => { const d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; };
  const ic = (n, c) => '<svg class="' + (c || 'rmx-icon') + '"><use href="#' + n + '"></use></svg>';
  function stateOf(el) {
    if (!state.has(el)) {
      const type = el.dataset.stype, sub = $('.ag-step__sub', el).textContent;
      state.set(el, { type, name: $('.ag-step__title', el).textContent, required: false, self: false,
        form: type === 'Form' ? sub : '',
        files: type === 'File Upload' ? [{ name: sub, help: '', req: false, multi: false }] : [] });
    }
    return state.get(el);
  }
  function dd(label, val, opts, k) {
    return '<div class="rmx-field" data-ag-dd data-k="' + k + '" data-rmx-component="Input Field">' + (label ? '<span class="rmx-field__label">' + label + '</span>' : '') +
      '<button type="button" class="rmx-field__box" data-ag-trigger><span data-ag-value>' + esc(val) + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-ag-menu hidden>' +
      opts.map(o => '<button type="button" data-value="' + esc(o) + '"' + (o === val ? ' aria-selected="true"' : '') + '>' + esc(o) + '</button>').join('') + '</div></div>';
  }
  const chk = (k, label, on, extra) => '<div class="ag-check"><label class="rmx-check" data-k="' + k + '" data-checked="' + !!on + '" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon rmx-icon--16') + '</span><span class="rmx-text">' + label + '</span></label>' + (extra || '') + '</div>';
  function renderStep(el) {
    curEl = el; const s = stateOf(el);
    let h = '<div class="ag-insp__head rmx-type-label-s-regular"><span data-ag-headname>' + esc(s.name || 'Untitled step') + '</span><button type="button" class="ag-trash" aria-label="Delete step" data-act="del-step">' + ic('delete-filled') + '</button></div>';
    /* Note (Payment Setup / Make a Payment), above Settings */
    if (CALL[s.type]) h += '<div class="ag-sec"><div class="ag-sec__body"><p class="ag-note rmx-type-paragraph-s-regular">' + CALL[s.type] + '</p></div></div>';
    /* Settings */
    h += '<div class="ag-sec"><div class="ag-sec__head rmx-type-paragraph-s-semibold">Settings</div><div class="ag-sec__body">';
    h += '<div class="rmx-field' + (s.name.trim() ? '' : ' ag-invalid') + '" data-rmx-component="Input Field"><span class="rmx-field__label">Step Name *</span><div class="rmx-field__box"><input type="text" data-k="name" value="' + esc(s.name) + '" aria-label="Step Name" aria-required="true"></div></div>';
    if (s.type === 'Form') h += dd('Select Form', s.form, FORMS.includes(s.form) ? FORMS : FORMS.concat(s.form), 'form');
    if (s.type === 'Renters Insurance') h += chk('self', 'Allow prospects to self-enroll in master policy', s.self);
    h += chk('required', 'Required', s.required);
    h += '</div></div>';
    /* File Request: one file per File Upload step */
    if (s.type === 'File Upload') {
      const f = s.files[0];
      h += '<div class="ag-sec"><div class="ag-sec__head rmx-type-paragraph-s-semibold">File Request</div><div class="ag-sec__body"><p class="ag-desc rmx-type-label-s-regular">Request a file from the resident. They\u2019ll see the file name and help text when uploading.</p>' +
        '<div class="ag-file ag-file--plain" data-i="0">' +
        '<div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">File Name *</span><div class="rmx-field__box"><input type="text" data-k="file-name" value="' + esc(f.name) + '" aria-label="File Name"></div></div>' +
        '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Help Text ' + ic('info', 'rmx-icon rmx-icon--16') + '</span><div class="rmx-field__box ag-textarea"><textarea data-k="file-help" aria-label="Help Text">' + esc(f.help) + '</textarea></div></div>' +
        chk('file-req', 'Required', f.req) + chk('file-multi', 'Allow multiple uploads', f.multi) + '</div></div></div>';
    }
    paneStep.innerHTML = h;
  }
  function syncCard(el) {
    const s = stateOf(el); $('.ag-step__title', el).textContent = s.name || 'Untitled step';
    if (s.type === 'Form' && s.form) $('.ag-step__sub', el).textContent = s.form;
    if (s.type === 'File Upload' && s.files[0] && s.files[0].name) $('.ag-step__sub', el).textContent = s.files[0].name;
  }
  const setHead = s => { const n = $('[data-ag-headname]', paneStep); if (n) n.textContent = s.name || 'Untitled step'; };
  /* delegated handlers for the step pane */
  paneStep.addEventListener('input', e => {
    const s = stateOf(curEl), k = e.target.dataset.k, fi = e.target.closest('.ag-file');
    if (k === 'name') { s.name = e.target.value; e.target.closest('.rmx-field').classList.toggle('ag-invalid', !s.name.trim()); setHead(s); syncCard(curEl); }
    if (fi && k === 'file-name') { s.files[+fi.dataset.i].name = e.target.value; $('.ag-file__title', fi).textContent = e.target.value || 'New File'; syncCard(curEl); }
    if (fi && k === 'file-help') s.files[+fi.dataset.i].help = e.target.value;
  });
  paneStep.addEventListener('click', e => {
    const s = stateOf(curEl);
    const t = e.target.closest('[data-ag-trigger]');
    if (t) { e.stopPropagation(); const d = t.closest('[data-ag-dd]'), m = $('[data-ag-menu]', d), open = !m.hidden; $$('[data-ag-menu]', paneStep).forEach(x => { x.hidden = true; x.closest('[data-ag-dd]').dataset.open = 'false'; }); m.hidden = open; d.dataset.open = String(!open); return; }
    const o = e.target.closest('[data-ag-menu] [data-value]');
    if (o) {
      const d = o.closest('[data-ag-dd]'), v = o.dataset.value, k = d.dataset.k;
      $('[data-ag-value]', d).textContent = v; $$('[data-value]', d).forEach(x => x.removeAttribute('aria-selected')); o.setAttribute('aria-selected', 'true');
      $('[data-ag-menu]', d).hidden = true; d.dataset.open = 'false';
      if (k === 'form') { s.form = v; syncCard(curEl); }
      return;
    }
    const a = e.target.closest('[data-act]');
    if (a && a.dataset.act === 'del-step') { const node = curEl.closest('[data-ag-onb]'); state.delete(curEl); curEl.remove(); selectOnb(node); draw(); return; }
    if (a) {
      const fi = a.closest('.ag-file');
      renderStep(curEl); return;
    }
    const c = e.target.closest('label.rmx-check');
    if (c) setTimeout(() => {
      const on = c.dataset.checked === 'true', k = c.dataset.k, fi = c.closest('.ag-file');
      if (k === 'required') s.required = on; if (k === 'self') s.self = on;
      if (fi && k === 'file-req') s.files[+fi.dataset.i].req = on;
      if (fi && k === 'file-multi') s.files[+fi.dataset.i].multi = on;
    }, 0);
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-ag-dd]')) $$('[data-ag-menu]', paneStep).forEach(m => { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; }); });

  /* ---- step library search ---- */
  const q = $('[data-ag-search]');
  if (q) q.addEventListener('input', () => $$('[data-lib]').forEach(i => { i.hidden = !i.dataset.lib.toLowerCase().includes(q.value.toLowerCase()); }));

  /* ---- connections ---- */
  /* The inspector's Connections list is the selected Onboarding node's real edges. */
  const labelOf = id => $('.ag-node__text', N(id)).textContent.trim();
  const isCond = id => N(id).classList.contains('ag-node--condition');
  function nodeName(id) {   /* disambiguate nodes that share a title, e.g. the three "Additional Onboarding Steps" */
    const l = labelOf(id), same = $$('.ag-node[data-node]').filter(n => labelOf(n.dataset.node) === l);
    return same.length > 1 ? l + ' (' + (same.findIndex(n => n.dataset.node === id) + 1) + ')' : l;
  }
  function renderConns(node, connSec) {
    connSec = connSec || $('[data-ag-connsec]', paneOnb);
    const id = node.dataset.node;
    const from = edges.filter(e => e.b === id).map(e => ({ e, kind: 'From', to: e.a }));
    const out = edges.filter(e => e.a === id).map(e => ({ e, kind: isCond(e.b) ? 'If' : 'To', to: e.b }));
    const rows = from.concat(out);
    const linked = new Set(rows.map(r => r.to)); linked.add(id);
    const opts = $$('.ag-node[data-node]').map(n => n.dataset.node).filter(n => !linked.has(n));
    connSec.dataset.connFor = id;
    connSec.innerHTML = '<div class="ag-sec__head rmx-type-paragraph-s-semibold">Connections</div><div class="ag-sec__body"><div class="ag-conns">' +
      rows.map(r => '<div class="ag-conn rmx-type-paragraph-s-regular" data-ag-conn data-edge="' + edges.indexOf(r.e) + '"><span class="ag-conn__kind rmx-type-label-s-regular">' + r.kind + '</span><span class="ag-conn__val">' + esc(labelOf(r.to)) + '</span><button type="button" class="ag-conn__x" aria-label="Remove connection" data-ag-rmconn>' + ic('close') + '</button></div>').join('') +
      '</div><div class="ag-connect"><div class="rmx-field" data-ag-dd data-k="target" data-rmx-component="Input Field"><button type="button" class="rmx-field__box" data-ag-trigger><span class="rmx-placeholder" data-ag-value>Connect to</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-ag-menu hidden>' +
      opts.map(o => '<button type="button" data-value="' + o + '">' + esc(nodeName(o)) + '</button>').join('') +
      '</div></div><button type="button" class="rmx-btn rmx-btn--secondary" data-ag-connect data-rmx-component="Button">Connect</button></div></div>';
  }
  const closeConnMenus = () => $$('[data-ag-connsec] [data-ag-menu]').forEach(m => { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; });
  [paneOnb, paneTrig, paneCond].forEach(pane => pane.addEventListener('click', e => {
    const connSec = e.target.closest('[data-ag-connsec]'), closeAll = closeConnMenus; if (!connSec) return;
    const t = e.target.closest('[data-ag-trigger]');
    if (t) { e.stopPropagation(); const d = t.closest('[data-ag-dd]'), m = $('[data-ag-menu]', d), open = !m.hidden; closeAll(); m.hidden = open; d.dataset.open = String(!open); return; }
    const o = e.target.closest('[data-ag-menu] [data-value]');
    if (o) { const d = o.closest('[data-ag-dd]'); d.dataset.target = o.dataset.value; const v = $('[data-ag-value]', d); v.textContent = o.textContent; v.classList.remove('rmx-placeholder'); closeAll(); return; }
    const x = e.target.closest('[data-ag-rmconn]');
    if (x) { edges.splice(+x.closest('[data-ag-conn]').dataset.edge, 1); renderConns(N(connSec.dataset.connFor), connSec); draw(); return; }
    if (e.target.closest('[data-ag-connect]')) {
      const target = $('[data-ag-dd]', connSec).dataset.target; if (!target) return;
      edges.push({ a: connSec.dataset.connFor, b: target, loop: false }); renderConns(N(connSec.dataset.connFor), connSec); draw();
    }
  }));
  document.addEventListener('click', e => { if (!e.target.closest('[data-ag-dd]')) closeConnMenus(); });
  renderConns(curOnb);

  /* ---- trigger: pick which onboarding event this trigger waits for ---- */
  const TRIGGERS = ['A lease is signed', 'Onboarding is started', 'Onboarding is sent', 'Onboarding is completed', 'A step is completed', 'Onboarding is overdue', 'An application is approved', 'A security deposit is paid', 'Renters insurance is verified', 'Move-in date is reached', 'A prospect becomes a tenant'];
  const trigOpt = t => { const x = t.replace(/^When /, ''); return x.charAt(0).toUpperCase() + x.slice(1); };   /* canvas text -> option */
  const trigText = o => 'When ' + o.charAt(0).toLowerCase() + o.slice(1);                                      /* option -> canvas text */
  let curTrig = null;
  function renderTrigger(node) {
    curTrig = node; const cur = trigOpt($('.ag-node__text', node).textContent.trim());
    paneTrig.innerHTML = '<div class="ag-insp__head rmx-type-label-s-regular">' + ic('schedule', 'ag-insp__mark ag-insp__mark--trigger') + '<span>Trigger</span><button type="button" class="ag-trash" aria-label="Delete trigger" data-rmx-todo="Deleting a trigger is not built in this prototype">' + ic('delete-filled') + '</button></div>' +
      '<div class="ag-sec"><div class="ag-sec__head rmx-type-paragraph-s-semibold">Settings</div><div class="ag-sec__body">' + dd('Trigger', cur, TRIGGERS.includes(cur) ? TRIGGERS : TRIGGERS.concat(cur), 'trigger') + '</div></div>' +
      '<div class="ag-sec" data-ag-connsec></div>';
    renderConns(node, $('[data-ag-connsec]', paneTrig));
  }
  paneTrig.addEventListener('click', e => {
    if (!curTrig || e.target.closest('[data-ag-connsec]')) return;
    const closeAll = () => $$('[data-ag-menu]', paneTrig).forEach(m => { if (!m.closest('[data-ag-connsec]')) { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; } });
    const t = e.target.closest('[data-ag-trigger]');
    if (t) { e.stopPropagation(); const d = t.closest('[data-ag-dd]'), m = $('[data-ag-menu]', d), open = !m.hidden; closeAll(); m.hidden = open; d.dataset.open = String(!open); return; }
    const o = e.target.closest('[data-ag-menu] [data-value]');
    if (o) {
      const d = o.closest('[data-ag-dd]'); $('[data-ag-value]', d).textContent = o.dataset.value;
      $$('[data-value]', d).forEach(x => x.removeAttribute('aria-selected')); o.setAttribute('aria-selected', 'true'); closeAll();
      $('.ag-node__text', curTrig).textContent = trigText(o.dataset.value); draw(); renderConns(curTrig, $('[data-ag-connsec]', paneTrig));
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-ag-dd]')) $$('[data-ag-menu]', paneTrig).forEach(m => { if (!m.closest('[data-ag-connsec]')) { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; } }); });
  /* ---- condition: the tests that decide whether the branch runs ---- */
  const CFIELDS = ['Prospect has a pet', 'Prospect has a vehicle', 'Unit requires move-in coordination', 'Unit', 'Record status', 'Lease type', 'Property'];
  const COPS = ['is', 'is not'], CMATCH = { any: 'Any condition is true', all: 'All conditions are true' };
  const INIT = { c1: [['Prospect has a pet', 'is', 'Yes']], c2: [['Prospect has a vehicle', 'is', 'Yes']], c3: [['Unit requires move-in coordination', 'is', 'Yes'], ['Unit', 'is', '2B/2B']] };
  const condState = new Map(); let curCond = null;
  function condOf(node) {
    if (!condState.has(node)) {
      const id = node.dataset.node, tests = (INIT[id] || [['Record status', 'is', 'Active']]).map(t => ({ field: t[0], op: t[1], val: t[2] }));
      condState.set(node, { match: id === 'c3' ? 'any' : 'all', tests });
    }
    return condState.get(node);
  }
  /* what each field can be compared with: a fixed list of choices, or free text (null) */
  const CVALUES = { 'Prospect has a pet': ['Yes', 'No'], 'Prospect has a vehicle': ['Yes', 'No'], 'Unit requires move-in coordination': ['Yes', 'No'], 'Record status': ['Active', 'Inactive'], 'Lease type': ['Fixed term', 'Month-to-month'], 'Unit': null, 'Property': null };
  const optsFor = t => CVALUES[t.field] ? (CVALUES[t.field].includes(t.val) ? CVALUES[t.field] : CVALUES[t.field].concat(t.val)) : null;
  const firstVal = f => CVALUES[f] ? CVALUES[f][0] : '';
  /* plain-language wording for yes/no fields, e.g. "prospect has a pet" / "prospect has no pet" */
  const YES = { 'Prospect has a pet': ['prospect has a pet', 'prospect has no pet'], 'Prospect has a vehicle': ['prospect has a vehicle', 'prospect has no vehicle'], 'Unit requires move-in coordination': ['unit requires move-in coordination', "unit doesn't require move-in coordination"] };
  function phrase(t) {
    if (YES[t.field] && (t.val === 'Yes' || t.val === 'No')) return YES[t.field][(t.val === 'Yes') === (t.op === 'is') ? 0 : 1];
    return t.field.toLowerCase() + ' ' + t.op + ' ' + (t.val || '…');
  }
  const condLabel = c => 'If ' + c.tests.map(phrase).join(c.match === 'any' ? ' OR ' : ' AND ');
  const condSummary = c => 'Goes on to the next step when ' + c.tests.map(phrase).join(c.match === 'any' ? ' or ' : ' and ') + '. Otherwise this branch is skipped.';
  function renderCondition(node) {
    curCond = node; const c = condOf(node), text = $('.ag-node__text', node).textContent.trim();
    paneCond.innerHTML = '<div class="ag-insp__head ag-insp__head--two">' + ic('call-split', 'ag-insp__ico') + '<div class="ag-insp__titles"><span class="ag-insp__kind rmx-type-label-s-regular">Condition</span><span class="ag-insp__title rmx-type-paragraph-s-semibold">' + esc(text) + '</span></div><button type="button" class="ag-trash" aria-label="Delete condition" data-rmx-todo="Deleting a condition is not built in this prototype">' + ic('delete-filled') + '</button></div>' +
      '<div class="ag-sec"><div class="ag-sec__head rmx-type-paragraph-s-semibold">Condition</div><div class="ag-sec__body">' +
      (c.tests.length > 1 ? dd('Goes on when', CMATCH[c.match], Object.values(CMATCH), 'match') : '') +
      c.tests.map((t, i) => '<div class="ag-test" data-i="' + i + '">' + dd('', t.field, CFIELDS.includes(t.field) ? CFIELDS : CFIELDS.concat(t.field), 'field') +
        '<div class="ag-test__row">' + dd('', t.op, COPS, 'op') + (optsFor(t) ? dd('', t.val, optsFor(t), 'val') : '<div class="rmx-field" data-rmx-component="Input Field"><div class="rmx-field__box"><input type="text" data-k="val" value="' + esc(t.val) + '" placeholder="Enter a value" aria-label="Value"></div></div>') + '</div>' +
        (c.tests.length > 1 ? '<button type="button" class="ag-link rmx-type-label-m-regular" data-act="del-test">' + ic('delete-filled') + 'Remove condition</button>' : '') + '</div>').join('') +
      '<div><button type="button" class="ag-link rmx-type-paragraph-s-regular" data-act="add-test">' + ic('add-circle') + 'Add condition</button></div>' +
      '<div class="ag-info">' + ic('lightbulb', 'rmx-icon ag-info__ico') + '<p class="ag-info__text rmx-type-paragraph-s-regular" data-ag-summary>' + esc(condSummary(c)) + '</p></div></div></div>' +
      '<div class="ag-sec" data-ag-connsec></div>';
    renderConns(node, $('[data-ag-connsec]', paneCond));
  }
  /* keep the summary, the inspector title and the label on the canvas in step with the tests */
  const setSummary = () => {
    const c = condOf(curCond), s = $('[data-ag-summary]', paneCond), h = $('.ag-insp__title', paneCond);
    if (s) s.textContent = condSummary(c);
    $('.ag-node__text', curCond).textContent = condLabel(c); if (h) h.textContent = condLabel(c);
    draw();
  };
  paneCond.addEventListener('input', e => {
    const k = e.target.dataset.k, row = e.target.closest('.ag-test'); if (k !== 'val' || !row) return;
    condOf(curCond).tests[+row.dataset.i].val = e.target.value; setSummary();
  });
  paneCond.addEventListener('click', e => {
    if (e.target.closest('[data-ag-connsec]')) return;
    const c = condOf(curCond), closeAll = () => $$('[data-ag-menu]', paneCond).forEach(m => { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; });
    const t = e.target.closest('[data-ag-trigger]');
    if (t) { e.stopPropagation(); const d = t.closest('[data-ag-dd]'), m = $('[data-ag-menu]', d), open = !m.hidden; closeAll(); m.hidden = open; d.dataset.open = String(!open); return; }
    const o = e.target.closest('[data-ag-menu] [data-value]');
    if (o) {
      const d = o.closest('[data-ag-dd]'), v = o.dataset.value, k = d.dataset.k, row = d.closest('.ag-test');
      $('[data-ag-value]', d).textContent = v; $$('[data-value]', d).forEach(x => x.removeAttribute('aria-selected')); o.setAttribute('aria-selected', 'true'); closeAll();
      if (k === 'match') c.match = v === CMATCH.all ? 'all' : 'any';
      else if (row) { const t = c.tests[+row.dataset.i]; t[k] = v; if (k === 'field') { t.val = firstVal(v); setSummary(); renderCondition(curCond); return; } }
      setSummary(); return;
    }
    const a = e.target.closest('[data-act]');
    if (a) {
      if (a.dataset.act === 'add-test') { const f = CFIELDS.find(x => !c.tests.some(t => t.field === x)) || CFIELDS[0]; c.tests.push({ field: f, op: 'is', val: firstVal(f) }); }
      if (a.dataset.act === 'del-test') c.tests.splice(+a.closest('.ag-test').dataset.i, 1);
      setSummary(); renderCondition(curCond);
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-ag-dd]')) $$('[data-ag-menu]', paneCond).forEach(m => { m.hidden = true; m.closest('[data-ag-dd]').dataset.open = 'false'; }); });
  $('[data-ag-save]').addEventListener('click', () => RMX.toast('Workflow saved'));

  /* ---- resizable inspector ---- */
  const rz = $('[data-ag-resizer]'), work = $('.ag-work'), MIN = 280, MAX = 720;
  const setW = w => work.style.setProperty('--ag-inspector-w', Math.min(MAX, Math.max(MIN, Math.round(w))) + 'px');
  const curW = () => $('.ag-inspector').getBoundingClientRect().width;
  rz.addEventListener('pointerdown', e => {
    e.preventDefault(); rz.setPointerCapture(e.pointerId);
    rz.classList.add('is-dragging'); document.body.classList.add('ag-resizing');
    const startX = e.clientX, startW = curW();
    const move = ev => setW(startW + (startX - ev.clientX));
    const up = () => { rz.classList.remove('is-dragging'); document.body.classList.remove('ag-resizing'); rz.removeEventListener('pointermove', move); rz.removeEventListener('pointerup', up); rz.removeEventListener('pointercancel', up); };
    rz.addEventListener('pointermove', move); rz.addEventListener('pointerup', up); rz.addEventListener('pointercancel', up);
  });
  rz.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); setW(curW() + 24); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setW(curW() - 24); }
  });
  rz.addEventListener('dblclick', () => setW(400));
})();
