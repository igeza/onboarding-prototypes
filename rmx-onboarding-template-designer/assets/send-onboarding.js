/* Row kebab menus on the Prospects and Tenants registers, with Send Onboarding (Figma Send Onboarding section 6752:27975).
   The menu lists the Rent Manager row actions (long, so it scrolls inside); only Send Onboarding does anything: it opens the
   Send Onboarding dialog (Dialog Overlay 6768:45238: template, Expiration Date, Send / Cancel). Send closes it with a toast.
   Send Form opens a Send Form dialog for that one person (adapted from the Send Form to Tenant mock, Figma 6768:37136: the form is picked here and the recipient is the row).
   Use: <script src="../assets/send-onboarding.js" data-kind="prospect|tenant"></script> after app.js and datepicker.js. */
(function () {
  var kind = (document.currentScript && document.currentScript.getAttribute('data-kind')) || 'prospect';
  var LISTS = {
    prospect: ['Send Email', 'Send Onboarding', 'Send Form', 'Lost', 'Add Call', 'Add Email Note', 'Add Note', 'Add Visit', 'Add Charge', 'Run Screening', 'Run Income Verification', 'View Screenings', 'View Income Verifications', 'Send Online Application', 'Write Screening Adverse Action Letter', 'Write Income Verification Adverse Action Letter', 'Add Invoice', 'Show All Invoices', 'Add Estimate', 'Show All Estimates'],
    tenant: ['Send Email', 'Send Onboarding', 'Send Form', 'Send Survey', 'Send Management Inspection', 'Send Tenant Self-Inspection', 'Run Screening', 'Run Income Verification', 'View Screenings', 'View Income Verifications', 'Jump To Prospect', 'Create Document Packet', 'Publish Signable Documents', 'Add To Account Groups', 'Add Call', 'Add Email Note', 'Add Note', 'Add Visit', 'Add Charge']
  };
  var css = document.createElement('style');
  css.textContent =
    '.so-menu { position: fixed; z-index: 2000; min-width: 220px; width: max-content; max-width: 340px; overflow-y: auto; padding: 0; background: var(--container-primary); border-radius: var(--radius-sm); box-shadow: 0 3px 8px rgba(0,0,0,.18); }' +
    '.so-menu[hidden] { display: none; }' +
    '.so-menu button { display: block; width: 100%; padding: 8px 16px; border: 0; background: none; text-align: left; font: var(--type-paragraph-s-regular); line-height: 20px; color: var(--text-link); cursor: pointer; white-space: nowrap; }' +
    '.so-menu button:hover, .so-menu button:focus-visible { background: var(--container-tertiary); outline: none; }' +
    '.rmx-overlay[data-so] { width: 298px; max-width: calc(100vw - 32px); }' +
    '.rmx-overlay[data-so].is-open { display: flex; flex-direction: column; }' +
    '.rmx-overlay[data-so] .rmx-overlay__header { justify-content: space-between; }' +
    '.so-body { display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--container-primary); }' +
    '.so-label { font: var(--type-label-m-regular); color: var(--text-primary); margin: 0 0 4px; }' +
    '.rmx-overlay[data-so="form"] { width: 700px; }' +
    '.so-row { display: flex; gap: var(--spacing-md); }.so-row > * { flex: 1; min-width: 0; }' +
    '.so-body .rmx-field { width: 100%; }' +
    '.so-body .rmx-field__box:has(textarea) { height: auto; min-height: 96px; padding: 0; align-items: stretch; }' +
    '.so-body textarea { flex: 1; width: 100%; min-height: 96px; padding: 8px; border: 0; background: transparent; resize: vertical; font: var(--type-label-m-regular); color: var(--text-secondary); outline: none; }' +
    '.so-val { font: var(--type-label-m-semibold); color: var(--text-secondary); margin: 0; }';
  document.head.appendChild(css);

  var dlg = document.createElement('div');
  dlg.className = 'rmx-overlay'; dlg.id = 'send-onboarding'; dlg.hidden = true; dlg.setAttribute('data-so', ''); dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Send Onboarding'); dlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  dlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Onboarding</span><button type="button" aria-label="Close" data-rmx-close><svg class="rmx-icon rmx-icon--24"><use href="#close"></use></svg></button></div>' +
    '<div class="so-body"><div><p class="so-label">Onboarding Template</p><p class="so-val">Default Onboarding</p></div>' +
    '<div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Expiration Date</span><div class="rmx-field__box rmx-date"><input type="text" id="so-date" aria-label="Expiration Date" placeholder="MM/DD/YYYY"><button type="button" class="rmx-date__btn" aria-label="Pick a date"><svg class="rmx-icon"><use href="#calendar-today"></use></svg></button></div></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="so-send" data-rmx-close data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(dlg);
  var FORMS = ['Pet Information', 'Pet Addendum', 'Gym Access', 'Notice to Vacate'];
  var NOUN = kind === 'tenant' ? 'Tenant' : 'Prospect';
  var fdlg = document.createElement('div');
  fdlg.className = 'rmx-overlay'; fdlg.id = 'send-form-row'; fdlg.hidden = true; fdlg.setAttribute('data-so', 'form'); fdlg.setAttribute('role', 'dialog'); fdlg.setAttribute('aria-modal', 'true'); fdlg.setAttribute('aria-label', 'Send Form to ' + NOUN); fdlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  fdlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Form to ' + NOUN + '</span><button type="button" aria-label="Close" data-rmx-close><svg class="rmx-icon rmx-icon--24"><use href="#close"></use></svg></button></div>' +
    '<div class="so-body"><div><p class="so-label">' + NOUN + '</p><p class="so-val" id="sf-who"></p></div>' +
    '<div class="so-row"><div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">Form</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>Pet Information</span><svg class="rmx-icon"><use href="#keyboard-arrow-down"></use></svg></button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + FORMS.map(function (f) { return '<button type="button" data-value="' + f + '">' + f + '</button>'; }).join('') + '</div></div>' +
    '<div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Set Expiration</span><div class="rmx-field__box rmx-date"><input type="text" id="sf-date" aria-label="Set Expiration" placeholder="MM/DD/YYYY"><button type="button" class="rmx-date__btn" aria-label="Pick a date"><svg class="rmx-icon"><use href="#calendar-today"></use></svg></button></div></div></div>' +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send below message with form</span><div class="rmx-field__box"><textarea id="sf-msg" aria-label="Message">Please complete the form by the expiration date.</textarea></div></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="sf-save" data-rmx-close data-rmx-component="Button">Save</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(fdlg);
  var fopener = document.createElement('button'); fopener.hidden = true; fopener.setAttribute('data-rmx-open', 'send-form-row'); document.body.appendChild(fopener);
  var opener = document.createElement('button'); opener.hidden = true; opener.setAttribute('data-rmx-open', 'send-onboarding'); document.body.appendChild(opener);

  var menu = document.createElement('div');
  menu.className = 'so-menu'; menu.hidden = true; menu.setAttribute('role', 'menu');
  menu.innerHTML = LISTS[kind].map(function (n) { return '<button type="button" role="menuitem" data-so-item="' + n + '">' + n + '</button>'; }).join('');
  document.body.appendChild(menu);

  function pad(n) { return ('0' + n).slice(-2); }
  function close() { menu.hidden = true; }
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
      if (it.getAttribute('data-so-item') === 'Send Form') {
        var tr = menu._for && menu._for.closest('tr'), nm = ''; if (tr) { var a = tr.querySelector('a'); if (a) nm = a.textContent.trim(); else [].some.call(tr.querySelectorAll('td'), function (td) { var t = td.textContent.trim(); if (t) { nm = t; return true; } }); }
        document.getElementById('sf-who').textContent = nm;
        var d2 = new Date(); d2.setDate(d2.getDate() + 7);
        document.getElementById('sf-date').value = pad(d2.getMonth() + 1) + '/' + pad(d2.getDate()) + '/' + d2.getFullYear();
        fopener.click(); if (window.RMX && RMX.dropdowns) RMX.dropdowns();
        return;
      }
      if (it.getAttribute('data-so-item') === 'Send Onboarding') {
        var d = new Date(); d.setDate(d.getDate() + 7);
        document.getElementById('so-date').value = pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear();
        opener.click();
      }
      return;
    }
    if (!e.target.closest('.so-menu')) close();
  }, true);
  window.addEventListener('scroll', function (e) { if (!(e.target.closest && e.target.closest('.so-menu'))) close(); }, true);
  window.addEventListener('resize', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.getElementById('sf-save').addEventListener('click', function () {
    var f = (fdlg.querySelector('[data-rmx-value]') || {}).textContent || 'Form';
    if (window.RMX && RMX.toast) RMX.toast('"' + f + '" sent to ' + document.getElementById('sf-who').textContent + '.', 'success');
  });
  document.getElementById('so-send').addEventListener('click', function () { if (window.RMX && RMX.toast) RMX.toast('Onboarding sent', 'success'); });
})();
