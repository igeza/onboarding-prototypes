/* The dashboard's onboarding tile and the onboarding pages' stepper share one status: "rmr-step-status" in session storage
   (one entry per step: done / todo / skipped; written by app.js when a step is saved). A step is green on the dashboard exactly when it is
   green in the stepper. Same order as the stepper: 0 Account Information (the first step), 1 File Upload, 2 Insurance, 3 Pay Charges,
   4 Setup Payment Method, 5 Additional Information, 6 Review. With nothing stored yet only the first step is done, as in the stepper.
   data-state="submit" (13) is the "everything done, not yet submitted" dashboard and data-state="complete" (11) the completed one:
   opening them puts the onboarding in that state, so the stepper agrees. Everything else (01) shows the state as it is, and when every
   step is done it opens the Finish Onboarding dashboard. Paying charges (Pay Charges done) clears the balance. */
(function () {
  var mode = (document.currentScript && document.currentScript.getAttribute('data-state')) || '';
  var st = null; try { st = JSON.parse(sessionStorage.getItem('rmr-step-status')); } catch (e) {}
  if (!st) st = ['done'];
  while (st.length < 7) st.push('todo');
  var save = function () { try { sessionStorage.setItem('rmr-step-status', JSON.stringify(st)); } catch (e) {} };
  if (mode === 'submit') { for (var i = 0; i < 6; i++) st[i] = 'done'; save(); }
  if (mode === 'complete') { for (var j = 0; j < 7; j++) st[j] = 'done'; save(); }
  var STEPS = window.RMR_STEPS || [], hidden = function (i) { return i > 0 && STEPS[i] && !STEPS[i].visible; };
  var list = [['Account Information', '01a-account-information.html', 0], ['File Upload', '03-file-upload.html', 1], ['Insurance', '04-insurance.html', 2], ['Pay Charges', '05-pay-charges.html', 3],
    ['Setup Payment Method', '07-setup-payment-method.html', 4], ['Additional Information', '10-pet-information.html', 5]].filter(function (x) { return !hidden(x[2]); });
  var done = list.filter(function (x) { return st[x[2]] === 'done'; }).length;
  if (!mode && done === list.length) { location.replace('13-dashboard-submit.html'); return; }
  var pct = Math.round(done * 100 / list.length), box = document.querySelector('.task-card--onboarding .task-list'); if (!box) return;
  box.innerHTML = list.map(function (x) {
    var ok = st[x[2]] === 'done';
    return '<div class="task" data-component="Task">\n  <div class="task__stepper" data-component="Stepper"><div class="task__title" data-component="_Stepper Title"><span class="step ' + (ok ? 'step--completed' : 'step--pending') + '" data-component="_Step"><img src="../assets/img/' + (ok ? 'check-white' : 'check-blue') + '.svg" alt="" width="16" height="16"></span><span class="task__label">' + x[0] + '</span></div><div class="task__line"></div></div>\n  <button type="button" class="btn--text btn--text-24" data-component="Button" data-href="' + x[1] + '">' + (ok ? 'View' : 'Start') + '</button>\n</div>';
  }).join('');
  var c = 2 * Math.PI * 35, arc = document.querySelector('.ring circle:nth-child(2)'), val = document.querySelector('.ring__value');
  if (arc) { arc.setAttribute('stroke-dasharray', (c * pct / 100).toFixed(2) + ' ' + c.toFixed(2)); arc.style.display = pct ? '' : 'none'; }
  if (val) val.textContent = pct + '%';
  try { if (sessionStorage.getItem('rmr-payment-submitted') === '1' || st[3] === 'done') document.querySelector('.dash-hero__balance').textContent = '$0.00'; } catch (e) {}
  window.dispatchEvent(new Event('resize'));   // the floating scrollbar re-measures
})();
