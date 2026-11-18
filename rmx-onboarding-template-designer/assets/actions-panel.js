/* Actions panel for the Tenant / Prospect detail pages (Rent Manager's Actions flyout, Izzy's screenshot 2026-11-18).
   The mail button in the narrow action bar opens it on Communication; the double chevron closes it.
   Communication lists Document Packets, Publish Signable Documents, Send Email, Send Form, Send Survey, Send Text, Write Letter.
   Send Form opens the single-person Send Form dialog (send-onboarding.js, window.RMX_SEND_FORM) for the person on the page. */
(function () {
  var bar = document.querySelector('.rmx-actionbar'); if (!bar) return;
  var P = {
    bookmark: 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z',
    task: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
    key: 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
    dollar: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'
  };
  function pic(k) { return '<svg class="rmx-icon" viewBox="0 0 24 24" fill="currentColor"><path d="' + P[k] + '"/></svg>'; }
  function ic(n) { return '<svg class="rmx-icon"><use href="#' + n + '"></use></svg>'; }
  var SURVEYS = ['branding', 'Community Event Ideas', 'Community Rules', 'Contact', 'General Amenities', 'How is your new home?', 'Resident Satisfaction Survey'];
  var css = document.createElement('style');
  css.textContent =
    '.ap { position: fixed; z-index: 60; top: 96px; right: 8px; bottom: 8px; width: 330px; display: flex; flex-direction: column; gap: var(--spacing-sm); padding: var(--spacing-md); background: var(--container-primary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); box-shadow: 0 3px 8px rgba(0,0,0,.18); }' +
    '.ap[hidden] { display: none; }' +
    '.ap__head { display: flex; align-items: center; justify-content: space-between; }.ap__title { font: var(--type-heading-s-semibold, 600 18px/24px Roboto, sans-serif); color: var(--text-secondary); }' +
    '.ap button { border: 0; background: none; padding: 0; font: inherit; color: inherit; cursor: pointer; }' +
    '.ap__close { display: inline-flex; color: var(--icon-brand); }' +
    '.ap__search { display: flex; align-items: center; gap: var(--spacing-xs); height: 36px; padding: 0 var(--spacing-xs); background: var(--component-input-default, #f5f8fa); border: 1px solid var(--border-primary); border-radius: var(--radius-sm); color: var(--icon-brand); }.ap__search input { flex: 1; border: 0; outline: 0; background: none; font: italic var(--type-label-m-regular, 14px Roboto, sans-serif); color: var(--text-secondary); }' +
    '.ap__body { flex: 1; min-height: 0; display: flex; gap: var(--spacing-sm); }' +
    '.ap__rail { display: flex; flex-direction: column; gap: var(--spacing-xs); padding-right: var(--spacing-sm); border-right: 1px solid var(--border-primary); }.ap__rail button { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius-sm); color: var(--text-secondary); }.ap__rail button[aria-pressed="true"] { background: #d6e8f5; }' +
    '.ap__list { flex: 1; min-width: 0; overflow-y: auto; }.ap__h { margin: 0 0 var(--spacing-sm); font: var(--type-heading-s-semibold, 600 18px/24px Roboto, sans-serif); color: var(--text-secondary); }' +
    '.ap__it { display: flex; align-items: center; gap: var(--spacing-xs); width: 100%; min-height: 32px; padding: 0 var(--spacing-xs); text-align: left; color: var(--text-secondary); font: var(--type-label-m-regular, 14px Roboto, sans-serif); }.ap__it:hover { background: var(--container-tertiary); }.ap__it .rmx-icon { width: 16px; height: 16px; }' +
    '.ap .ap__it { padding: 0 var(--spacing-xs); }.ap .ap__it--plain { padding-left: 24px; }.ap__sub { padding-left: 8px; }.ap__sub .ap__it { min-height: 28px; }.ap__sub[hidden] { display: none; }.ap__it[aria-expanded="true"] > .rmx-icon { transform: rotate(90deg); }';
  document.head.appendChild(css);
  var panel = document.createElement('aside');
  panel.className = 'ap'; panel.hidden = true; panel.setAttribute('aria-label', 'Actions'); panel.setAttribute('data-rmx-component', 'Actions Panel');
  function expandable(label, kids) { return '<button type="button" class="ap__it" aria-expanded="false" data-ap-exp>' + ic('chevron-right') + label + '</button><div class="ap__sub" hidden>' + (kids || ['Not built in this prototype']).map(function (k) { return '<button type="button" class="ap__it ap__it--plain" data-rmx-todo="' + k + ' is not built in this prototype">' + k + '</button>'; }).join('') + '</div>'; }
  panel.innerHTML =
    '<div class="ap__head"><span class="ap__title">Actions</span><button type="button" class="ap__close" aria-label="Close Actions" data-ap-close>' + ic('keyboard-double-arrow-right') + '</button></div>' +
    '<label class="ap__search">' + ic('search') + '<input type="text" placeholder="Find an action" aria-label="Find an action"></label>' +
    '<div class="ap__body"><div class="ap__rail">' +
      ['bookmark', 'task', 'key', 'dollar'].map(function (k) { return '<button type="button" aria-label="' + k + '" data-rmx-todo="This section is not built in this prototype">' + pic(k) + '</button>'; }).join('') +
      '<button type="button" aria-label="Communication" aria-pressed="true">' + ic('mail') + '</button><button type="button" aria-label="Reports" data-rmx-todo="This section is not built in this prototype">' + ic('description') + '</button><button type="button" aria-label="Settings" data-rmx-todo="This section is not built in this prototype">' + ic('settings') + '</button></div>' +
    '<div class="ap__list"><p class="ap__h">Communication</p>' +
      expandable('Document Packets') +
      '<button type="button" class="ap__it ap__it--plain" data-rmx-todo="Publish Signable Documents is not built in this prototype">Publish Signable Documents</button>' +
      expandable('Send Email') +
      '<button type="button" class="ap__it ap__it--plain" data-ap-sendform>Send Form</button>' +
      expandable('Send Survey', SURVEYS) + expandable('Send Text') + expandable('Write Letter') +
    '</div></div>';
  document.body.appendChild(panel);
  var mail = bar.querySelector('button[aria-label="Send email"]');
  if (mail) { mail.setAttribute('aria-label', 'Communication'); mail.removeAttribute('data-rmx-todo'); }
  function nameOnPage() { var n = document.querySelector('.pr-score__name'); return n ? n.textContent.trim() : ''; }
  document.addEventListener('click', function (e) {
    if (mail && e.target.closest('button') === mail) { panel.hidden = !panel.hidden; return; }
    if (e.target.closest('[data-ap-close]')) { panel.hidden = true; return; }
    var x = e.target.closest('[data-ap-exp]');
    if (x) { var open = x.getAttribute('aria-expanded') === 'true'; x.setAttribute('aria-expanded', String(!open)); x.nextElementSibling.hidden = open; return; }
    if (e.target.closest('[data-ap-sendform]')) { if (window.RMX_SEND_FORM) window.RMX_SEND_FORM([nameOnPage() || 'Tenant']); }
  });
})();
