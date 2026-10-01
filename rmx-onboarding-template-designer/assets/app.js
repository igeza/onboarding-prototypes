/* RMX prototype behaviour layer — the same file in every prototype.

   Screens stay declarative: you write markup with data- attributes, this
   wires the behaviour. Nothing here is app logic, and nothing here invents
   a visual. Every class it touches is already defined in rmx.css.

   Why it exists: without it, each designer hand-writes a different toggle
   in each screen and the prototypes stop behaving alike. It is also the
   part a developer can throw away cleanly — the markup is the deliverable,
   this is the fake wiring around it.

   Never use alert(), confirm() or prompt() in a prototype.

   RMX.toast() is for ONE thing: confirming that an action completed. Saved,
   submitted, added, deleted, imported. It is not an acknowledgement that a
   click was received, and it never fires on navigation, filtering, sorting,
   opening a panel or clicking something unbuilt. If nothing durable changed,
   nothing pops.
*/
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- tabs ----------
     <div class="rmx-tabrow" data-rmx-tabs>
       <button class="rmx-tab" aria-selected="true" data-panel="summary">Summary</button>
     </div>
     <section data-tab-panel="summary">…</section>                       */
  function tabs() {
    $$('[data-rmx-tabs]').forEach(row => {
      row.addEventListener('click', e => {
        const tab = e.target.closest('.rmx-tab[data-panel]');
        if (!tab || !row.contains(tab)) return;
        $$('.rmx-tab', row).forEach(t => t.setAttribute('aria-selected', String(t === tab)));
        const scope = row.closest('[data-rmx-tabscope]') || document;
        $$('[data-tab-panel]', scope).forEach(p => {
          p.hidden = p.dataset.tabPanel !== tab.dataset.panel;
        });
      });
    });
  }

  /* ---------- dropdowns ----------
     Never a native <select> — that is an audit error. Instead:
     <div data-rmx-dropdown>
       <button class="rmx-field__box" data-rmx-trigger>Status<svg …></button>
       <div class="rmx-menu" data-rmx-menu hidden>
         <button data-value="active">Active</button>
       </div>
     </div>
     Choosing an option writes its text into [data-rmx-value] (or the
     trigger itself) and fires an `rmx:select` event on the wrapper.       */
  function dropdowns() {
    $$('[data-rmx-dropdown]').forEach(dd => {
      if (dd._rmxBound) return;
      dd._rmxBound = true;
      if (dd.dataset.rmxStore) {   // restore a saved choice; a store nobody has touched yet starts empty
        const key = dd.dataset.rmxStore;
        const m = $('[data-rmx-menu]', dd), val = $('[data-rmx-value]', dd);
        let saved = []; try {
          const raw = sessionStorage.getItem(key);
          if (raw === null) {   // first time: everything is chosen (a single-choice dropdown gets its first option)
            const all = $$('[data-value]', m).map(o => o.dataset.value);
            saved = dd.hasAttribute('data-rmx-multi') ? all : all.slice(0, 1);
            sessionStorage.setItem(key, JSON.stringify(saved));
          } else saved = JSON.parse(raw);
        } catch (err) {}
        if (saved.length && m && val) {
          if (dd.hasAttribute('data-rmx-multi')) {
            $$('[data-value]', m).forEach(o => { const on = saved.includes(o.dataset.value); o.setAttribute('aria-checked', String(on)); const c = $('.rmx-check', o); if (c) c.dataset.checked = String(on); });
            val.dataset.placeholder = val.textContent; val.textContent = saved.join(', '); val.classList.remove('rmx-placeholder');
          } else {
            val.textContent = saved[0]; val.classList.remove('rmx-placeholder');
          }
        }
      }
      const trigger = $('[data-rmx-trigger]', dd) || dd.firstElementChild;
      const menu    = $('[data-rmx-menu]', dd);
      if (!trigger || !menu) return;

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const open = !menu.hidden;
        closeAllMenus();
        menu.hidden = open;
        dd.dataset.open = String(!open);
        if (!open && q) { q.value = ''; q.dispatchEvent(new Event('input')); q.focus(); }
        if (!open && !dd.hasAttribute('data-rmx-multi')) {   // highlight the option that matches the current value
          const v = $('[data-rmx-value]', dd), cur = v && !v.classList.contains('rmx-placeholder') ? v.textContent.trim() : '';
          $$('[data-value]', menu).forEach(o => o.setAttribute('aria-selected', String(cur !== '' && o.textContent.trim() === cur)));
        }
      });

      const q = $('.rmx-menu__search input', menu);   // search bar: filters the options as you type
      if (q) q.addEventListener('input', () => {
        const term = q.value.trim().toLowerCase();
        $$('[data-value]', menu).forEach(o => { o.hidden = !!term && !o.dataset.value.toLowerCase().includes(term); });
        let none = $('.rmx-menu__empty', menu);
        const any = $$('[data-value]', menu).some(o => !o.hidden);
        if (!any && !none) { none = document.createElement('div'); none.className = 'rmx-menu__empty'; none.textContent = 'No results'; menu.appendChild(none); }
        if (none) none.hidden = any;
      });

      menu.addEventListener('click', e => {
        const opt = e.target.closest('[data-value]');
        if (!opt) return;
        if (dd.hasAttribute('data-rmx-actions')) {   // action menu (kebab): run the action, leave the trigger alone
          menu.hidden = true; dd.dataset.open = 'false';
          dd.dispatchEvent(new CustomEvent('rmx:action', { bubbles: true, detail: { action: opt.dataset.value } }));
          return;
        }
        if (dd.hasAttribute('data-rmx-multi')) {   // multiselect: options toggle, the menu stays open
          const box = $('.rmx-check', opt), on = opt.getAttribute('aria-checked') !== 'true';
          opt.setAttribute('aria-checked', String(on));
          if (box) box.dataset.checked = String(on);
          const val = $('[data-rmx-value]', dd), names = $$('[data-value][aria-checked="true"]', menu).map(o => o.dataset.value);
          if (!val.dataset.placeholder) val.dataset.placeholder = val.textContent;
          val.textContent = names.length ? names.join(', ') : val.dataset.placeholder;
          val.classList.toggle('rmx-placeholder', !names.length);
          if (dd.dataset.rmxStore) { try { sessionStorage.setItem(dd.dataset.rmxStore, JSON.stringify(names)); } catch (err) {} }   // read by the rmResident preview
          dd.dispatchEvent(new CustomEvent('rmx:select', { bubbles: true, detail: { values: names } }));
          return;
        }
        const label = $('[data-rmx-value]', dd) || trigger;
        const slot = $('[data-rmx-value]', label) || label;
        if (slot.firstChild && slot.firstChild.nodeType === 3) slot.firstChild.nodeValue = opt.textContent.trim();
        else slot.textContent = opt.textContent.trim();
        slot.classList.remove('rmx-placeholder');
        if (dd.dataset.rmxStore) { try { sessionStorage.setItem(dd.dataset.rmxStore, JSON.stringify([opt.textContent.trim()])); } catch (err) {} }
        $$('[data-value]', menu).forEach(o => o.setAttribute('aria-selected', String(o === opt)));
        menu.hidden = true;
        dd.dataset.open = 'false';
        dd.dispatchEvent(new CustomEvent('rmx:select', {
          bubbles: true, detail: { value: opt.dataset.value, label: opt.textContent.trim() }
        }));
      });
    });
  }

  function closeAllMenus() {
    $$('[data-rmx-menu]').forEach(m => { m.hidden = true; });
    $$('[data-rmx-dropdown]').forEach(d => { d.dataset.open = 'false'; });
  }

  /* ---------- overlays and panels ----------
     <button data-rmx-open="add-charge">Add charge</button>
     <div class="rmx-overlay" id="add-charge" hidden>… <button data-rmx-close>  */
  function overlays() {
    document.addEventListener('click', e => {
      const opener = e.target.closest('[data-rmx-open]');
      if (opener) {
        e.preventDefault();
        openOverlay(opener.dataset.rmxOpen);
        return;
      }
      if (e.target.closest('[data-rmx-close]')) {
        e.preventDefault();
        closeOverlay(e.target.closest('.rmx-overlay, [data-rmx-panel]'));
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeAllMenus(); closeOverlay(); }
    });
  }

  function scrim() {
    let s = $('.rmx-scrim');
    if (!s) {
      s = document.createElement('div');
      s.className = 'rmx-scrim';
      s.hidden = true;
      s.addEventListener('click', () => closeOverlay());
      document.body.appendChild(s);
    }
    return s;
  }

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    el.classList.add('is-open');
    scrim().hidden = false;
    const f = $('input, button, [tabindex]', el);
    if (f) f.focus();
  }

  function closeOverlay(el) {
    const targets = el ? [el] : $$('.rmx-overlay.is-open, [data-rmx-panel].is-open');
    targets.forEach(t => { t.classList.remove('is-open'); t.hidden = true; });
    if (!$('.rmx-overlay.is-open, [data-rmx-panel].is-open')) scrim().hidden = true;
  }

  /* ---------- checkboxes, radios, register select-all ----------
     RMX draws its own; a native one is an audit error. A checked box is
     orange (--icon-attention) except the select-all above a register,
     which is blue — that is the rmx-check--register modifier, not a
     colour you set here.                                                  */
  function choices() {
    document.addEventListener('click', e => {
      const check = e.target.closest('.rmx-check');
      if (check && !check.hasAttribute('data-static')) {
        const on = check.dataset.checked !== 'true';
        check.dataset.checked = String(on);
        const all = check.closest('[data-rmx-selectall]');
        if (all) {
          const table = document.getElementById(all.dataset.rmxSelectall) || all.closest('.rmx-tile, section');
          if (table) $$('.rmx-check', table).forEach(c => { if (c !== check) c.dataset.checked = String(on); });
        }
        check.dispatchEvent(new CustomEvent('rmx:change', { bubbles: true, detail: { checked: on } }));
        return;
      }
      const radio = e.target.closest('.rmx-radio');
      if (radio && !radio.hasAttribute('data-static')) {
        const group = radio.closest('[data-rmx-radiogroup]') || document;
        $$('.rmx-radio', group).forEach(r => { r.dataset.checked = String(r === radio); });
      }
    });
  }

  /* ---------- register sort ----------
     <th data-sort="text|number|date">Tenant</th>                          */
  function sorting() {
    $$('.rmx-register').forEach(table => {
      const head = $('thead', table);
      if (!head) return;
      head.addEventListener('click', e => {
        const th = e.target.closest('th[data-sort]');
        if (!th) return;
        const body = $('tbody', table);
        if (!body) return;
        const idx = Array.from(th.parentNode.children).indexOf(th);
        const dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';
        $$('th[data-sort]', head).forEach(h => delete h.dataset.dir);
        th.dataset.dir = dir;
        const val = tr => {
          const raw = (tr.children[idx]?.textContent || '').trim();
          if (th.dataset.sort === 'number') return parseFloat(raw.replace(/[^0-9.\-]/g, '')) || 0;
          if (th.dataset.sort === 'date') return new Date(raw).getTime() || 0;
          return raw.toLowerCase();
        };
        Array.from(body.rows)
          .sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (dir === 'asc' ? 1 : -1))
          .forEach(r => body.appendChild(r));
        restripe(body);
      });
    });
  }

  /* Striping is OPT-IN and always was in the design system — a register is
     not striped unless the design says so. Earlier this ran on every register
     automatically, which put zebra stripes on screens nobody asked for.
     Opt in per table with <table class="rmx-register" data-rmx-striped>. */
  function restripe(body) {
    const table = body.closest('.rmx-register');
    if (!table || !table.hasAttribute('data-rmx-striped')) return;
    let i = 0;
    for (const r of body.rows) { if (!r.hidden) { r.dataset.striped = String(i % 2 === 1); i++; } }
  }

  /* ---------- filtering ----------
     <input data-rmx-filter="#charges"> filters rows of that table/list.
     Also updates any [data-rmx-count="#charges"] with the visible count.  */
  function filtering() {
    $$('[data-rmx-filter]').forEach(input => {
      input.addEventListener('input', () => {
        const target = $(input.dataset.rmxFilter);
        if (!target) return;
        const q = input.value.trim().toLowerCase();
        const rows = $$('tbody tr, [data-rmx-row]', target);
        let shown = 0;
        rows.forEach(r => {
          const hit = !q || r.textContent.toLowerCase().includes(q);
          r.hidden = !hit;
          if (hit) shown++;
        });
        const body = $('tbody', target);
        if (body) restripe(body);
        $$(`[data-rmx-count="${input.dataset.rmxFilter}"]`).forEach(c => { c.textContent = shown; });
        const empty = $('[data-rmx-empty]', target) || document.querySelector(`[data-rmx-empty="${input.dataset.rmxFilter}"]`);
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* ---------- toasts ----------
     RMX.toast('Charge added', 'success')  — success | failure | neutral

     Only after something completed. 'success' is the green State=Success and
     belongs to a completed write; 'failure' is the pale-pink State=Failure
     when one did not go through; the neutral default is State=Action, for a
     job that has started and will finish elsewhere. Nothing else gets one. */
  function toast(message, kind = 'neutral', ms = 3200) {
    let stack = $('.rmx-toaststack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'rmx-toaststack';
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    el.className = 'rmx-toast' + (kind === 'neutral' ? '' : ` rmx-toast--${kind}`);
    el.setAttribute('role', 'status');
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => { el.remove(); }, ms);
    return el;
  }

  /* ---------- unwired affordances ----------
     data-rmx-todo marks something the prototype does not build. Clicking it
     does NOTHING: the click is swallowed so a link cannot navigate to a page
     that isn't there, and no message appears.

     Until 4.2.0 this popped a neutral toast. It was removed because a toast
     in RMX means an action completed, and firing one because someone clicked
     an inert icon taught stakeholders to read every toast as noise — which
     is exactly what makes a real save confirmation get ignored.

     The attribute still earns its place: it keeps the intent in the source,
     the audit can count what is unbuilt, and PROTOTYPE.md is where the
     designer tells people what is faked. That is the honest channel for it,
     not a pop-up mid-demo. */
  function todos() {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-rmx-todo]');
      if (!el) return;
      e.preventDefault();
    });
  }

  /* ---------- icons ----------
     Screens reference the shared symbol sheet: <svg class="rmx-icon">
     <use href="../assets/icons.svg#keyboard-arrow-down"></use></svg>
     bundle.mjs rewrites those into inlined symbols when publishing, so the
     same markup works in a repo and in a published page.                  */

  document.addEventListener('click', e => {
    if (!e.target.closest('[data-rmx-dropdown]')) closeAllMenus();
  });

  function init(root) {
    tabs(); dropdowns(); overlays(); choices(); sorting(); filtering(); todos();
    $$('.rmx-register[data-rmx-striped] tbody').forEach(restripe);
  }

  /* Step register: choosing an Action swaps the Additional Information cell for the one that action uses
     (a <template data-addl="Action name"> on the page; no template = nothing to configure). */
  document.addEventListener('rmx:select', e => {
    const dd = e.target.closest('[data-rmx-dropdown]'), td = dd && dd.closest('#steps td:nth-child(2)');
    if (!td) return;
    const cell = td.nextElementSibling, tpl = $$('template[data-addl]').find(t => t.dataset.addl === e.detail.label);
    cell.innerHTML = tpl ? tpl.innerHTML : '';
    dropdowns(); renderFiles();
  });

  /* Reorder: drag a step by its handle; the row follows the pointer and settles where it is dropped. */
  document.addEventListener('pointerdown', e => {
    const handle = e.target.closest('[data-rmx-reorder]'), row = handle && handle.closest('#steps tbody tr');
    if (!row) return;
    e.preventDefault();
    const body = row.parentElement;
    row.classList.add('is-dragging');
    handle.setPointerCapture(e.pointerId);
    const move = ev => {
      const over = document.elementsFromPoint(ev.clientX, ev.clientY).map(el => el.closest && el.closest('#steps tbody tr')).find(r => r && r !== row && r.parentElement === body);
      if (!over) return;
      const box = over.getBoundingClientRect(), after = ev.clientY > box.top + box.height / 2;
      if (after && over.nextElementSibling !== row) over.after(row);
      else if (!after && over.previousElementSibling !== row) over.before(row);
    };
    const end = () => {
      row.classList.remove('is-dragging');
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      handle.removeEventListener('lostpointercapture', end);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
    handle.addEventListener('lostpointercapture', end);
    window.addEventListener('pointerup', end, { once: true });
  });

  /* Step kebab: Copy duplicates the step under itself, Delete removes it. */
  document.addEventListener('rmx:action', e => {
    const row = e.target.closest('#steps tbody tr');
    if (!row) return;
    if (e.detail.action === 'Delete') { row.remove(); return; }
    if (e.detail.action === 'Copy') {
      const copy = row.cloneNode(true);
      $$('[data-rmx-store]', copy).forEach(d => d.removeAttribute('data-rmx-store'));   // the copy must not overwrite what the preview reads
      $$('[data-rmx-menu]', copy).forEach(m => { m.hidden = true; });
      $$('[data-rmx-dropdown]', copy).forEach(d => { d.dataset.open = 'false'; });
      const name = $('input', copy), orig = $('input', row);
      if (name && orig) name.value = orig.value;
      row.after(copy);
      dropdowns();
    }
  });

  /* Add Step appends an empty row under the last step (name, action and additional information start blank). */
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-rmx-add-step]'), tpl = document.getElementById('new-step-row');
    if (!add || !tpl) return;
    e.preventDefault();
    const body = $('#steps tbody');
    body.appendChild(tpl.content.cloneNode(true));
    dropdowns();
    const input = $('input', body.lastElementChild);
    if (input) input.focus();
  });

  /* File Attachment step: once files are saved in Select Files the cell reads "N Selected" with a pencil to edit them. */
  function renderFiles() {
    let files = []; try { const raw = sessionStorage.getItem('rmx-files'); if (raw === null) sessionStorage.setItem('rmx-files', '[]'); else files = JSON.parse(raw); } catch (e) {}
    const n = files.length;
    $$('[data-rmx-files]').forEach(c => {
      if (!c._rmxLink) c._rmxLink = c.innerHTML;   // the original "Select Files" link
      c.innerHTML = n ? '<span class="rmx-text">' + n + ' Selected</span><a class="rmx-btn rmx-btn--text" href="select-files.html" aria-label="Edit files" data-rmx-component="Button"><svg class="rmx-icon wt-blue"><use href="#edit-filled"></use></svg></a>' : c._rmxLink;
    });
  }
  document.addEventListener('DOMContentLoaded', renderFiles);
  if (document.readyState !== 'loading') renderFiles();

  window.RMX = { init, toast, openOverlay, closeOverlay, restripe, dropdowns, renderFiles };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
