/* Shared interaction wiring for the RMR onboarding prototype.
   - [data-href] elements navigate (Back / Next / Start / View).
   - [data-href-if="<value>:<href>,..."] on a Next button routes by the checked radio in [data-route-group].
   - .attach shows the chosen file name. */
(function () {
  /* Embedded in the RMX Portal Preview (iframe named rmr-embed): just the onboarding steps, no header or menu. */
  if (window.name === 'rmr-embed') document.documentElement.classList.add('is-embed');

  /* Choices made in the RMX template designer (kept in the browser tab's session storage) decide what a resident sees.
     A step that has a designer choice appears only when something is chosen; with no designer data at all
     (this prototype opened on its own) every step appears. */
  function stored(key) { try { var raw = sessionStorage.getItem(key); return raw === null ? null : JSON.parse(raw); } catch (e) { return null; } }
  var STEPS = [
    { pages: ['02-docs-to-sign.html'], key: 'rmx-documents' },
    { pages: ['03-file-upload.html'] },
    { pages: ['04-insurance.html'], key: 'rmx-insurance-options' },
    { pages: ['05-pay-charges.html', '06-pay-charges-payment.html', '06a-payment-submitted.html'] },
    { pages: ['07-setup-payment-method.html', '08-setup-monthly-payment.html', '09-autopay.html'], key: 'rmx-payment-steps' },
    { pages: ['10-pet-information.html'], key: 'rmx-form' }
  ];
  STEPS.forEach(function (s) { var v = s.key ? stored(s.key) : null; s.visible = !s.key || v === null || v.length > 0; });
  window.RMR_STEPS = STEPS;
  var here = location.pathname.split('/').pop();
  function stepOf(name) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].pages.indexOf(name) !== -1) return i; return -1; }
  function nextVisible(i) { for (i++; i < STEPS.length; i++) if (STEPS[i].visible) return STEPS[i].pages[0]; return '11-dashboard-complete.html'; }
  function prevVisible(i) { for (i--; i >= 0; i--) if (STEPS[i].visible) return STEPS[i].pages[0]; return null; }

  /* Setup Payment Method: Payment Method = the first screen, Autopay = monthly payment and autopay. */
  var pay = stored('rmx-payment-steps') || [];
  var hasPM = stored('rmx-payment-steps') === null || pay.indexOf('Payment Method') !== -1, hasAP = stored('rmx-payment-steps') === null || pay.indexOf('Autopay') !== -1;

  /* Once Submit Payment has been used, Pay Charges always opens on the Payment Submitted screen. */
  var PAID_KEY = 'rmr-payment-submitted';
  function paid() { try { return sessionStorage.getItem(PAID_KEY) === '1'; } catch (e) { return false; } }
  function route(href, back) {
    var name = (href || '').split('/').pop(), s = stepOf(name);
    if (paid() && (name === '05-pay-charges.html' || name === '06-pay-charges-payment.html')) return '06a-payment-submitted.html';
    if (s !== -1 && !STEPS[s].visible && s !== stepOf(here)) return back ? prevVisible(s) : nextVisible(s);
    if (name === '07-setup-payment-method.html' && !hasPM) return here === '08-setup-monthly-payment.html' ? '06-pay-charges-payment.html' : '08-setup-monthly-payment.html';
    return href;
  }
  if (paid() && (here === '05-pay-charges.html' || here === '06-pay-charges-payment.html')) { location.replace('06a-payment-submitted.html'); return; }
  var me = stepOf(here);
  if (me !== -1 && !STEPS[me].visible) { location.replace(nextVisible(me)); return; }
  if (here === '07-setup-payment-method.html' && !hasPM) { location.replace('08-setup-monthly-payment.html'); return; }
  if (here === '08-setup-monthly-payment.html' && !hasAP) { location.replace(nextVisible(4)); return; }

  /* Hidden steps leave the stepper (and the line after them). */
  document.querySelectorAll('.stepper__item').forEach(function (item, i) {
    if (STEPS[i] && !STEPS[i].visible) {
      item.style.display = 'none';
      var line = item.nextElementSibling && item.nextElementSibling.classList.contains('stepper__line') ? item.nextElementSibling : item.previousElementSibling;
      if (line && line.classList.contains('stepper__line')) line.style.display = 'none';
    }
  });
  /* A Back button with nowhere to go (everything before it is hidden) is hidden. */
  document.querySelectorAll('.footer-buttons .btn--secondary[data-href]').forEach(function (b) {
    if (route(b.getAttribute('data-href'), true) === null) b.style.visibility = 'hidden';
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-href]');
    if (!el) return;
    e.preventDefault();
    var back = el.classList.contains('btn--secondary') && !!el.closest('.footer-buttons');
    var href = route(el.getAttribute('data-href'), back);
    if (href === null) return;
    if (el.hasAttribute('data-history') && window.history.length > 1) { window.history.back(); return; }
    var routes = el.getAttribute('data-routes');
    if (routes) {
      var checked = document.querySelector('[data-route-group] input:checked');
      var map = {};
      routes.split(',').forEach(function (pair) {
        var i = pair.indexOf(':');
        map[pair.slice(0, i)] = pair.slice(i + 1);
      });
      if (checked && map[checked.value]) href = map[checked.value];
    }
    window.location.href = href;
  });

  document.querySelectorAll('.attach').forEach(function (box) {
    var input = box.querySelector('input[type=file]');
    var text = box.querySelector('.attach__text');
    box.addEventListener('dragover', function (e) { e.preventDefault(); });
    box.addEventListener('drop', function (e) {
      e.preventDefault();
      if (e.dataTransfer.files[0]) show(e.dataTransfer.files[0].name);
    });
    input.addEventListener('change', function () { if (input.files.length > 1) show(input.files.length + ' files selected'); else if (input.files[0]) show(input.files[0].name); });
    function show(name) { text.textContent = name; box.classList.add('has-file'); }
  });

  /* [data-dropdown]: custom dropdown. Trigger toggles the panel, an item sets the value (hidden input) and closes it. */
  document.querySelectorAll('[data-dropdown]').forEach(function (dd) {
    var trigger = dd.querySelector('.dropdown__trigger'), panel = dd.querySelector('.dropdown__panel');
    var value = dd.querySelector('input[type=hidden]');
    function setOpen(o) { panel.hidden = !o; dd.classList.toggle('is-open', o); trigger.setAttribute('aria-expanded', o); }
    trigger.addEventListener('click', function () { setOpen(panel.hidden); });
    panel.addEventListener('click', function (e) {
      var item = e.target.closest('.dropdown__item');
      if (!item) return;
      panel.querySelectorAll('.is-selected').forEach(function (x) { x.classList.remove('is-selected'); });
      item.classList.add('is-selected');
      trigger.textContent = item.textContent; value.value = item.getAttribute('data-value') || item.textContent;
      setOpen(false);
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  });

  /* Step status, kept per tab and independent of which page you are on: Save marks a step done (green check),
     Skip leaves it as it was. The first page opened seeds it from the stepper as drawn. Jumping between steps
     from the stepper only changes which step is current, never a step's status. */
  var KEY = 'rmr-step-status';
  var items = [].slice.call(document.querySelectorAll('.stepper__item'));
  function status() {
    try { var s = JSON.parse(sessionStorage.getItem(KEY)); if (s) return s; } catch (e) {}
    /* Start state: Documents to Sign complete, everything else still to do (same as the dashboard). */
    var seed = items.map(function (it, i) { return i === 0 ? 'done' : 'todo'; });
    if (items.length) { try { sessionStorage.setItem(KEY, JSON.stringify(seed)); } catch (e) {} }
    return seed;
  }
  function setStatus(i, v) {
    var s = status();
    if (v === 'skipped' && s[i] === 'done') return;
    s[i] = v;
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-payment-submit]')) { try { sessionStorage.setItem(PAID_KEY, '1'); } catch (er) {} }
    var save = e.target.closest('[data-step-save]'), skip = e.target.closest('[data-step-skip]');
    if (save) setStatus(save.getAttribute('data-step-save'), 'done');
    else if (skip) setStatus(skip.getAttribute('data-step-skip'), 'skipped');
  });
  /* A step's main button says Mark as Complete until the step is done, then Update. Update saves any changes and goes back to the dashboard. */
  [].forEach.call(document.querySelectorAll('[data-step-btn]'), function (b) {
    var i = +b.getAttribute('data-step-btn'), lab = b.querySelector('.btn__container') || b;
    if (status()[i] === 'done') {
      lab.textContent = 'Update';
      b.setAttribute('data-href', '01-dashboard.html'); if (b.tagName === 'A') b.setAttribute('href', '01-dashboard.html');
    }
  });
  var st = status();
  items.forEach(function (item, i) {
    var mark = item.querySelector('.step'), img = mark && mark.querySelector('img');
    if (!mark) return;
    var done = st[i] === 'done', current = item.classList.contains('is-active');
    mark.classList.remove('step--completed', 'step--active', 'step--pending');
    mark.classList.add(done ? 'step--completed' : current ? 'step--active' : 'step--pending');
    if (img) img.src = img.src.replace(/check-(white|blue)\.svg/, done || current ? 'check-white.svg' : 'check-blue.svg');
  });
})();

