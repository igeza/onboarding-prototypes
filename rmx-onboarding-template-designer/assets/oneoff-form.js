/* One-off form: a simplified form builder in an overlay on the register (Prospects / Tenants).
   Opened by Send One-Off Form (row menu, Bulk Actions) in send-onboarding.js via window.RMX_ONEOFF.open(names, kind).
   Not a template: nothing is added to Form Templates unless Save as Template is ticked (off by default).
   Form Name, Expiration Date, the questions (text, response type, required; options for Dropdown / Checkboxes), Send Message. */
(function () {
  var TYPES = ['Short Answer', 'Paragraph', 'Yes/No', 'Dropdown', 'Checkboxes', 'Date', 'File Upload'], EXP = [' ', '3 days', '7 days', '14 days', '30 days', '60 days', '90 days'];
  function ic(n, c) { return '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>'; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function dd(label, opts, cur, cls) { return '<div class="rmx-field ' + (cls || '') + '" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">' + label + '</span><button type="button" class="rmx-field__box" data-rmx-trigger><span class="wt-value" data-rmx-value>' + esc(cur) + '</span>' + ic('keyboard-arrow-down') + '</button><div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + opts.map(function (o) { return '<button type="button" data-value="' + esc(o.trim()) + '">' + esc(o) + '</button>'; }).join('') + '</div></div>'; }
  function chk(id, label, on) { return '<label class="rmx-check" id="' + id + '" data-checked="' + (on ? 'true' : 'false') + '" data-rmx-component="Checkbox"><span class="rmx-check__box">' + ic('check', 'rmx-icon--16') + '</span><span class="rmx-text">' + label + '</span></label>'; }
  var css = document.createElement('style');
  css.textContent =
    '.rmx-overlay#oo-form { width: 680px; max-width: calc(100vw - 32px); }.rmx-overlay#oo-form.is-open { display: flex; flex-direction: column; max-height: calc(100vh - 32px); overflow: hidden; }' +
    '#oo-form .rmx-overlay__header { justify-content: space-between; flex: none; }#oo-form .rmx-overlay__footer { flex: none; }' +
    '#oo-form .oo-hicons { display: flex; align-items: center; color: var(--icon-brand); }#oo-form .oo-hicons button { display: inline-flex; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; }' +
    '#oo-form .oo-body { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--container-primary); }' +
    '#oo-form .oo-intro { margin: 0; color: var(--text-primary); font: var(--type-paragraph-s-regular); }' +
    '#oo-form .oo-row { display: flex; gap: var(--spacing-md); }#oo-form .oo-row > .rmx-field { flex: 1; min-width: 0; }#oo-form .oo-row > .oo-narrow { flex: none; width: 200px; }' +
    '#oo-form .rmx-field { width: 100%; }#oo-form .rmx-field__label { line-height: 16px; color: var(--text-primary); }' +
    '#oo-form .oo-sec { border: 1px solid var(--border-primary); border-radius: var(--radius-sm); }' +
    '#oo-form .oo-sechead { display: flex; align-items: center; justify-content: space-between; min-height: 36px; padding: 0 var(--spacing-xs); border-bottom: 2px solid var(--border-secondary); font: var(--type-paragraph-s-semibold); color: var(--text-secondary); }' +
    '#oo-form .oo-qs { display: flex; flex-direction: column; gap: var(--spacing-md); padding: var(--spacing-md); }' +
    '#oo-form .oo-q { display: flex; flex-direction: column; gap: var(--spacing-xs); padding: var(--spacing-xs); border: 1px dashed var(--icon-disabled); border-radius: var(--radius-sm); }' +
    '#oo-form .oo-q__head { display: flex; align-items: center; justify-content: space-between; color: var(--text-secondary); font: var(--type-label-m-regular); }' +
    '#oo-form .oo-q__del { display: inline-flex; padding: 0; border: 0; background: none; color: var(--icon-brand); cursor: pointer; }' +
    '#oo-form .oo-q__fields { display: flex; gap: var(--spacing-md); }#oo-form .oo-q__fields > .rmx-field { flex: 1; min-width: 0; }#oo-form .oo-q__fields > .oo-type { flex: none; width: 200px; }' +
    '#oo-form .oo-q--bad .rmx-field__box { border-color: var(--border-error); }' +
    '#oo-form .oo-box { height: 80px; align-items: flex-start; padding: 0; }#oo-form .oo-box textarea { all: unset; box-sizing: border-box; width: 100%; height: 100%; padding: 8px; color: var(--text-secondary); font: var(--type-label-m-regular); }' +
    '#oo-form .oo-checks { display: flex; gap: var(--spacing-xl); align-items: center; }';
  document.head.appendChild(css);

  var dlg = document.createElement('div');
  dlg.className = 'rmx-overlay'; dlg.id = 'oo-form'; dlg.hidden = true; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Send One-Off Form'); dlg.setAttribute('data-rmx-component', 'Dialog Overlay');
  dlg.innerHTML =
    '<div class="rmx-overlay__header" data-rmx-component="Overlay Header"><span class="rmx-type-heading-m-regular">Send One-Off Form</span><span class="oo-hicons"><button type="button" aria-label="Close" data-rmx-close>' + ic('close', 'rmx-icon--24') + '</button></span></div>' +
    '<div class="oo-body"><p class="oo-intro" id="oo-intro"></p>' +
    '<div class="oo-row"><div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Form Name *</span><div class="rmx-field__box" id="oo-name-box"><input type="text" id="oo-name" aria-label="Form Name"></div></div>' + dd('Expiration Date', EXP, '7 days', 'oo-narrow') + '</div>' +
    '<section class="oo-sec"><div class="oo-sechead"><span>Questions</span><button type="button" class="rmx-btn rmx-btn--text" id="oo-add-q" data-rmx-component="Button">' + ic('add') + '<span class="rmx-btn__label">Add Question</span></button></div><div class="oo-qs" id="oo-qs"></div></section>' +
    '<div class="rmx-field" data-rmx-component="Text Box"><span class="rmx-field__label">Send Message</span><div class="rmx-field__box oo-box"><textarea id="oo-msg" aria-label="Send Message"></textarea></div></div>' +
    '<div class="oo-checks">' + chk('oo-approval', 'Require Approval', false) + chk('oo-save-tpl', 'Save as Template', false) + '</div></div>' +
    '<div class="rmx-overlay__footer" data-rmx-component="Overlay Footer"><button type="button" class="rmx-btn rmx-btn--primary" id="oo-send" data-rmx-component="Button">Send</button><button type="button" class="rmx-btn rmx-btn--secondary" data-rmx-close data-rmx-component="Button">Cancel</button></div>';
  document.body.appendChild(dlg);

  var kind = 'Tenant', who = '';
  function renumber() { [].forEach.call(dlg.querySelectorAll('.oo-q'), function (q, i) { q.querySelector('.oo-q__num').textContent = 'Question ' + (i + 1); }); }
  function addQuestion() {
    var q = document.createElement('div'); q.className = 'oo-q';
    q.innerHTML = '<div class="oo-q__head"><span class="oo-q__num"></span><button type="button" class="oo-q__del" aria-label="Delete question">' + ic('delete-filled') + '</button></div>' +
      '<div class="oo-q__fields"><div class="rmx-field" data-rmx-component="Input Field"><span class="rmx-field__label">Question *</span><div class="rmx-field__box"><input type="text" class="oo-q__title" aria-label="Question"></div></div>' + dd('Response Type', TYPES, 'Short Answer', 'oo-type') + '</div>' +
      '<div class="rmx-field oo-q__opts" data-rmx-component="Input Field" hidden><span class="rmx-field__label">Options (separate with commas) *</span><div class="rmx-field__box"><input type="text" class="oo-q__optsin" aria-label="Options"></div></div>' +
      '<div>' + chk('oo-req-' + Date.now() + Math.floor(Math.random() * 1000), 'Required', false) + '</div>';
    document.getElementById('oo-qs').appendChild(q); renumber();
    if (window.RMX && RMX.dropdowns) RMX.dropdowns();
    return q;
  }
  function reset(names, k) {
    kind = k || 'Tenant'; who = names.length > 1 ? names.length + ' ' + kind.toLowerCase() + 's' : (names[0] || kind);
    document.getElementById('oo-intro').textContent = 'Sending to ' + who + '. This form is only for this send. It is not saved as a template unless you tick Save as Template.';
    document.getElementById('oo-name').value = ''; document.getElementById('oo-msg').value = '';
    document.getElementById('oo-name-box').style.borderColor = '';
    dlg.querySelector('[data-rmx-value]').textContent = '7 days';
    document.getElementById('oo-approval').dataset.checked = 'false'; document.getElementById('oo-save-tpl').dataset.checked = 'false';
    document.getElementById('oo-qs').innerHTML = ''; addQuestion();
  }
  dlg.addEventListener('click', function (e) {
    if (e.target.closest('#oo-add-q')) { var q = addQuestion(); q.querySelector('.oo-q__title').focus(); return; }
    var del = e.target.closest('.oo-q__del');
    if (del) { var q2 = del.closest('.oo-q'); if (dlg.querySelectorAll('.oo-q').length > 1) { q2.parentNode.removeChild(q2); renumber(); } return; }
  });
  /* Dropdown and Checkboxes ask for their options. */
  dlg.addEventListener('rmx:select', function (e) {
    var q = e.target.closest && e.target.closest('.oo-q'); if (!q) return;
    setTimeout(function () { var t = q.querySelector('.oo-type [data-rmx-value]').textContent.trim(); q.querySelector('.oo-q__opts').hidden = !(t === 'Dropdown' || t === 'Checkboxes'); }, 0);
  });
  dlg.addEventListener('input', function (e) { var b = e.target.closest('.rmx-field__box'); if (b) b.style.borderColor = ''; });
  document.getElementById('oo-send').addEventListener('click', function () {
    var ok = true, nm = document.getElementById('oo-name');
    if (!nm.value.trim()) { document.getElementById('oo-name-box').style.borderColor = 'var(--border-error)'; ok = false; }
    [].forEach.call(dlg.querySelectorAll('.oo-q'), function (q) {
      var t = q.querySelector('.oo-q__title'), tb = t.closest('.rmx-field__box'); tb.style.borderColor = '';
      if (!t.value.trim()) { tb.style.borderColor = 'var(--border-error)'; ok = false; }
      var ob = q.querySelector('.oo-q__opts');
      if (!ob.hidden && !q.querySelector('.oo-q__optsin').value.trim()) { q.querySelector('.oo-q__optsin').closest('.rmx-field__box').style.borderColor = 'var(--border-error)'; ok = false; }
    });
    if (!ok) { if (window.RMX && RMX.toast) RMX.toast('Complete the highlighted fields', 'failure'); return; }
    var name = nm.value.trim(), saveT = document.getElementById('oo-save-tpl').dataset.checked === 'true', due = (dlg.querySelector('.oo-narrow [data-rmx-value]').textContent || '').trim();
    try {
      var sent = JSON.parse(sessionStorage.getItem('rmx-sent-forms') || '[]'); sent.push({ form: name, due: due }); sessionStorage.setItem('rmx-sent-forms', JSON.stringify(sent));
      if (saveT) {
        var forms = JSON.parse(sessionStorage.getItem('rmx-forms') || '[]'), d = new Date(), pad = function (x) { return String(x).padStart(2, '0'); };
        forms.push({ name: name, type: kind, props: 'All Properties', approval: document.getElementById('oo-approval').dataset.checked === 'true', publish: false, date: pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + String(d.getFullYear()).slice(2) });
        sessionStorage.setItem('rmx-forms', JSON.stringify(forms));
      }
    } catch (er) {}
    if (window.RMX && RMX.closeOverlay) RMX.closeOverlay(dlg);
    if (window.RMX && RMX.toast) RMX.toast('"' + name + '" sent to ' + who + (saveT ? ' and saved as a template' : '') + '.', 'success');
  });
  window.RMX_ONEOFF = { open: function (names, k) { reset(names, k); if (window.RMX && RMX.openOverlay) { RMX.openOverlay('oo-form'); if (RMX.dropdowns) RMX.dropdowns(); } } };
})();
