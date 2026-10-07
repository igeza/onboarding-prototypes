/* Administration > Onboarding Templates (the second option to the Workflow Templates designer).
   - Registers: saved templates (kept in this browser tab) are added to the register.
   - Add Onboarding Template dialog: Save keeps a draft and opens the Onboarding Template dialog.
   - Onboarding Template dialog: General / Onboarding Setup (steps) / Onboarding Completion. Add Step and the pencil open the
     Add Step dialog; the Action decides which Additional Information selector it shows (the same selectors the Workflow
     Templates designer uses). Saving the template writes the choices to the same tab storage the rmResident Portal
     preview reads, so the portal follows whichever designer was used last. Nothing is stored beyond this tab. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [].slice.call((r || document).querySelectorAll(s));
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const read = k => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
  const write = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const icon = (n, c) => '<svg class="rmx-icon' + (c ? ' ' + c : '') + '"><use href="#' + n + '"></use></svg>';

  /* ---------- registers: add the templates saved in this tab ---------- */
  const reg = $('#templates');
  if (reg) {
    (read('rmx-oa-templates') || []).forEach(t => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-rmx-row', '');
      tr.innerHTML = '<td><a class="oa-rowlink" href="onboarding-template.html?t=' + encodeURIComponent(t.name) + '">' + esc(t.name) + '</a></td><td>' + esc(t.desc || '') + '</td><td>' + esc(t.props || 'All Properties') + '</td><td>dsmith</td><td>dsmith</td>' +
        '<td class="oa-center"><svg class="rmx-icon oa-success"><use href="#check-circle-filled"></use></svg></td>' +
        '<td class="oa-tight"><button type="button" class="rmx-btn rmx-btn--text" aria-label="Actions" data-rmx-todo="Row actions are not built in this prototype">' + icon('more-vert', 'oa-blue') + '</button></td>';
      reg.tBodies[0].appendChild(tr);
    });
    /* the whole row opens the template, not just the name */
    reg.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      const tr = e.target.closest('tbody tr'), a = tr && tr.querySelector('a[href]');
      if (a) a.click();
    });
    reg.tBodies[0].style.cursor = 'pointer';
    const tot = $('[data-rmx-count="#templates"]');
    if (tot) { const n = reg.tBodies[0].rows.length; tot.textContent = n; if (tot.nextSibling) tot.nextSibling.nodeValue = ' of ' + n + ' Onboarding Templates'; }
  }

  /* ---------- Add Onboarding Template: Save keeps a draft and opens the template ---------- */
  const addSave = $('#oa-add-save');
  if (addSave) addSave.addEventListener('click', () => {
    write('rmx-oa-draft', { name: $('#oa-add-name').value.trim(), desc: $('#oa-add-desc').value.trim(), props: 'All Properties' });
  });

  /* ---------- Onboarding Template dialog ---------- */
  const listEl = $('#oa-steps');
  if (!listEl) return;

  const ACTIONS = ['Signable Document', 'File Attachment', 'Renters Insurance Selection', 'Make a Payment', 'Setup Payment Method', 'Form'];
  const DOCS = ['Parking Policy', 'Utility Service Agreement', 'Pet Policy Update'];
  const INS = ['Master Policy', 'Lease Track', 'No Insurance', 'Upload Policy'];
  const PAY = ['Payment Method', 'Autopay', 'Flex'];
  const FORMS = ['Pet Information', 'Gym Access', 'Notice to Vacate'];
  const TEMPLATES = { Default: '1127 Blackwell', Residential: 'Riverview Apartments', Commercial: 'Black Bear Condominiums' };

  const params = new URLSearchParams(location.search);
  const isNew = params.get('new') === '1';
  const draft = read('rmx-oa-draft') || {};
  let uid = 0;
  const mk = o => Object.assign({ id: ++uid, required: false }, o);
  let steps = isNew ? [] : [
    mk({ action: 'Signable Document', name: 'Signable Document', docs: ['Parking Policy', 'Utility Service Agreement'] }),
    mk({ action: 'File Attachment', name: 'File Attachment', files: [
      { name: 'Profile Photo', help: 'A clear photo of your face.', map: '', multi: false },
      { name: 'Proof of Income', help: 'Your last two pay stubs or a bank statement.', map: '', multi: true }] }),
    mk({ action: 'Renters Insurance Selection', name: 'Renters Insurance', options: ['Master Policy', 'Lease Track', 'No Insurance', 'Upload Policy'] }),
    mk({ action: 'Make a Payment', name: 'Make a Payment' }),
    mk({ action: 'Setup Payment Method', name: 'Setup Payment Method', pay: ['Payment Method', 'Autopay', 'Flex'] }),
    mk({ action: 'Form', name: 'Form', form: 'Pet Information' })
  ];

  /* General fields */
  const tName = isNew ? (draft.name || '') : (params.get('t') && TEMPLATES[params.get('t')] ? params.get('t') : 'Riverview Policies');
  $('#oa-t-name').value = tName;
  $('#oa-t-desc').value = isNew ? (draft.desc || '') : '';
  $('#oa-t-prop').value = isNew ? (draft.props || 'All Properties') : (TEMPLATES[tName] || 'Riverview Apartments');
  if (isNew) $('#oa-t-msg').value = '';

  const summary = s => {
    switch (s.action) {
      case 'Signable Document': return (s.docs || []).length + ' Selected';
      case 'File Attachment': return (s.files || []).length + ' Selected';
      case 'Renters Insurance Selection': return (s.options || []).join(', ');
      case 'Setup Payment Method': return (s.pay || []).join(', ');
      case 'Form': return s.form || '';
      default: return '';
    }
  };
  const row = s =>
    '<div class="oa-step" data-id="' + s.id + '"><span class="oa-step__name">' + esc(s.name) + '</span>' +
    '<span class="oa-step__sum">' + esc(summary(s)) + '</span><span class="oa-step__tools">' +
    (s.action === 'Make a Payment' ? '' : '<button type="button" class="oa-ico" data-oa-edit aria-label="Edit step">' + icon('edit-filled') + '</button>') +
    '<button type="button" class="oa-ico" data-oa-delete aria-label="Delete step">' + icon('delete-filled') + '</button>' +
    '<span class="oa-ico oa-handle" data-oa-handle tabindex="0" role="button" aria-label="Reorder step (drag, or press Up / Down)" title="Drag to reorder">' + icon('drag-indicator') + '</span></span></div>';
  const renderList = () => {
    listEl.innerHTML = steps.length ? steps.map(row).join('') : '<p class="oa-empty">No steps yet. Select Add Step to get started.</p>';
  };
  renderList();

  /* ----- Add Step dialog ----- */
  const dlg = $('#oa-step-dialog'), addl = $('#oa-addl'), filesBox = $('#oa-files'), actionDd = $('#oa-action'), nameIn = $('#oa-s-name'), reqBox = $('#oa-s-req');
  /* While Add Step is open the Onboarding Template behind it is dimmed too, the same way the page behind the template is. */
  const stepScrim = document.createElement('div');
  stepScrim.className = 'oa-scrim'; stepScrim.hidden = true;
  document.body.appendChild(stepScrim);
  new MutationObserver(() => { stepScrim.hidden = !dlg.classList.contains('is-open'); }).observe(dlg, { attributes: true, attributeFilter: ['class'] });
  let cur = null;        // the step being edited (a working copy)
  let autoName = '';     // the Step Name filled in from the Action, so a name the user typed is never overwritten

  const opt = (v, on) =>
    '<button type="button" data-value="' + esc(v) + '" role="option" aria-checked="' + on + '"><span class="rmx-check" data-checked="' + on + '"><span class="rmx-check__box">' + icon('check', 'rmx-icon--16') + '</span></span><span>' + esc(v) + '</span></button>';
  const multi = (label, list, sel) =>
    '<div class="rmx-field" data-rmx-dropdown data-rmx-multi data-rmx-component="Input Field"><span class="rmx-field__label">' + label + '</span>' +
    '<button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>' + esc((sel || []).join(', ')) + '</span>' + icon('keyboard-arrow-down') + '</button>' +
    '<div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + list.map(v => opt(v, (sel || []).indexOf(v) !== -1)).join('') + '</div></div>';
  const single = (label, list, sel) =>
    '<div class="rmx-field" data-rmx-dropdown data-rmx-component="Input Field"><span class="rmx-field__label">' + label + '</span>' +
    '<button type="button" class="rmx-field__box" data-rmx-trigger><span class="oa-value" data-rmx-value>' + esc(sel || '') + '</span>' + icon('keyboard-arrow-down') + '</button>' +
    '<div class="rmx-menu rmx-menu--list" data-rmx-menu hidden>' + list.map(v => '<button type="button" data-value="' + esc(v) + '">' + esc(v) + '</button>').join('') + '</div></div>';

  function renderAddl() {
    const a = cur.action;
    filesBox.hidden = a !== 'File Attachment';
    addl.hidden = !a || a === 'File Attachment' || a === 'Make a Payment';
    if (a === 'Signable Document') addl.innerHTML = multi('Select Documents', DOCS, cur.docs);
    else if (a === 'Renters Insurance Selection') addl.innerHTML = multi('Select Options to Include', INS, cur.options);
    else if (a === 'Setup Payment Method') addl.innerHTML = multi('Select Steps to Include', PAY, cur.pay);
    else if (a === 'Form') addl.innerHTML = single('Select Form', FORMS, cur.form);
    else addl.innerHTML = '';
    if (a === 'File Attachment' && window.RMXFiles) window.RMXFiles.set(cur.files && cur.files.length ? cur.files : [{}, {}]);   // a new File step starts with two unnamed files, as in the mock
    if (window.RMX && RMX.dropdowns) RMX.dropdowns();
  }
  function openStep(step) {
    /* Add Step starts empty: no Action, no Step Name, no Additional Information until an Action is chosen. */
    cur = step ? JSON.parse(JSON.stringify(step)) : { id: 0, action: '', name: '', required: false, docs: [], files: [], options: [], pay: [], form: '' };
    $('#oa-step-title').textContent = step ? 'Edit Step' : 'Add Step';
    $('#oa-save-new').hidden = !!step;   // Save & New only makes sense when adding
    const av = $('[data-rmx-value]', actionDd);
    av.textContent = cur.action; av.classList.toggle('rmx-placeholder', !cur.action);
    $$('[data-value]', actionDd).forEach(o => o.setAttribute('aria-selected', String(o.dataset.value === cur.action)));
    nameIn.value = cur.name; autoName = step && step.name === step.action ? step.action : '';
    actionDd.querySelector('.rmx-field__box').classList.remove('oa-invalid'); nameIn.closest('.rmx-field__box').classList.remove('oa-invalid');
    reqBox.dataset.checked = String(!!cur.required);
    renderAddl();
    RMX.openOverlay('oa-step-dialog');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();   // no focus ring on the close button when the dialog opens
  }
  function collect() {
    cur.name = nameIn.value.trim();
    cur.required = reqBox.dataset.checked === 'true';
    const picked = () => $$('[data-value][aria-checked="true"]', addl).map(o => o.dataset.value);
    if (cur.action === 'Signable Document') cur.docs = picked();
    else if (cur.action === 'Renters Insurance Selection') cur.options = picked();
    else if (cur.action === 'Setup Payment Method') cur.pay = picked();
    else if (cur.action === 'Form') cur.form = ($('[data-rmx-value]', addl) || {}).textContent.trim();
    else if (cur.action === 'File Attachment' && window.RMXFiles) cur.files = window.RMXFiles.get();
  }
  function saveStep() {
    collect();
    if (!cur.action) { const ab = actionDd.querySelector('.rmx-field__box'); ab.classList.add('oa-invalid'); ab.focus(); return false; }
    if (!cur.name) { nameIn.focus(); nameIn.closest('.rmx-field__box').classList.add('oa-invalid'); return false; }
    nameIn.closest('.rmx-field__box').classList.remove('oa-invalid');
    if (cur.id) steps = steps.map(s => s.id === cur.id ? JSON.parse(JSON.stringify(cur)) : s);
    else { cur.id = ++uid; steps.push(JSON.parse(JSON.stringify(cur))); }
    renderList();
    return true;
  }

  actionDd.addEventListener('rmx:select', e => {
    cur.action = e.detail.value;
    actionDd.querySelector('.rmx-field__box').classList.remove('oa-invalid');
    $('[data-rmx-value]', actionDd).classList.remove('rmx-placeholder');
    /* The default Step Name is the Action itself, until the user types their own. */
    const prev = nameIn.value.trim();
    if (!prev || prev === autoName) { nameIn.value = cur.action; autoName = cur.action; nameIn.closest('.rmx-field__box').classList.remove('oa-invalid'); }
    renderAddl();
  });
  nameIn.addEventListener('input', () => nameIn.closest('.rmx-field__box').classList.remove('oa-invalid'));
  $('#oa-add-step').addEventListener('click', e => { e.preventDefault(); openStep(null); });
  /* Save & New keeps the step and starts a fresh, empty Add Step; Save keeps the step and closes the dialog. */
  $('#oa-save-new').addEventListener('click', () => { if (saveStep()) { if (RMX.toast) RMX.toast('Step saved', 'success'); openStep(null); } });
  $('#oa-save').addEventListener('click', () => { if (saveStep()) RMX.closeOverlay(dlg); });

  listEl.addEventListener('click', e => {
    const r = e.target.closest('.oa-step'); if (!r) return;
    const id = +r.dataset.id;
    if (e.target.closest('[data-oa-edit]')) { openStep(steps.find(s => s.id === id)); return; }
    if (e.target.closest('[data-oa-delete]')) { steps = steps.filter(s => s.id !== id); renderList(); }
  });

  /* Reorder: pick a step up by its handle or anywhere on the row (mouse; touch uses the handle) and put it down somewhere else.
     The row lifts (scales up, gets a shadow), follows the pointer, the other rows slide out of its way, and on release it
     settles into its slot. Or focus the handle and press Up / Down. */
  const tops = () => new Map($$('.oa-step', listEl).map(el => [el, el.getBoundingClientRect().top]));
  const slide = (before, skip) => $$('.oa-step', listEl).forEach(el => {          // FLIP: rows that moved glide from where they were
    if (el === skip) return;
    const dy = before.get(el) - el.getBoundingClientRect().top;
    if (!dy) return;
    el.style.transition = 'none'; el.style.transform = 'translateY(' + dy + 'px)';
    el.getBoundingClientRect();
    el.style.transition = 'transform .2s cubic-bezier(.2, .8, .2, 1)'; el.style.transform = '';
    setTimeout(() => { el.style.transition = ''; }, 240);
  });
  listEl.addEventListener('pointerdown', e => {
    if (e.button) return;
    const it = e.target.closest('.oa-step');
    if (!it || e.target.closest('[data-oa-edit], [data-oa-delete]')) return;
    const h = e.target.closest('[data-oa-handle]');
    if (!h && e.pointerType === 'touch') return;   // touch drags by the handle only, so the list can still scroll
    e.preventDefault();
    const grab = e.clientY - it.getBoundingClientRect().top;
    let dy = 0;
    const follow = y => {
      const natural = listEl.getBoundingClientRect().top + it.offsetTop;
      dy = (y - grab) - natural;
      it.style.setProperty('--oa-dy', dy + 'px');
    };
    it.classList.add('is-lifted');
    document.body.classList.add('oa-reordering');
    it.setPointerCapture(e.pointerId);
    follow(e.clientY);
    const move = ev => {
      follow(ev.clientY);
      /* Which slot is the row over? Rows are one height apart, so work it out from where the lifted row's top is: this
         lets it travel any number of places in one drag, and does not depend on rows that are mid-slide. */
      const list = $$('.oa-step', listEl), n = list.length, rowH = it.offsetHeight, gap = parseFloat(getComputedStyle(listEl).rowGap) || 0;
      const top = ev.clientY - grab - listEl.getBoundingClientRect().top;
      const slot = Math.max(0, Math.min(n - 1, Math.round(top / (rowH + gap))));
      const cur = list.indexOf(it);
      if (slot === cur) return;
      const before = tops();
      /* Move the rows it passed, not the lifted row itself: re-inserting a captured element makes the browser drop the
         pointer capture, which used to end the drag after a single move. */
      if (slot > cur) for (let i = cur + 1; i <= slot; i++) listEl.insertBefore(list[i], it);
      else { const ref = it.nextSibling; for (let i = slot; i < cur; i++) listEl.insertBefore(list[i], ref); }
      slide(before, it);
      follow(ev.clientY);
    };
    const end = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      document.body.classList.remove('oa-reordering');
      /* put down: from where the pointer left it, settle into the slot while the lift (scale + shadow) eases off */
      it.classList.remove('is-lifted');
      it.style.transition = 'none'; it.style.transform = 'translateY(' + dy + 'px) scale(1.02)'; it.style.boxShadow = '0 8px 18px rgba(0, 0, 0, .2)'; it.style.zIndex = '5';
      it.getBoundingClientRect();
      it.style.transition = 'transform .22s cubic-bezier(.2, .8, .2, 1), box-shadow .22s ease';
      it.style.transform = 'translateY(0) scale(1)'; it.style.boxShadow = '';
      setTimeout(() => { it.style.transition = ''; it.style.transform = ''; it.style.zIndex = ''; it.style.removeProperty('--oa-dy'); }, 260);
      const order = $$('.oa-step', listEl).map(el => +el.dataset.id);
      steps.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  });
  listEl.addEventListener('keydown', e => {
    const h = e.target.closest('[data-oa-handle]');
    if (!h || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    const id = +h.closest('.oa-step').dataset.id, i = steps.findIndex(s => s.id === id), k = e.key === 'ArrowUp' ? i - 1 : i + 1;
    if (k < 0 || k >= steps.length) return;
    steps.splice(k, 0, steps.splice(i, 1)[0]);
    renderList();
    const again = listEl.querySelector('.oa-step[data-id="' + id + '"] [data-oa-handle]'); if (again) again.focus();
  });

  /* ----- Save the template ----- */
  $('#oa-t-save').addEventListener('click', () => {
    const find = a => steps.find(s => s.action === a);
    const d = find('Signable Document'), f = find('File Attachment'), r = find('Renters Insurance Selection'), p = find('Setup Payment Method'), fm = find('Form');
    write('rmx-documents', d ? d.docs : []);
    write('rmx-files', f ? f.files : []);
    write('rmx-insurance-options', r ? r.options.map(o => o === 'Lease Track' ? 'LeaseTrack' : o) : []);
    write('rmx-payment-steps', p ? p.pay.filter(x => x !== 'Flex') : []);
    write('rmx-form', fm && fm.form ? [fm.form] : []);
    const name = $('#oa-t-name').value.trim() || 'Untitled Template';
    if (isNew) {
      const all = read('rmx-oa-templates') || [];
      all.push({ name, desc: $('#oa-t-desc').value.trim(), props: $('#oa-t-prop').value.trim() });
      write('rmx-oa-templates', all);
      try { sessionStorage.removeItem('rmx-oa-draft'); } catch (e) {}
    }
    window.location.href = 'onboarding-templates.html';
  });
})();