(function () {
  function chosen(key) { try { return JSON.parse(sessionStorage.getItem(key) || '[]'); } catch (e) { return []; } }
  var here = location.pathname.split('/').pop();
  /* Documents to Sign lists only the documents chosen in the template designer. */
  var docs = chosen('rmx-documents');
  if (here === '02-docs-to-sign.html' && docs.length) {
    var kept = 0;
    document.querySelectorAll('.table tbody tr').forEach(function (tr) {
      var show = docs.indexOf(tr.children[0].textContent.trim()) !== -1;
      tr.hidden = !show; if (show) kept++;
    });
    document.querySelectorAll('p').forEach(function (p) { if (/Total Documents/.test(p.textContent)) p.textContent = kept + ' Total Document' + (kept === 1 ? '' : 's'); });
  }
  /* Setup Payment Method with only "Payment Method" chosen finishes on the first screen: Skip / Save instead of Next. */
  var pay = chosen('rmx-payment-steps');
  if (here === '07-setup-payment-method.html' && pay.length && pay.indexOf('Autopay') === -1) {
    var next = document.querySelector('.footer-buttons .btn--primary');
    next.parentNode.insertAdjacentHTML('beforeend', '<div style="display:flex;align-items:center;gap:24px"><a class="btn--text" href="10-pet-information.html" data-href="10-pet-information.html" data-step-skip="4" data-component="Button">Skip</a><button type="button" class="btn btn--primary" data-component="Button" data-href="10-pet-information.html" data-step-save="4"><span class="btn__container">Save</span></button></div>');
    next.remove();
  }
})();

