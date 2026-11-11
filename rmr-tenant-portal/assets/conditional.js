/* Display conditionally in the resident forms.
   A question marked data-cond-q="3" data-cond-val="Yes" is shown only while question 3 is answered "Yes".
   Questions are found by the number their text starts with ("3. ..."). Works for radios, checkboxes and the dropdown. */
(function () {
  var cond = [].slice.call(document.querySelectorAll('.question[data-cond-q]'));
  if (!cond.length) return;
  function num(q) { var t = q.querySelector('.question__text'); var m = t && t.textContent.trim().match(/^(\d+)\./); return m ? m[1] : ''; }
  function answers(q) {
    var out = [];
    [].forEach.call(q.querySelectorAll('input[type=radio]:checked, input[type=checkbox]:checked'), function (i) {
      var l = i.closest('label'); out.push(l ? l.textContent.trim() : i.value);
    });
    var h = q.querySelector('.dropdown input[type=hidden]'); if (h && h.value) out.push(h.value);
    var tr = q.querySelector('.dropdown__trigger'); if (tr && tr.textContent.trim() && !h) out.push(tr.textContent.trim());
    return out;
  }
  function apply() {
    var all = [].slice.call(document.querySelectorAll('.question'));
    cond.forEach(function (c) {
      var ctl = all.filter(function (x) { return num(x) === c.getAttribute('data-cond-q'); })[0];
      var ok = !!ctl && answers(ctl).indexOf(c.getAttribute('data-cond-val')) > -1;
      c.hidden = !ok;
    });
  }
  ['change', 'click', 'input'].forEach(function (ev) { document.addEventListener(ev, function () { setTimeout(apply, 0); }); });
  apply();
})();
