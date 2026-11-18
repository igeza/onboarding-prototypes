/* Prospects and Tenants registers: row kebab menu, selection bar, Send Onboarding and Send Form.
   Figma: Send Onboarding section 6752:27975 (dialog 6768:45238), Send Form to Tenants 6070:46808 (dialog 6768:37219),
   Bulk Send Form - Prospects 6768:37603 (bar 6768:43339, dialog 6768:37676). Menu lists are from Izzy's Rent Manager screenshots.
   - Row kebab: long action list (scrolls inside). Send Onboarding opens the 298px dialog (Figma 6791:27670: Due Date and Expire days); Send Form opens the Send Form dialog for that person.
   - Bulk mode: Bulk Actions > Send Onboarding / Send Form turns on the first-column checkboxes; a blue bar ("3 prospects selected") then offers that one action. Its x leaves bulk mode.
   - Send Form: one 416px dialog everywhere (row menu, Bulk Actions bar, detail-page Actions panel): Form, Expiration Date, Send Message. No contact list, no person field.
   Use: <script src="../assets/send-onboarding.js" data-kind="prospect|tenant" data-table="prospects"></script> after app.js and datepicker.js. */
(function () {
  var me = document.currentScript, kind = (me && me.getAttribute('data-kind')) || 'prospect', tableId = (me && me.getAttribute('data-table')) || 'prospects';
  var NOUN = kind === 'tenant' ? 'Tenant' : kind === 'property' ? 'Property' : 'Prospect', PLURAL = kind === 'property' ? 'properties' : NOUN.toLowerCase() + 's', table = document.getElementById(tableId);
  var LISTS = {
    prospect: ['Send Email', 'Send Onboarding', 'Send Form', 'Send One-Off Form', 'Lost', 'Add Call', 'Add Email Note', 'Add Note', 'Add Visit', 'Add Charge', 'Run Screening', 'Run Income Verification', 'View Screenings', 'View Income Verifications', 'Send Online Application', 'Write Screening Adverse Action Letter', 'Write Income Verification Adverse Action Letter', 'Add Invoice', 'Show All Invoices', 'Add Estimate', 'Show All Estimates'],
    property: ['Send Email', 'Add Management Inspection', 'Create Service Issue', 'Write Letters', 'Report Writer', 'Add to Phone Broadcasts', 'Add to Text Broadcasts'],
    tenant: ['Send Email', 'Send Onboarding', 'Send Form', 'Send One-Off Form', 'Send Survey', 'Send Management Inspection', 'Send Tenant Self-Inspection', 'Run Screening', 'Run Income Verification', 'View Screenings', 'View Income Verifications', 'Jump To Prospect', 'Create Document Packet', 'Publish Signable Documents', 'Add To Account Groups', 'Add Call', 'Add Email Note', 'Add Note', 'Add Visit', 'Add Charge']
  };
  var FORMS = ['Pet Info & Policy Agreement', 'Pet Information', 'Gym Access', 'Notice to Vacate'];
  /* sample contacts from the mock; anyone else has just the primary contact */
  var CONTACTS = { 'Charlie Apegian': [['Alfred Pennywise', 'Co-Applicant', false], ['Aaron Greenfield', 'Guarantor', true]], 'Arlo Swift': [['Monica Swift', 'Co-Applicant', false]], 'Eli Beer': [['Percy Adams', 'Co-Applicant', false]] };

  /* A form that is sent is remembered for this browser tab; the RMR Forms page (rmr-tenant-portal) lists it under Required. */
  function rec(form, due) { try { var a = JSON.parse(sessionStorage.getItem('rmx-sent-forms') || '[]'); a.push({ form: form, due: due || '' }); sessionStorage.setItem('rmx-sent-forms', JSON.stringify(a)); } catch (e) {} }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function pad(n) { return ('0' + n).slice(-2); }
  function inAWeek() { var d = new Date(); d.setDate(d.getDate() + 7); return pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear(); }
  function ic(n, c) { return '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>'; }
  function opener(id) { var b = document.createElement('button'); b.hidden = true; b.setAttribute('data-rmx-open', id); document.body.appendChild(b); return b; }

  var css = document.createElement('style');
  css.textContent =
    '.so-menu { position: fixed; z-index: 2000; min-width: 220px; width: max-content; max-width: 340px; overflow-y: auto; background: var(--container-primary); border-radius: var(--radius-sm); box-shadow: 0 3px 8px rgba(0,0,0,.18); }' +
    '.so-menu[hidden] { display: none; }' +
    '.so-menu button { display: block; width: 100%; padding: 8px 16px; border: 0; background: none; text-align: left; font: var(--type-paragraph-s-regular); line-height: 20px; color: var(--text-link); cursor: pointer; white-space: nowrap; }' +
    '.so-menu button:hover, .so-menu button:focus-visible { background: var(--container-tertiary); outline: none; }' +
    '.rmx-overlay[data-so] { width: 298px; max-width: calc(100vw - 32px); }' +
    '.rmx-overlay[data-so="form"] { width: 856px; }' +
    '.rmx-overlay[data-so="bulk"] { width: 416px; }' +
    '.rmx-overlay[data-so="bulk"] .so-body .rmx-field__box:has(textarea) { height: 96px; min-height: 96px; }.rmx-overlay[data-so="bulk"] .so-body [data-rmx-component="Text Box"] .rmx-field__label { line-height: 20px; }.rmx-overlay[data-so="bulk"] .so-body [data-rmx-component="Input Field"] .rmx-field__label { line-height: 16px; }' +
    '.rmx-overlay[data-so="prop"] { width: 440px; }' +
    '.rmx-overlay[data-so].is-open { display: flex; flex-direction: column; max-height: calc(100vh - 32px); }' +
    '.rmx-overlay[data-so] .rmx-overlay__header { justify-content: space-between; flex: none; }' +
    '.rmx-overlay[data-so] .rmx-overlay__footer { flex: none; }' +
    '.so-expire { display: flex; align-items: center; gap: var(--spacing-xs); }.so-expire .rmx-text { white-space: nowrap; }.so-expire .so-num { width: 32px; height: 32px; padding: 0; justify-content: center; flex: none; }.so-expire .so-num input { width: 100%; text-align: center; border: 0; background: transparent; font: var(--type-label-m-regular); color: var(--text-secondary); outline: none; }.so-expire[data-off] .so-num { opacity: .5; }' +
    '.so-hicons { display: inline-flex; align-items: center; gap: var(--spacing-xs); }.so-hicons button, .so-hicons span { display: inline-flex; border: 0; background: none; padding: 0; cursor: pointer; color: var(--icon-primary); }' +
    '.so-body { display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--container-primary); overflow-y: auto; overflow-x: hidden; min-height: 0; }' +
    '.so-label { font: var(--type-label-m-regular); color: var(--text-primary); margin: 0 0 4px; }' +
    '.so-val { font: var(--type-label-m-semibold); color: var(--text-secondary); margin: 0; }' +
    '.so-row { display: flex; gap: var(--spacing-md); }.so-body .so-row > .rmx-field { flex: none; width: 248px; }.so-body .so-row > .so-wide { width: 280px; }' +
    '.so-body .rmx-field { width: 100%; }' +
    '.so-body .rmx-field__box:has(textarea) { height: auto; min-height: 96px; padding: 0; align-items: stretch; }' +
    '.so-body textarea { flex: 1; width: 100%; min-height: 96px; padding: 8px; border: 0; background: transparent; resize: none; font: var(--type-label-m-regular); color: var(--text-secondary); outline: none; }' +
    '.so-who .rmx-field__box { color: var(--text-secondary); }' +
    '.so-tbl { border: 1px solid var(--border-primary); border-radius: var(--radius-sm); overflow: hidden; }' +
    '.so-tr { display: grid; align-items: center; gap: 8px; padding: 0 8px; min-height: 36px; border-top: 1px solid var(--border-primary); }' +
    '.rmx-overlay[data-so="form"] .so-row > .rmx-field:last-child { flex: 1; width: auto; }' +
    '.rmx-overlay[data-so="form"] .so-row > .so-wide { flex: 1; width: auto; }' +
    '.so-tr--head > span { border-left: 1px solid rgba(255,255,255,.4); align-self: stretch; display: flex; align-items: center; padding-left: 8px; margin-left: -8px; }' +
    '.so-tr--head > span:first-child { border-left: 0; }' +
    '.so-body textarea::placeholder { font-style: italic; color: var(--text-muted, #9aa5ad); }' +
    '.so-tr--head { background: var(--container-tertiary-dark); color: #fff; font: var(--type-label-m-semibold); border-top: 0; min-height: 28px; }' +
    '.so-tr--head .rmx-check__box { background: #fff; }' +
    '.so-grp { font: var(--type-label-m-semibold); color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }.so-grp .rmx-icon { color: var(--icon-primary); }' +
    '.so-cell { height: 32px; display: flex; align-items: center; padding: 0; color: var(--text-secondary); font: var(--type-label-m-regular); overflow: hidden; white-space: nowrap; }' +
    '.so-cell--edit { background: var(--component-input-default, #f5f8fa); border: 1px solid var(--border-primary); border-radius: var(--radius-sm); }.so-cell--edit input { flex: 1; min-width: 0; height: 100%; width: 100%; padding: 0 8px; border: 0; border-radius: var(--radius-sm); background: transparent; font: inherit; color: var(--text-secondary); outline: none; }.so-cell--edit:focus-within { border-color: var(--border-secondary); background: var(--container-primary); }' +
    '.so-web { color: var(--icon-success); display: flex; justify-content: center; }' +
    '.so-ct { font: var(--type-label-m-regular); color: var(--text-primary); }' +
    '.so-tr--head.so-tr--head span:last-child { text-align: left; }' +
    '.so-cols1 { grid-template-columns: 24px 1fr 1fr 64px 104px; }' +
    '.so-colsn { grid-template-columns: 150px 24px 1fr 1fr 64px 104px; }' +
    '.so-invalid .so-tbl { border-color: var(--border-error); }' +
    '.so-bmenu { min-width: 224px; padding-bottom: 8px; }.so-bmenu .so-mass { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }.so-bmenu .so-mass .rmx-icon { color: var(--icon-primary); }.so-bmenu .so-mass em { margin-left: auto; font-style: normal; color: var(--text-primary); }' +
    '.so-sep { height: 1px; background: var(--border-primary); }.so-h { padding: 12px 16px 2px; font: 700 14px/20px Roboto, sans-serif; color: var(--text-secondary); }' +
    '.so-bmenu .so-it { padding-left: 32px; display: flex; align-items: center; justify-content: space-between; }.so-bmenu .so-sub { transform: rotate(-90deg); color: var(--icon-primary); }' +
    /* the checkboxes only exist in bulk mode (Bulk Actions > a bulk action) */
    '.so-sel .rmx-check { display: none; }.so-bulk .so-sel .rmx-check { display: inline-flex; }' +
    /* an unchecked box is empty: the tick only shows once it is checked */
    '.so-sel .rmx-check:not([data-checked="true"]) .rmx-check__box > svg, .so-tbl .rmx-check:not([data-checked="true"]) .rmx-check__box > svg { visibility: hidden; }' +
    /* selection bar */
    '.so-bar { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 90; width: 800px; max-width: calc(100vw - 32px); height: 48px; display: flex; align-items: center; gap: 12px; padding: 0 12px; background: var(--background-primary-button); color: #fff; border-radius: var(--radius-sm); box-shadow: 0 4px 12px rgba(0,0,0,.25); font: var(--type-label-m-semibold); }' +
    '.so-bar[hidden] { display: none; }.so-bar span { flex: 1; }' +
    '.so-bar button { height: 32px; padding: 0 12px; border: 1px solid #fff; border-radius: var(--radius-sm); background: transparent; color: #fff; font: var(--type-label-m-regular); cursor: pointer; }' +
    '.so-bar button:hover { background: rgba(255,255,255,.15); }' +
    '.so-bar .so-x { width: 32px; padding: 0; border: 0; display: inline-flex; align-items: center; justify-content: center; }' +
    '.so-sel { display: flex; align-items: center; height: var(--cell-height, 36px); padding-left: 8px; gap: 8px; }.so-sel .rmx-colorblock { margin-left: 0 !important; }';
  document.head.appendChild(css);

  /* ---------- Send Onboarding dialog ---------- */
  var dlg = document.createElement('div');
  dlg.className = 'rmx-overlay'; dlg.id = 'send-onboarding'; dlg.hidden = true; dlg.setAttribute('data-so', ''); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Send Onboarding'); dlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  dlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Onboarding</span><span class="so-hicons"><button type="button" aria-label="Close" data-rmx-close>' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="so-body"><div><p class="so-label">Onboarding Template</p><p class="so-val">Default Onboarding</p></div>' +
    '<div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">Due Date</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>7 days</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + ['3 days', '7 days', '14 days', '30 days'].map(function (d) { return '<button type="button" data-value="' + d + '">' + d + '</button>'; }).join('') + '</div></div>' +
    '<div class="so-expire" data-rmx-component="Expire"><label class="rmx-check" data-checked="true" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">Expire</span></label><div class="rmx-field__box so-num"><input type="text" value="3" inputmode="numeric" maxlength="3" aria-label="Days after due date"></div><span class="rmx-text">days after due date</span></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="so-send" data-rmx-close data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(dlg);
  var openOnb = opener('send-onboarding');

  /* ---------- Send Form (Figma 8062:46201, 416px): Form, Expiration Date, Send Message — one person or many; no contact list ---------- */
  var bdlg = document.createElement('div');
  bdlg.className = 'rmx-overlay'; bdlg.id = 'send-form-bulk'; bdlg.hidden = true; bdlg.setAttribute('data-so', 'bulk'); bdlg.setAttribute('role', 'dialog'); bdlg.setAttribute('aria-modal', 'true'); bdlg.setAttribute('aria-label', 'Send Form'); bdlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  function dd(label, opts, cur) { return '<div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">' + label + '</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>' + esc(cur) + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + opts.map(function (o) { return '<button type="button" data-value="' + esc(o.trim()) + '">' + esc(o) + '</button>'; }).join('') + '</div></div>'; }
  bdlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Form</span><span class="so-hicons"><button type="button" aria-label="Close" data-rmx-close>' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="so-body">' + dd('Form', FORMS, FORMS[0]) + dd('Expiration Date', ['\u00a0', '3 days', '7 days', '14 days', '30 days', '60 days', '90 days'], '7 days') +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send Message</span><div class="rmx-field__box"><textarea id="sfb-msg" aria-label="Send Message"></textarea></div></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="sfb-send" data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(bdlg);
  var openBulkForm = opener('send-form-bulk');
  document.getElementById('sfb-send').addEventListener('click', function () {
    var f = (bdlg.querySelector('[data-rmx-value]') || {}).textContent || 'Form';
    rec(f, '');
    if (window.RMX && RMX.closeOverlay) RMX.closeOverlay(bdlg);
    if (window.RMX && RMX.toast) RMX.toast('"' + f + '" sent.', 'success');
  });

  /* ---------- Send Form to Property (Figma Send to Property 6070:46986, dialog 6070:47029, 440px) ---------- */
  var pdlg = document.createElement('div');
  pdlg.className = 'rmx-overlay'; pdlg.id = 'send-form-prop'; pdlg.hidden = true; pdlg.setAttribute('data-so', 'prop'); pdlg.setAttribute('role', 'dialog'); pdlg.setAttribute('aria-modal', 'true'); pdlg.setAttribute('aria-label', 'Send Form'); pdlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  pdlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Form</span><span class="so-hicons"><button type="button" aria-label="Close" data-rmx-close>' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="so-body"><div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">Form</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>' + FORMS[0] + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + FORMS.map(function (f) { return '<button type="button" data-value="' + esc(f) + '">' + esc(f) + '</button>'; }).join('') + '</div></div>' +
    '<div class="rmx-field so-who" data-rmx-component="Input Field"><span class="rmx-field__label">Property</span><div class="rmx-field__box">' + ic('search').replace('class="rmx-icon', 'style="color:var(--icon-primary)" class="rmx-icon') + '<input type="text" id="sp-who" readonly aria-label="Property"></div></div>' +
    '<div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Set Expiration</span><div class="rmx-field__box rmx-date"><input type="text" id="sp-date" aria-label="Set Expiration" placeholder="MM/DD/YYYY"><button type="button" class="rmx-date__btn" aria-label="Pick a date">' + ic('calendar-today') + '</button></div></div>' +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send Message</span><div class="rmx-field__box"><textarea id="sp-msg" aria-label="Send Message" placeholder="Type message to tenants here"></textarea></div></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="sp-send" data-rmx-close data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(pdlg);
  var openProp = opener('send-form-prop');
  document.getElementById('sp-send').addEventListener('click', function () { var f = (pdlg.querySelector('[data-rmx-value]') || {}).textContent || 'Form'; rec(f, document.getElementById('sp-date').value); if (window.RMX && RMX.toast) RMX.toast('"' + f + '" sent', 'success'); });

  /* ---------- row kebab menu ---------- */
  var menu = document.createElement('div');
  menu.className = 'so-menu'; menu.hidden = true; menu.setAttribute('role', 'menu');
  menu.innerHTML = LISTS[kind].map(function (n) { return '<button type="button" role="menuitem" data-so-item="' + n + '">' + n + '</button>'; }).join('');
  document.body.appendChild(menu);
  function close() { menu.hidden = true; }
  function nameOf(tr) { var a = tr.querySelector('a'); if (a) return a.textContent.trim(); var nm = ''; [].some.call(tr.querySelectorAll('td'), function (td) { var t = td.textContent.trim(); if (t) { nm = t; return true; } }); return nm; }
  function startOnboarding() { openOnb.click(); if (window.RMX && RMX.dropdowns) RMX.dropdowns(); }
  function startForm(names, form) {
    if (kind === 'property') { document.getElementById('sp-who').value = names.length > 1 ? names.length + ' selected' : names[0]; document.getElementById('sp-date').value = inAWeek(); document.getElementById('sp-msg').value = ''; openProp.click(); if (window.RMX && RMX.dropdowns) RMX.dropdowns(); return; }
    document.getElementById('sfb-msg').value = ''; if (form) { var vv = bdlg.querySelector('[data-rmx-value]'); if (vv) vv.textContent = form; }
    openBulkForm.click(); if (window.RMX && RMX.dropdowns) RMX.dropdowns();
  }

  document.addEventListener('click', function (e) {
    var k = e.target.closest('td button[aria-label="Actions"]');
    if (k) {
      k.removeAttribute('data-rmx-todo'); e.preventDefault(); e.stopPropagation();
      if (!menu.hidden && menu._for === k) { close(); return; }
      menu._for = k;
      var r = k.getBoundingClientRect(), below = window.innerHeight - r.bottom - 12, above = r.top - 12, up = below < 260 && above > below;
      menu.hidden = false; menu.style.maxHeight = Math.max(160, Math.min(up ? above : below, 420)) + 'px'; menu.scrollTop = 0;
      menu.style.left = Math.max(8, Math.min(r.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8)) + 'px';
      if (up) { menu.style.top = 'auto'; menu.style.bottom = (window.innerHeight - r.top + 4) + 'px'; } else { menu.style.bottom = 'auto'; menu.style.top = (r.bottom + 4) + 'px'; }
      return;
    }
    var it = e.target.closest('[data-so-item]');
    if (it) {
      close();
      var what = it.getAttribute('data-so-item'), tr = menu._for && menu._for.closest('tr');
      if (what === 'Send Onboarding') startOnboarding();
      else if (what === 'Send Form' && tr) startForm([nameOf(tr)]);
      else if (what === 'Send One-Off Form' && tr) startOneOff([nameOf(tr)]);
      return;
    }
    if (!e.target.closest('.so-menu')) close();
  }, true);
  window.addEventListener('scroll', function (e) { if (!(e.target.closest && e.target.closest('.so-menu'))) { close(); if (typeof bmenu !== 'undefined') bmenu.hidden = true; } }, true);
  window.addEventListener('resize', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.addEventListener('rmx:change', function (e) { var x = e.target.closest && e.target.closest('.so-expire'); if (!x) return; var on = e.detail && e.detail.checked; x.toggleAttribute('data-off', !on); x.querySelector('input').disabled = !on; });
  document.getElementById('so-send').addEventListener('click', function () { if (window.RMX && RMX.toast) RMX.toast('Onboarding sent', 'success'); });

  /* One-off form: no template. Opens the form designer in one-off mode (rmx-onboarding-form-designer/assets/oneoff.js). */
  function startOneOff(names) {
    try { sessionStorage.setItem('rmx-oneoff', JSON.stringify({ kind: NOUN, names: names, back: location.href })); sessionStorage.removeItem('rmx-onboarding-form'); } catch (e) {}
    window.location.href = '../../rmx-onboarding-form-designer/screens/form-designer.html?oneoff=1';
  }
  window.RMX_SEND_FORM = startForm; window.RMX_SEND_ONEOFF = startOneOff;
  try { var okMsg = sessionStorage.getItem('rmx-oneoff-sent'); if (okMsg) { sessionStorage.removeItem('rmx-oneoff-sent'); setTimeout(function () { if (window.RMX && RMX.toast) RMX.toast(JSON.parse(okMsg), 'success'); }, 300); } } catch (e) {}   /* detail pages: Actions > Communication > Send Form */

  /* ---------- selection column and bar ---------- */
  if (!table) return;
  var bar = document.createElement('div');
  bar.className = 'so-bar'; bar.hidden = true; bar.setAttribute('data-rmx-component', 'Bulk Action');
  bar.innerHTML = '<span id="so-count"></span><button type="button" id="so-go" data-so-bar="go"></button><button type="button" class="so-x" data-so-bar="clear" aria-label="Exit bulk mode">' + ic('close', 'rmx-icon--20') + '</button>';
  document.body.appendChild(bar);
  var headCell = table.querySelector('thead th:first-child');
  if (headCell) headCell.innerHTML = '<div class="so-sel"><label class="rmx-check" data-checked="false" data-rmx-selectall="' + tableId + '" aria-label="Select all"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span></label></div>';
  table.querySelectorAll('tbody tr').forEach(function (tr) {
    var td = tr.querySelector('td:first-child'); if (!td) return;
    td.innerHTML = '<div class="so-sel"><label class="rmx-check" data-checked="false" aria-label="Select row"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span></label>' + td.innerHTML + '</div>';
  });
  var col = table.querySelector('colgroup col:first-child'), colW = col ? col.style.width : '';
  function bulkMode(on) { table.classList.toggle('so-bulk', on); if (col) col.style.width = on ? '64px' : colW; if (!on) table.querySelectorAll('.so-sel .rmx-check').forEach(function (c) { c.dataset.checked = 'false'; }); refresh(); }
  /* Bulk mode: Bulk Actions > one bulk action turns the checkboxes on, and the bar then offers just that one action for the ticked rows. */
  var mode = kind === 'property' ? 'form' : 'onb', NAMES = { onb: 'Send Onboarding', form: 'Send Form', oneoff: 'Send One-Off Form' };
  var bulk = document.querySelector('.tn-bulk'), bmenu = document.createElement('div');
  /* the Rent Manager Bulk Actions menu (from Izzy's screenshot of Prospects); Tenants use the same groups, names swapped, and no Manage group */
  var P = kind === 'tenant' ? 'Tenant' : 'Prospect';
  var GROUPS = [['History / Note', ['Add to History >']], ['Service Manager', ['Add Issue']], ['Financial', ['Add Charge']], ['Reports', [P + ' Mailing Labels', 'Report Writer']],
    ['Communication', ['Write Letters', 'Send Email', 'Send Form', 'Send One-Off Form', 'Send Onboarding', 'Publish Signable Documents', 'Send Text', 'Add to Phone Broadcasts']]];
  if (kind === 'property') GROUPS = [['Reports', ['Report Writer']], ['Communication', ['Write Letters', 'Send Email', 'Add to Phone Broadcasts', 'Add to Text Broadcasts']]];   /* no Send Form for properties */
  else if (kind !== 'tenant') GROUPS.push(['Manage Prospects', ['Set to Lost', 'Change Stage', 'Delete']]);
  bmenu.className = 'so-menu so-bmenu'; bmenu.hidden = true;
  bmenu.innerHTML = '<button type="button" class="so-mass">' + ic('edit') + '<span>Mass Edit Mode</span><em>F2</em></button><div class="so-sep"></div>' +
    GROUPS.map(function (g) { return '<div class="so-h">' + g[0] + '</div>' + g[1].map(function (n) {
      var mode = n === 'Send Onboarding' ? ' data-so-mode="onb"' : n === 'Send Form' ? ' data-so-mode="form"' : n === 'Send One-Off Form' ? ' data-so-mode="oneoff"' : '';
      return '<button type="button" class="so-it"' + mode + '>' + n.replace(' >', '') + (n.slice(-1) === '>' ? ic('arrow-drop-down', 'so-sub') : '') + '</button>'; }).join(''); }).join('');
  document.body.appendChild(bmenu);
  if (bulk) bulk.removeAttribute('data-rmx-todo');
  document.addEventListener('click', function (e) {
    if (bulk && e.target.closest('.tn-bulk') === bulk) {
      e.preventDefault(); e.stopPropagation();
      if (!bmenu.hidden) { bmenu.hidden = true; return; }
      var r = bulk.getBoundingClientRect(); bmenu.hidden = false; bmenu.style.left = r.left + 'px'; bmenu.style.top = (r.bottom + 4) + 'px'; bmenu.style.minWidth = r.width + 'px'; bmenu.style.maxHeight = Math.max(160, window.innerHeight - r.bottom - 16) + 'px'; bmenu.scrollTop = 0;
      return;
    }
    var m = e.target.closest('[data-so-mode]');
    if (m) { mode = m.getAttribute('data-so-mode'); bmenu.hidden = true; bulkMode(true); return; }
    if (!e.target.closest('.so-menu')) bmenu.hidden = true;
  }, true);
  function selected() { return [].filter.call(table.querySelectorAll('tbody tr'), function (tr) { var c = tr.querySelector('.so-sel .rmx-check'); return c && c.dataset.checked === 'true'; }); }
  function refresh() {
    var rows = selected(), n = rows.length;
    /* ticked rows are not tinted: the mocks keep them white, the orange tick is the only mark */
    bar.hidden = !n || !table.classList.contains('so-bulk');
    document.getElementById('so-go').textContent = NAMES[mode];
    document.getElementById('so-count').textContent = n + ' ' + (n === 1 ? NOUN.toLowerCase() : PLURAL) + ' selected';
  }
  document.addEventListener('click', function (e) { if (e.target.closest('.so-sel .rmx-check')) setTimeout(refresh, 0); });
  document.addEventListener('rmx:change', function (e) { if (e.target.closest && e.target.closest('.so-sel')) setTimeout(refresh, 0); });
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-so-bar]'); if (!b) return;
    var rows = selected(), what = b.getAttribute('data-so-bar');
    if (what === 'clear') bulkMode(false);
    else if (what === 'go') { if (mode === 'onb') startOnboarding(); else if (mode === 'oneoff') startOneOff(rows.map(nameOf)); else startForm(rows.map(nameOf)); }
  });
})();
