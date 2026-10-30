/* RMX Date Picker, Style=Calendar (Figma RMX Components 157:2396), opened from a date field.
   Markup: <div class="rmx-field__box rmx-date"><input type="text"><button type="button" class="rmx-date__btn">calendar icon</button></div>
   The calendar is 288px wide; weeks alternate white and Component/input-default, the chosen day is filled blue,
   days from the neighbouring months are greyed, and Today / Clear sit under it. */
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var pop = null, cur = null, view = null;
  function pad(n) { return ('0' + n).slice(-2); }
  function fmt(d) { return pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear(); }
  function parse(v) { var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((v || '').trim()); if (!m) return null; var d = new Date(+m[3], +m[1] - 1, +m[2]); return isNaN(d) ? null : d; }
  function same(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function icon(n) { return '<svg class="rmx-icon"><use href="#' + n + '"></use></svg>'; }
  function close() { if (pop) { pop.remove(); pop = null; cur = null; } }
  function render() {
    var sel = parse(cur.input.value), today = new Date(), y = view.getFullYear(), m = view.getMonth();
    var first = new Date(y, m, 1), start = new Date(y, m, 1 - first.getDay()), rows = Math.ceil((first.getDay() + new Date(y, m + 1, 0).getDate()) / 7), html = '';
    html += '<div class="rmx-cal__head"><button type="button" class="rmx-cal__nav" data-nav="-1" aria-label="Previous month">' + icon('chevron-left') + '</button><span class="rmx-cal__title">' + MONTHS[m] + ' ' + y + '</span><button type="button" class="rmx-cal__nav" data-nav="1" aria-label="Next month">' + icon('chevron-right') + '</button></div>';
    html += '<div class="rmx-cal__days">' + DAYS.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>';
    for (var r = 0; r < rows; r++) {
      html += '<div class="rmx-cal__row">';
      for (var c = 0; c < 7; c++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + r * 7 + c), other = d.getMonth() !== m;
        html += '<button type="button" class="rmx-cal__day' + (other ? ' is-other' : '') + (same(d, sel) ? ' is-selected' : '') + (same(d, today) ? ' is-today' : '') + '" data-date="' + fmt(d) + '">' + d.getDate() + '</button>';
      }
      html += '</div>';
    }
    html += '<div class="rmx-cal__foot"><button type="button" data-do="today">Today</button><button type="button" data-do="clear">Clear</button></div>';
    pop.innerHTML = html;
  }
  function place() {
    var r = cur.box.getBoundingClientRect(), h = pop.offsetHeight, below = innerHeight - r.bottom - 12;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - 296)) + 'px';
    pop.style.top = (h > below && r.top > below ? Math.max(8, r.top - 4 - h) : r.bottom + 4) + 'px';
  }
  function open(box) {
    close();
    var input = box.querySelector('input'), d = parse(input.value) || new Date();
    cur = { box: box, input: input }; view = new Date(d.getFullYear(), d.getMonth(), 1);
    pop = document.createElement('div'); pop.className = 'rmx-cal'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Choose a date');
    document.body.appendChild(pop); render(); place();
  }
  function choose(d) {
    cur.input.value = d ? fmt(d) : '';
    cur.input.dispatchEvent(new Event('input', { bubbles: true })); cur.input.dispatchEvent(new Event('change', { bubbles: true }));
    close();
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.rmx-date__btn');
    if (btn) { e.preventDefault(); var box = btn.closest('.rmx-date'); if (pop && cur && cur.box === box) close(); else open(box); return; }
    if (!pop) return;
    if (e.target.closest('.rmx-cal')) {
      var nav = e.target.closest('[data-nav]'), day = e.target.closest('[data-date]'), act = e.target.closest('[data-do]');
      if (nav) { view = new Date(view.getFullYear(), view.getMonth() + +nav.dataset.nav, 1); render(); place(); }
      else if (day) choose(parse(day.dataset.date));
      else if (act) choose(act.dataset.do === 'today' ? new Date() : null);
      return;
    }
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', close, true);
})();