/* Dashboard: task rows, percentage and progress ring follow the per-tab step status (Save / Next mark a step done). */
(function () {
  var rows = [].slice.call(document.querySelectorAll('.task'));
  if (!rows.length || !document.querySelector('.progress__arc svg')) return;
  var st; try { st = JSON.parse(sessionStorage.getItem('rmr-step-status')); } catch (e) {}
  st = st || ['done', 'todo', 'todo', 'todo', 'todo', 'todo'];
  var steps = window.RMR_STEPS || [], total = 0, done = 0;
  rows.forEach(function (row, i) {
    if (steps[i] && !steps[i].visible) { row.style.display = 'none'; return; }
    total++;
    var ok = st[i] === 'done'; if (ok) done++;
    var mark = row.querySelector('.step'), img = mark.querySelector('img'), btn = row.querySelector('button');
    mark.classList.remove('step--completed', 'step--pending');
    mark.classList.add(ok ? 'step--completed' : 'step--pending');
    img.src = img.src.replace(/check-(white|blue)\.svg/, ok ? 'check-white.svg' : 'check-blue.svg');
    btn.textContent = ok ? 'View' : 'Start';
  });
  var pct = total ? Math.round(done / total * 100) : 0, C = 271.43;
  document.querySelector('.progress__value p').textContent = pct + '%';
  var c = document.querySelector('.progress__arc circle');
  c.setAttribute('stroke-dasharray', (C * pct / 100) + ' ' + C);
  c.style.display = pct ? '' : 'none';
})();

/* Clicking the rmResident logo resets the prototype: forgets step status, signed documents and the submitted payment
   (the template-designer choices, rmx-*, are kept), then returns to the dashboard. */
(function () {
  var logo = document.querySelector('.header__logo');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.setAttribute('role', 'link'); logo.setAttribute('tabindex', '0'); logo.setAttribute('aria-label', 'rmResident – reset prototype');
  function reset() {
    try { Object.keys(sessionStorage).filter(function (k) { return k.indexOf('rmr-') === 0; }).forEach(function (k) { sessionStorage.removeItem(k); }); } catch (e) {}
    window.location.href = '01-dashboard.html';
  }
  logo.addEventListener('click', reset);
  logo.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reset(); } });
})();
