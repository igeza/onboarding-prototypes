/* A floating scrollbar for the onboarding tile's step list (RMR dashboard): it takes no layout space, sits over the list at the tile's
   right edge, and fades in only while you scroll or hover the tile. */
(function () {
  var list = document.querySelector('.task-card--onboarding .task-list'); if (!list) return;
  var card = list.parentNode, track = document.createElement('div'), thumb = document.createElement('div'), timer;
  track.className = 'fscroll'; thumb.className = 'fscroll__thumb'; track.appendChild(thumb); card.appendChild(track);
  function geo() {
    var over = list.scrollHeight > list.clientHeight + 1; track.hidden = !over; if (!over) return;
    var top = list.offsetTop + 4, h = list.clientHeight - 8;
    track.style.top = top + 'px'; track.style.height = h + 'px';
    var th = Math.max(28, h * list.clientHeight / list.scrollHeight), room = list.scrollHeight - list.clientHeight;
    thumb.style.height = th + 'px'; thumb.style.transform = 'translateY(' + (room ? list.scrollTop / room * (h - th) : 0) + 'px)';
  }
  function flash() { track.classList.add('is-on'); clearTimeout(timer); timer = setTimeout(function () { if (!card.matches(':hover')) track.classList.remove('is-on'); }, 900); }
  list.addEventListener('scroll', function () { geo(); flash(); });
  card.addEventListener('mouseenter', function () { track.classList.add('is-on'); });
  card.addEventListener('mouseleave', function () { track.classList.remove('is-on'); });
  window.addEventListener('resize', geo); window.addEventListener('load', geo); if (window.ResizeObserver) new ResizeObserver(geo).observe(list);
  thumb.addEventListener('pointerdown', function (e) {
    e.preventDefault(); thumb.setPointerCapture(e.pointerId); var y0 = e.clientY, s0 = list.scrollTop;
    function move(ev) { var h = track.clientHeight, th = thumb.clientHeight, room = list.scrollHeight - list.clientHeight; list.scrollTop = s0 + (ev.clientY - y0) * room / Math.max(1, h - th); }
    function up() { thumb.removeEventListener('pointermove', move); thumb.removeEventListener('pointerup', up); }
    thumb.addEventListener('pointermove', move); thumb.addEventListener('pointerup', up);
  });
  geo();
})();
