/* Scrollbars that float over the content instead of taking space from it.
   Scrolls the page, or the element marked data-overlay-scroll when a screen pins its header and scrolls only the body.
   The native bars are hidden in CSS; this draws thumbs in the free space at the element's right and bottom edges. */
(function () {
  var marked = document.querySelector('[data-overlay-scroll]');
  var root = marked || document.documentElement, hideTimer, drag;
  function make(cls) {
    var t = document.createElement('div');
    t.className = 'rmx-overlay-scroll ' + cls;
    t.setAttribute('aria-hidden', 'true');
    document.body.appendChild(t);
    return t;
  }
  var v = make('is-v'), h = make('is-h');

  function box() {
    return marked ? marked.getBoundingClientRect()
      : { top: 0, left: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight };
  }
  function update() {
    var b = box(), vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    var ch = root.clientHeight, th = root.scrollHeight, cw = root.clientWidth, tw = root.scrollWidth;
    if (th <= ch + 1) v.style.display = 'none';
    else {
      var len = Math.max(32, ch * ch / th), top = (root.scrollTop / (th - ch)) * (ch - len);
      v.style.display = 'block'; v.style.height = len + 'px'; v.style.top = b.top + 'px';
      v.style.right = (vw - b.right + 2) + 'px'; v.style.transform = 'translateY(' + top + 'px)';
    }
    if (tw <= cw + 1) h.style.display = 'none';
    else {
      var wl = Math.max(32, cw * cw / tw), left = (root.scrollLeft / (tw - cw)) * (cw - wl);
      h.style.display = 'block'; h.style.width = wl + 'px'; h.style.left = b.left + 'px';
      h.style.bottom = (vh - b.bottom + 2) + 'px'; h.style.transform = 'translateX(' + left + 'px)';
    }
  }
  function reveal() {
    update();
    v.classList.add('is-visible'); h.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { if (!drag) { v.classList.remove('is-visible'); h.classList.remove('is-visible'); } }, 900);
  }
  function start(thumb, axis) {
    thumb.addEventListener('mousedown', function (e) {
      drag = { axis: axis, p: axis === 'y' ? e.clientY : e.clientX, s: axis === 'y' ? root.scrollTop : root.scrollLeft, thumb: thumb };
      thumb.classList.add('is-visible', 'is-drag');
      e.preventDefault();
    });
  }
  start(v, 'y'); start(h, 'x');
  window.addEventListener('mousemove', function (e) {
    if (!drag) return;
    if (drag.axis === 'y') {
      var ch = root.clientHeight, th = root.scrollHeight, len = Math.max(32, ch * ch / th);
      root.scrollTop = drag.s + (e.clientY - drag.p) * (th - ch) / (ch - len);
    } else {
      var cw = root.clientWidth, tw = root.scrollWidth, wl = Math.max(32, cw * cw / tw);
      root.scrollLeft = drag.s + (e.clientX - drag.p) * (tw - cw) / (cw - wl);
    }
  });
  window.addEventListener('mouseup', function () {
    if (!drag) return;
    drag.thumb.classList.remove('is-drag'); drag = null; reveal();
  });
  (marked || window).addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', update);
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true, attributes: true });
  update();
})();
