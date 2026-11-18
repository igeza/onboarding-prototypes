/* One-off form (sent from a register, not from a template, not saved as a template unless asked).
   Flow: Prospects / Tenants register > row menu or Bulk Actions > Send One-Off Form (template designer, send-onboarding.js)
   > the form designer in one-off mode (this file) > Send > Expiration Date and message > back to the register.
   One-off mode: Form Name instead of Template Name, no property or portal settings, a Save as Template box that is off by default,
   a "Sending to" tag, and a Send / Cancel footer instead of Save / Cancel. Nothing is added to Form Templates unless Save as Template is ticked. */
(function () {
  var oo = null; try { oo = JSON.parse(sessionStorage.getItem('rmx-oneoff')); } catch (e) {}
  if (!oo) return;
  var names = oo.names || [], noun = (oo.kind || 'Tenant'), who = names.length > 1 ? names.length + ' ' + noun.toLowerCase() + 's' : (names[0] || noun);
  function ic(n, c) { return '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>'; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  document.body.classList.add('fd-oneoff');
  var css = document.createElement('style');
  css.textContent = '.fd-oneoff .fd-top__prop { display: none; }.fd-oo-chip { margin-right: var(--spacing-md); }.oo-body { display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--container-primary); }.oo-body .rmx-field { width: 100%; }.oo-body textarea { all: unset; box-sizing: border-box; width: 100%; height: 100%; padding: 8px; color: var(--text-secondary); font: var(--type-label-m-regular); }.oo-body .oo-box { height: 96px; align-items: flex-start; padding: 0; }.oo-intro { margin: 0; color: var(--text-primary); font: var(--type-paragraph-s-regular); }';
  document.head.appendChild(css);

  /* header */
  var top = document.querySelector('.fd-top__fields');
  [].forEach.call(top ? top.querySelectorAll('.rmx-field__label') : [], function (l) { if (/Template Name/.test(l.textContent)) l.textContent = 'Form Name *'; });
  var checks = top ? top.querySelectorAll('.fd-approval') : [];
  if (checks[1]) checks[1].style.display = 'none';   /* Always on rmResident Portal does not apply to a one-off form */
  var tpl = document.createElement('div');
  tpl.className = 'fd-approval oo-save';
  tpl.innerHTML = '<label class="rmx-check" id="oo-save-tpl" data-checked="false" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">Save as Template</span></label>';
  if (checks[1] && checks[1].parentNode) checks[1].parentNode.insertBefore(tpl, checks[1].nextSibling); else if (top) top.appendChild(tpl);
  var tail = document.querySelector('.fd-top__tail');
  if (tail) tail.insertAdjacentHTML('afterbegin', '<span class="rmx-lozenge rmx-lozenge--brand fd-oo-chip" data-rmx-component="Lozenge">One-off form · Sending to ' + esc(who) + '</span>');
  var title = document.querySelector('.rmx-contextbar__title'); if (title && /Form Setup/.test(title.textContent)) title.textContent = 'One-Off Form';

  /* footer: Send / Cancel, always shown */
  var f = document.querySelector('.fd-footer');
  if (!f) { f = document.createElement('div'); f.className = 'rmx-overlay__footer fd-footer'; document.body.appendChild(f); }
  f.hidden = false; document.body.classList.add('has-fd-footer');
  f.innerHTML = '<button type="button" class="rmx-btn rmx-btn--primary" data-oo-send data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-oo-cancel data-rmx-component="Button">Cancel</button>';

  /* Send dialog */
  var dlg = document.createElement('div');
  dlg.className = 'rmx-overlay'; dlg.id = 'oo-send'; dlg.hidden = true; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Send Form'); dlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  var EXP = [' ', '3 days', '7 days', '14 days', '30 days', '60 days', '90 days'];
  dlg.innerHTML = '<div class="afm"><div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send Form</span><span class="sf__hicons"><button type="button" class="fd-close" data-rmx-close aria-label="Close">' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="oo-body"><p class="oo-intro">This form is sent to ' + esc(who) + ' once. It is not saved as a template unless you ticked Save as Template.</p>' +
    '<div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">Expiration Date</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="wt-value" data-rmx-value>7 days</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu" data-rmx-menu hidden>' +
    EXP.map(function (o) { return '<button type="button" data-value="' + o.trim() + '">' + o + '</button>'; }).join('') + '</div></div>' +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send Message</span><div class="rmx-field__box oo-box"><textarea id="oo-msg" aria-label="Send Message"></textarea></div></div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="oo-do-send" data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div></div>';
  document.body.appendChild(dlg);

  function clear() { try { sessionStorage.removeItem('rmx-oneoff'); sessionStorage.removeItem('rmx-onboarding-form'); } catch (e) {} }
  function back() { window.location.href = oo.back || '../../rmx-onboarding-template-designer/screens/' + (noun === 'Tenant' ? 'tenants.html' : 'prospects.html'); }
  var nameInput = function () { return document.querySelector('.fd-top__fields input[type=text]'); };
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-oo-cancel]')) { clear(); back(); return; }
    if (e.target.closest('[data-oo-send]')) {
      if (window.fdValidate && !window.fdValidate()) return;
      var n = nameInput();
      if (!n || !n.value.trim()) { if (window.RMX && RMX.toast) RMX.toast('Enter a form name', 'failure'); if (n) n.focus(); return; }
      if (!document.querySelector('.fd-q')) { if (window.RMX && RMX.toast) RMX.toast('Add at least one question', 'failure'); return; }
      if (window.RMX && RMX.openOverlay) { RMX.openOverlay('oo-send'); if (RMX.dropdowns) RMX.dropdowns(); }
      return;
    }
    if (e.target.closest('#oo-do-send')) {
      var name = nameInput().value.trim(), saveT = document.getElementById('oo-save-tpl').dataset.checked === 'true';
      var due = (dlg.querySelector('[data-rmx-value]').textContent || '').trim();
      try {
        var sent = JSON.parse(sessionStorage.getItem('rmx-sent-forms') || '[]'); sent.push({ form: name, due: due }); sessionStorage.setItem('rmx-sent-forms', JSON.stringify(sent));
        if (saveT) {
          var forms = JSON.parse(sessionStorage.getItem('rmx-forms') || '[]'), d = new Date(), pad = function (x) { return String(x).padStart(2, '0'); };
          var ap = document.querySelector('.fd-top .fd-approval .rmx-check');
          forms.push({ name: name, type: noun, props: 'All Properties', approval: !!(ap && ap.dataset.checked === 'true'), publish: false, date: pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + String(d.getFullYear()).slice(2) });
          sessionStorage.setItem('rmx-forms', JSON.stringify(forms));
        }
        sessionStorage.setItem('rmx-oneoff-sent', '"' + name.replace(/"/g, '') + '" sent to ' + who + (saveT ? ' and saved as a template' : '') + '.');
      } catch (er) {}
      clear(); back();
    }
  });
})();
