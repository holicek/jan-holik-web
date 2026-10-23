// Mobilní menu: tlačítko přepíná třídu is-open na hlavní navigaci.
// Bez JS zůstane menu pod 900 px skryté, odkazy jsou ale i v patičce.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hlavni-nav');
  if (!btn || !nav) return;
  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
  }
  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
