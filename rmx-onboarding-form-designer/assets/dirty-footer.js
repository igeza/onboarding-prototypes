/* Form Setup footer (Figma Designer, Overlay Footer 6473:24953): Save and Cancel appear once anything on the form has changed.
   A change is typing in a field, picking a value, ticking a box, adding or deleting a question, or duplicating / deleting a page.
   Save hides the footer again; Cancel throws the changes away by reloading the screen (and restoring the saved form it opened with). */
(function () {
  var footer = document.createElement('div');
  footer.className = 'rmx-overlay__footer fd-footer';
  footer.setAttribute('data-rmx-component', 'Overlay Footer');
  footer.hidden = true;
  footer.innerHTML = '<button type="button" class="rmx-btn rmx-btn--primary" data-fd-save data-rmx-component="Button">Save</button>' +
                     '<button type="button" class="rmx-btn rmx-btn--secondary" data-fd-cancel data-rmx-component="Button">Cancel</button>';
  document.body.appendChild(footer);

  function show() { footer.hidden = false; document.body.classList.add('has-fd-footer'); }
  function hide() { footer.hidden = true; document.body.classList.remove('has-fd-footer'); }
  /* The screens write the form to session storage when the page is left; Cancel puts back what was there when the screen opened. */
  var KEY = 'rmx-onboarding-form', before = null, cancelled = false;
  try { before = sessionStorage.getItem(KEY); } catch (e) {}
  window.addEventListener('pagehide', function () {
    if (!cancelled) return;
    try { if (before === null) sessionStorage.removeItem(KEY); else sessionStorage.setItem(KEY, before); } catch (e) {}
  });
  var scope = '.fd-top, .fd-body';
  function inScope(t) { return t.closest && t.closest(scope); }
  ['input', 'change', 'rmx:select'].forEach(function (n) {
    document.addEventListener(n, function (e) { if (inScope(e.target)) show(); });
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-fd-save]')) {
      hide();
      if (window.RMX && RMX.toast) RMX.toast('Form saved', 'success');
      return;
    }
    if (t.closest('[data-fd-cancel]')) { cancelled = true; window.location.reload(); return; }
    if (t.closest('[data-fd-delete], [data-af-add], [data-fd-addopt], [data-fd-addpage], .fd-page__menu [data-value]')) show();
    else if (t.closest('.fd-top .rmx-check')) show();
  });
})();
