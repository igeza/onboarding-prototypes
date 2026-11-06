/* Forms sent from RMX (Send Form on the Prospects, Tenants and Properties registers, or Send to Tenant / Prospect on Form Templates)
   are kept for this browser tab under 'rmx-sent-forms' and listed here, on the Required tab. Open this page in the same tab you sent from
   (rmr.html > RMR Tenant Portal). A form already on the list just gets the new due date; Pet Information, Pet Addendum and Pet Info & Policy
   Agreement are the New Pet form. Only New Pet opens a form (the others have no mock, like Gym Access). */
(function () {
  var sent = [];
  try { sent = JSON.parse(sessionStorage.getItem('rmx-sent-forms') || '[]'); } catch (e) {}
  if (!sent.length) return;
  var table = document.querySelector('.forms-split .forms-card:first-child table tbody');
  if (!table) return;
  var ALIAS = { 'Pet Information': 'New Pet', 'Pet Addendum': 'New Pet', 'Pet Info & Policy Agreement': 'New Pet' };
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function short(d) { var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((d || '').trim()); return m ? ('0' + m[1]).slice(-2) + '/' + ('0' + m[2]).slice(-2) + '/' + m[3].slice(2) : (d || ''); }
  sent.forEach(function (f) {
    var name = ALIAS[f.form] || f.form, due = short(f.due), row = null;
    [].forEach.call(table.rows, function (r) { if (r.cells[0].textContent.trim() === name) row = r; });
    if (row) { if (due) row.cells[1].textContent = due; return; }
    var href = name === 'New Pet' ? '15-form-new-pet.html' : '#';
    table.insertAdjacentHTML('beforeend', '<tr><td>' + esc(name) + '</td><td>' + esc(due) + '</td><td class="forms-table__action"><a class="btn btn--primary btn--table" href="' + href + '" data-component="Button" data-href="' + href + '"><span class="btn__container">Start</span></a></td></tr>');
  });
})();
