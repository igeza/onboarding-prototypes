/* Form Templates register: the kebab on a row (Figma Row Actions 6070:47164).
   Send to Tenant · Publish to rmResident Portal · Copy Link · Make Inactive · Preview
   Send to Tenant / Send to Prospect (by the row's Type) opens the send dialog (send-form.js). Preview opens the Portal Preview and
   Copy Link copies a link, then confirms; Publish and Make Inactive are not built. */
(function () {
  var ITEMS = ['Send to Tenant', 'Publish to rmResident Portal', 'Copy Link', 'Make Inactive', 'Preview'];
  function typeOf(tr) { var c = tr && tr.cells[1]; return c && /prospect/i.test(c.textContent) ? 'Prospect' : 'Tenant'; }
  var menu = null;
  function close() { if (menu) { menu.remove(); menu = null; } }
  function open(btn) {
    close();
    var r = btn.getBoundingClientRect();
    menu = document.createElement('div');
    menu.className = 'rmx-menu fd-rowmenu'; menu.setAttribute('role', 'menu');
    var t = typeOf(btn.closest('tr'));
    menu.innerHTML = ITEMS.map(function (n) { if (n === 'Send to Tenant') n = 'Send to ' + t; return '<button type="button" role="menuitem" data-value="' + n + '">' + n + '</button>'; }).join('');
    menu.style.cssText = 'position:fixed;z-index:2000;width:216px;top:' + (r.bottom + 4) + 'px;left:' + Math.max(8, r.right - 216) + 'px';
    menu._row = btn.closest('tr');
    document.body.appendChild(menu);
  }
  document.addEventListener('click', function (e) {
    var k = e.target.closest('[data-fd-rowkebab]');
    if (k) { e.preventDefault(); e.stopPropagation(); if (menu && menu._row === k.closest('tr')) close(); else open(k); return; }
    var item = menu && e.target.closest('.fd-rowmenu [data-value]');
    if (item) {
      var act = item.dataset.value, row = menu._row;
      close();
      if (/^Send to /.test(act) && window.SendForm) { SendForm.open({ form: row.cells[0].textContent.trim(), type: typeOf(row) }); return; }
      if (act === 'Preview') window.location.href = 'portal-preview.html';
      else if (act === 'Copy Link') {
        try { navigator.clipboard.writeText(new URL('portal-preview.html', location.href).href); } catch (er) {}
        if (window.RMX && RMX.toast) RMX.toast('Link copied', 'success');
      }
      return;
    }
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
})();
