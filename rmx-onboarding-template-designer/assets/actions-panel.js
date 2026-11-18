/* Side panels for the Tenant and Prospect detail pages (Figma Prospect Details - Workflow 6752:27976, plus Rent Manager screenshots).
   Right: the Actions panel, always on the page (300px, blue border). Icon rail picks the section: Shortcuts, Tasks, Leasing, Financial,
   Communication (Send Form lives here), Reports, Settings. The double chevron collapses it to the narrow action bar; the mail button there brings it back.
   Left: a collapsed strip with a double chevron beside the scoreboard; it opens the tenant / prospect list.
   Send Form opens the single-person Send Form dialog (send-onboarding.js, window.RMX_SEND_FORM) for the person on the page. */
(function () {
  var bar = document.querySelector('.rmx-actionbar'), shell = bar && bar.parentNode, main = shell && shell.querySelector('.pr-main'); if (!bar || !main) return;
  var TENANT = /tenant-details/.test(location.pathname), NOUN = TENANT ? 'tenant' : 'prospect';
  var P = {
    bookmark: 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z',
    task: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
    key: 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
    dollar: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'
  };
  function pic(k) { return '<svg class="rmx-icon" viewBox="0 0 24 24" fill="currentColor"><path d="' + P[k] + '"/></svg>'; }
  function ic(n) { return '<svg class="rmx-icon"><use href="#' + n + '"></use></svg>'; }
  var SURVEYS = ['branding', 'Community Event Ideas', 'Community Rules', 'Contact', 'General Amenities', 'How is your new home?', 'Resident Satisfaction Survey'];
  var SECTIONS = [
    { id: 'shortcuts', label: 'Shortcuts', icon: pic('bookmark'), items: ['Add Charge', 'Add Issue', 'Add Note', 'Add Payment'] },
    { id: 'tasks', label: 'Tasks', icon: pic('task'), items: ['Add Task', 'Show Tasks'] },
    { id: 'leasing', label: 'Leasing', icon: pic('key'), items: TENANT ? ['Move Out', 'Renew Lease', 'Add Unit Transfer', 'Run Screening'] : ['Add Preferred Unit User Defined Field', 'Prospect Status', 'Send Onboarding', 'Run Income Verification', 'Run Screening', 'Send Online Application', 'Unit Picker'] },
    { id: 'financial', label: 'Financial', icon: pic('dollar'), items: ['Add Charge', 'Add Payment', 'Add Deposit', 'Show All Invoices'] },
    { id: 'communication', label: 'Communication', icon: ic('mail') },
    { id: 'reports', label: 'Reports', icon: ic('description'), items: ['Mailing Labels', 'Report Writer'] },
    { id: 'settings', label: 'Settings', icon: ic('settings'), items: ['Edit Layout', 'User Defined Fields'] }
  ];
  var css = document.createElement('style');
  css.textContent =
    '.ap { flex: none; width: 300px; align-self: flex-start; position: sticky; top: 104px; height: calc(100vh - 120px); margin: 16px 16px 16px 0; display: flex; flex-direction: column; gap: var(--spacing-sm); padding: var(--spacing-md); background: var(--container-primary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); box-sizing: border-box; }' +
    '.ap[hidden] { display: none; }' +
    '.ap__head { display: flex; align-items: center; justify-content: space-between; }.ap__title { font: 600 16px/24px Roboto, sans-serif; color: var(--text-secondary); }' +
    '.ap button { border: 0; background: none; padding: 0; font: inherit; color: inherit; cursor: pointer; }' +
    '.ap__close { display: inline-flex; color: var(--icon-brand); }' +
    '.ap__search { display: flex; align-items: center; gap: var(--spacing-xs); height: 36px; padding: 0 var(--spacing-xs); background: var(--component-input-default, #f5f8fa); border: 1px solid var(--border-primary); border-radius: var(--radius-sm); color: var(--icon-brand); }.ap__search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font: italic 14px Roboto, sans-serif; color: var(--text-secondary); }' +
    '.ap__body { flex: 1; min-height: 0; display: flex; gap: var(--spacing-sm); }' +
    '.ap__rail { display: flex; flex-direction: column; gap: var(--spacing-md); padding-right: var(--spacing-sm); border-right: 1px solid var(--border-primary); }.ap__rail button { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-sm); color: var(--text-secondary); }.ap__rail button[aria-pressed="true"] { background: #d6e8f5; }' +
    '.ap__list { flex: 1; min-width: 0; overflow-y: auto; }.ap__h { margin: 0 0 var(--spacing-sm); font: 600 16px/24px Roboto, sans-serif; color: var(--text-secondary); }' +
    '.ap .ap__it { display: flex; align-items: center; gap: var(--spacing-xs); width: 100%; min-height: 36px; padding: 0 var(--spacing-xs); text-align: left; color: var(--text-secondary); font: 14px Roboto, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }.ap .ap__it:hover { background: var(--container-tertiary); }.ap .ap__it { display: block; line-height: 36px; }.ap .ap__it:has(> .rmx-icon) { display: flex; align-items: center; line-height: normal; }.ap__it .rmx-icon { width: 16px; height: 16px; flex: none; }' +
    '.ap .ap__it--plain { padding-left: 24px; }.ap__sub { padding-left: 8px; }.ap__sub .ap__it { min-height: 32px; }.ap__sub[hidden] { display: none; }.ap__it[aria-expanded="true"] > .rmx-icon { transform: rotate(90deg); }' +
    '.ap-left { flex: none; width: 24px; margin: 16px 0 0 24px; border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); background: var(--container-primary); display: flex; align-items: flex-start; justify-content: center; padding-top: 8px; box-sizing: border-box; color: var(--icon-brand); cursor: pointer; }.ap-left button { border: 0; background: none; padding: 0; color: inherit; cursor: pointer; display: inline-flex; }' +
    '.pr-main.ap-has-left { padding-left: 8px; }' +
    '.ap-list { position: fixed; z-index: 60; top: 104px; left: 24px; bottom: 16px; width: 300px; display: flex; flex-direction: column; gap: var(--spacing-sm); padding: var(--spacing-md); background: var(--container-primary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); box-shadow: 0 3px 8px rgba(0,0,0,.18); }.ap-list[hidden] { display: none; }' +
    '.ap-list__items { flex: 1; overflow-y: auto; margin: 0 calc(0px - var(--spacing-xs)); }.ap-list__items a { display: block; padding: 8px var(--spacing-xs); color: var(--text-secondary); text-decoration: none; font: 14px Roboto, sans-serif; }.ap-list__items a:hover { background: var(--container-tertiary); }.ap-list__items a[aria-current] { background: #d6e8f5; }' +
    '.ap-list__foot { display: flex; justify-content: space-between; font: 12px Roboto, sans-serif; color: var(--text-link); }.ap-list__foot span:last-child { color: var(--text-secondary); }';
  document.head.appendChild(css);

  function expandable(label, kids) { return '<button type="button" class="ap__it" aria-expanded="false" data-ap-exp>' + ic('chevron-right') + label + '</button><div class="ap__sub" hidden>' + (kids || ['Not built in this prototype']).map(function (k) { return '<button type="button" class="ap__it ap__it--plain" data-rmx-todo="' + k + ' is not built in this prototype">' + k + '</button>'; }).join('') + '</div>'; }
  function sectionHTML(s) {
    var h = '<p class="ap__h">' + s.label + '</p>';
    if (s.id === 'communication') return h + expandable('Document Packets') + '<button type="button" class="ap__it ap__it--plain" data-rmx-todo="Publish Signable Documents is not built in this prototype">Publish Signable Documents</button>' + expandable('Send Email') + '<button type="button" class="ap__it ap__it--plain" data-ap-sendform>Send Form</button>' + expandable('Send Survey', SURVEYS) + expandable('Send Text') + expandable('Write Letter');
    return h + s.items.map(function (k) { return '<button type="button" class="ap__it ap__it--plain" data-rmx-todo="' + k + ' is not built in this prototype">' + k + '</button>'; }).join('');
  }
  var panel = document.createElement('aside');
  panel.className = 'ap'; panel.setAttribute('aria-label', 'Actions'); panel.setAttribute('data-rmx-component', 'Actions Panel');
  var start = TENANT ? 'shortcuts' : 'leasing';
  panel.innerHTML =
    '<div class="ap__head"><span class="ap__title">Actions</span><button type="button" class="ap__close" aria-label="Collapse Actions" data-ap-close>' + ic('keyboard-double-arrow-right') + '</button></div>' +
    '<label class="ap__search">' + ic('search') + '<input type="text" placeholder="Find an action" aria-label="Find an action"></label>' +
    '<div class="ap__body"><div class="ap__rail">' + SECTIONS.map(function (s) { return '<button type="button" aria-label="' + s.label + '" aria-pressed="' + (s.id === start) + '" data-ap-sec="' + s.id + '">' + s.icon + '</button>'; }).join('') + '</div><div class="ap__list" id="ap-list"></div></div>';
  shell.insertBefore(panel, bar);
  function show(id) {
    var s = SECTIONS.filter(function (x) { return x.id === id; })[0];
    document.getElementById('ap-list').innerHTML = sectionHTML(s);
    [].forEach.call(panel.querySelectorAll('[data-ap-sec]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ap-sec') === id)); });
  }
  show(start);
  bar.hidden = true;
  var mail = bar.querySelector('button[aria-label="Send email"]');
  if (mail) { mail.setAttribute('aria-label', 'Communication'); mail.removeAttribute('data-rmx-todo'); }

  /* left strip + list */
  var NAMES = ['Charlie Apegian', 'Kiley Donahue', 'Jaxon Frami', 'Solon Crona', 'Emelia Toy', 'Arlo Swift', 'Kenton Emard', 'Eli Beer', 'Shea Trantow', 'Doug Pfeffer', 'Tod Corkery', 'Kobe Bayer', 'Jayson Ankunding', 'Gussie Jast', 'Crystel Crist', 'Eusebio Crona', 'Elmer Emmerich', 'Jalon Franecki', 'Coty Quitzon'];
  var left = document.createElement('div');
  left.className = 'ap-left'; left.innerHTML = '<button type="button" aria-label="Show ' + NOUN + ' list" data-ap-left>' + ic('keyboard-double-arrow-right') + '</button>';
  shell.insertBefore(left, main); main.classList.add('ap-has-left');
  var score = main.querySelector('.rmx-scoreboard'); if (score) left.style.height = score.getBoundingClientRect().height + 'px';
  var who = (document.querySelector('.pr-score__name') || {}).textContent || '';
  var list = document.createElement('aside');
  list.className = 'ap-list'; list.hidden = true; list.setAttribute('aria-label', NOUN + ' list');
  list.innerHTML = '<div class="ap__head"><span class="ap__title">' + (TENANT ? 'Tenants' : 'Prospects') + '</span><button type="button" class="ap__close" aria-label="Hide ' + NOUN + ' list" data-ap-left style="border:0;background:none;color:var(--icon-brand);cursor:pointer;display:inline-flex">' + ic('keyboard-double-arrow-left') + '</button></div>' +
    '<label class="ap__search ap__search--l" style="display:flex;align-items:center;gap:8px;height:36px;padding:0 8px;background:#f5f8fa;border:1px solid var(--border-primary);border-radius:4px;color:var(--icon-brand)">' + ic('search') + '<input type="text" placeholder="Find a ' + NOUN + '" style="flex:1;min-width:0;border:0;outline:0;background:none;font:italic 14px Roboto,sans-serif" aria-label="Find a ' + NOUN + '"></label>' +
    '<div class="ap-list__items">' + NAMES.map(function (n) { return '<a href="' + (TENANT ? 'tenant-details.html?t=' + encodeURIComponent(n) : 'prospect.html') + '"' + (n === who.trim() ? ' aria-current="true"' : '') + '>' + n + '</a>'; }).join('') + '</div>' +
    '<div class="ap-list__foot"><span>View: Last, First</span><span>' + (TENANT ? '255 Tenants' : '517 Prospects') + '</span></div>';
  document.body.appendChild(list);
  list.querySelector('input').addEventListener('input', function (e) { var q = e.target.value.toLowerCase(); [].forEach.call(list.querySelectorAll('.ap-list__items a'), function (a) { a.hidden = a.textContent.toLowerCase().indexOf(q) < 0; }); });

  document.addEventListener('click', function (e) {
    if (mail && e.target.closest('button') === mail) { panel.hidden = false; bar.hidden = true; show('communication'); return; }
    if (e.target.closest('[data-ap-close]')) { panel.hidden = true; bar.hidden = false; return; }
    var sec = e.target.closest('[data-ap-sec]'); if (sec) { show(sec.getAttribute('data-ap-sec')); return; }
    if (e.target.closest('[data-ap-left]')) { list.hidden = !list.hidden; return; }
    var x = e.target.closest('[data-ap-exp]');
    if (x) { var open = x.getAttribute('aria-expanded') === 'true'; x.setAttribute('aria-expanded', String(!open)); x.nextElementSibling.hidden = open; return; }
    if (e.target.closest('[data-ap-sendform]')) { if (window.RMX_SEND_FORM) window.RMX_SEND_FORM([who.trim() || 'Tenant']); }
  });
})();
