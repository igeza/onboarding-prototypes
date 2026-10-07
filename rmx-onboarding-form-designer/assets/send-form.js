/* Form Templates: Send to Tenant / Send to Prospect (Figma "Send to Tenant" flow, section 6070:46808).
   Row menu > Send to ... opens the Send dialog; its Tenants (or Prospects) field drops open a list under it (search, Select All,
   a checkbox per person). There is no separate Select dialog.
   Save sends: the dialog closes and a toast confirms ("<form>" sent to 3 tenants.).
   The wording follows the form's Type: a Prospect form says prospect(s), a Tenant form says tenant(s). */
(function () {
  var PEOPLE = {
    Tenant: ['Zackary Abernathy', 'Eloise Albright', 'Jamison Blackwood', 'Barnaby Thornton', 'Sullivan Lancaster', 'Alfred Bramhall', 'Kristin Macpherson'],
    Prospect: ['Charlie Apegian', 'Marisol Vega', 'Devon Whitfield', 'Priya Nair', 'Tobias Lindqvist', 'Hannah Okafor', 'Gabriel Moreau']
  };
  var ctx = null, picked = [];
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function ic(n, c) { return '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>'; }
  function head(title) {
    return '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular" data-sf-title>' + title + '</span>' +
      '<span class="sf__hicons"><span data-rmx-todo="Help is not built in this prototype">' + ic('help', 'rmx-icon--24') + '</span>' +
      '<button type="button" class="fd-close" data-sf-close aria-label="Close">' + ic('close', 'rmx-icon--24') + '</button></span></div>';
  }
  function foot() {
    return '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" data-sf-save data-rmx-component="Button">Save</button>' +
      '<button type="button" class="rmx-btn rmx-btn--secondary" data-sf-close data-rmx-component="Button">Cancel</button></div>';
  }
  function formBlock() { return '<div class="sf__form"><p class="sf__lbl">Form</p><p class="sf__name" data-sf-form></p></div>'; }

  var send = document.createElement('div');
  send.className = 'rmx-overlay sf'; send.id = 'sf-send'; send.hidden = true;
  send.setAttribute('role', 'dialog'); send.setAttribute('aria-modal', 'true'); send.setAttribute('data-rmx-component', 'Dialog Overlay');
  send.innerHTML = '<div class="sf__dlg sf__dlg--send">' + head('Send to Tenant') +
    '<div class="sf__body">' + formBlock() +
    '<div class="sf__row"><div class="rmx-field sf__grow" data-rmx-component="Input Field"><span class="rmx-field__label" data-sf-noun-label>Tenants</span>' +
      '<button type="button" class="rmx-field__box sf__pick" data-sf-pick>' + ic('search') + '<span class="sf__pickval rmx-placeholder" data-sf-count></span></button></div>' +
    '<div class="rmx-field sf__grow" data-rmx-component="Input Field"><span class="rmx-field__label">Set Expiration</span><div class="rmx-field__box"><input type="text" placeholder="mm/dd/yyyy" data-sf-date aria-label="Set Expiration">' + ic('calendar-today') + '</div></div></div>' +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send below message with form</span><div class="rmx-field__box sf__msg"><textarea data-sf-msg rows="4" aria-label="Message"></textarea></div></div>' +
    '</div>' + foot() + '</div>';

  var sel = document.createElement('div');
  sel.className = 'rmx-menu sf__panel'; sel.id = 'sf-select'; sel.hidden = true; sel.setAttribute('data-rmx-component', 'Dropdown Menu');
  sel.innerHTML = '<div class="sf__psearch"><div class="rmx-field__box">' + ic('search') + '<input type="text" data-sf-search aria-label="Search"></div></div>' +
    '<label class="rmx-check" data-checked="false" data-sf-all data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">Select All</span></label>' +
    '<div class="sf__list" data-sf-list></div>';
  document.body.appendChild(send); document.body.appendChild(sel);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function noun() { return ctx.type === 'Prospect' ? 'Prospect' : 'Tenant'; }

  function countText() { return picked.length ? picked.length + ' selected' : 'Select ' + noun().toLowerCase() + 's'; }
  function renderSend() {
    var c = $('[data-sf-count]', send);
    c.textContent = countText(); c.classList.toggle('rmx-placeholder', !picked.length);
  }
  function renderList() {
    var q = $('[data-sf-search]', sel).value.trim().toLowerCase(), list = $('[data-sf-list]', sel);
    var names = PEOPLE[noun()].filter(function (n) { return !q || n.toLowerCase().indexOf(q) !== -1; });
    list.innerHTML = names.map(function (n) {
      return '<label class="rmx-check" data-checked="' + (picked.indexOf(n) !== -1) + '" data-sf-item="' + esc(n) + '" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">' + esc(n) + '</span></label>';
    }).join('');
    var all = $('[data-sf-all]', sel);
    all.dataset.checked = String(names.length > 0 && names.every(function (n) { return picked.indexOf(n) !== -1; }));
  }
  function openOver(el) { if (window.RMX) RMX.openOverlay(el.id); }
  function closeOver(el) { closePanel(); if (window.RMX) RMX.closeOverlay(el); }

  /* the people list drops open under the field and stays open while you tick; clicking elsewhere closes it */
  function openPanel() {
    var r = $('[data-sf-pick]', send).getBoundingClientRect();
    sel.querySelector('[data-sf-search]').placeholder = 'Search ' + noun().toLowerCase() + 's';
    sel.querySelector('[data-sf-search]').value = '';
    renderList();
    sel.style.cssText = 'position:fixed;z-index:4000;left:' + r.left + 'px;top:' + (r.bottom + 4) + 'px;width:' + r.width + 'px;min-width:0';
    sel.hidden = false;
    sel.querySelector('[data-sf-search]').focus();
  }
  function closePanel() { sel.hidden = true; }

  window.SendForm = {
    open: function (o) {
      ctx = o; picked = []; closePanel();
      $('[data-sf-title]', send).textContent = 'Send to ' + noun();
      $('[data-sf-form]', send).textContent = o.form;
      $('[data-sf-noun-label]', send).textContent = noun() + 's';
      $('[data-sf-date]', send).value = ''; $('[data-sf-msg]', send).value = '';
      $('[data-sf-msg]', send).placeholder = 'Type message to ' + noun().toLowerCase() + 's here';
      $('[data-sf-pick]', send).classList.remove('sf__invalid');
      renderSend(); openOver(send);
    }
  };

  document.addEventListener('click', function (e) {
    if (!ctx) return;
    var inPanel = e.target.closest('#sf-select'), inSend = e.target.closest('#sf-send');
    if (e.target.closest('[data-sf-pick]') && inSend) { if (sel.hidden) openPanel(); else closePanel(); return; }
    if (inPanel) {
      var item = e.target.closest('[data-sf-item]'), all = e.target.closest('[data-sf-all]');
      if (item || all) {
        setTimeout(function () {   // app.js toggles the checkbox first
          if (item) {
            var n = item.dataset.sfItem, on = item.dataset.checked === 'true';
            picked = picked.filter(function (x) { return x !== n; }); if (on) picked.push(n);
          } else {
            var visible = [].map.call(sel.querySelectorAll('[data-sf-item]'), function (l) { return l.dataset.sfItem; }), onAll = all.dataset.checked === 'true';
            picked = picked.filter(function (x) { return visible.indexOf(x) === -1; });
            if (onAll) picked = picked.concat(visible);
          }
          renderList(); renderSend();
          if (picked.length) $('[data-sf-pick]', send).classList.remove('sf__invalid');
        }, 0);
      }
      return;
    }
    if (!sel.hidden) closePanel();
    if (inSend) {
      if (e.target.closest('[data-sf-close]')) { closeOver(send); return; }
      if (e.target.closest('[data-sf-save]')) {
        if (!picked.length) { $('[data-sf-pick]', send).classList.add('sf__invalid'); return; }
        var n = picked.length, w = noun().toLowerCase() + (n === 1 ? '' : 's');
        closeOver(send);
        if (window.RMX && RMX.toast) RMX.toast('"' + ctx.form + '" sent to ' + n + ' ' + w + '.', 'success');
      }
    }
  });
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches('[data-sf-search]')) renderList(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
})();
