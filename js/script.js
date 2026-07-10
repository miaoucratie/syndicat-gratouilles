/* Le Syndicat des Gratouilles : interactions natives, sans dépendance */
(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    });
  }

  /* ---------- Mentions légales (modale) ---------- */
  var legalDialog = document.getElementById("legal-dialog");
  if (legalDialog) {
    var openers = document.querySelectorAll("[data-open-legal]");
    Array.prototype.forEach.call(openers, function (btn) {
      btn.addEventListener("click", function () {
        if (typeof legalDialog.showModal === "function") {
          legalDialog.showModal();
        } else {
          legalDialog.setAttribute("open", ""); // repli navigateurs anciens
        }
      });
    });
    var closer = legalDialog.querySelector("[data-close-legal]");
    if (closer) closer.addEventListener("click", function () { legalDialog.close(); });
    // Fermeture au clic sur l'arrière-plan
    legalDialog.addEventListener("click", function (e) {
      if (e.target === legalDialog) legalDialog.close();
    });
  }

  /* ---------- Carrousel presse ---------- */
  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var track = root.querySelector("[data-track]");
  var controls = root.querySelector("[data-controls]");
  var dotsWrap = root.querySelector("[data-dots]");
  var prevBtn = root.querySelector("[data-prev]");
  var nextBtn = root.querySelector("[data-next]");

  // Diapositives réellement visibles (les emplacements masqués sont ignorés)
  var slides = Array.prototype.filter.call(
    track.children,
    function (s) { return !s.hasAttribute("hidden"); }
  );

  // Une seule entrée : pas de flèches actives dans le vide.
  if (slides.length <= 1) {
    if (controls) controls.setAttribute("hidden", "");
    return;
  }

  controls.removeAttribute("hidden");
  var index = 0;

  // Points de navigation
  slides.forEach(function (slide, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Aller à l'article " + (i + 1));
    b.addEventListener("click", function () { go(i); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function update() {
    track.style.transform = "translateX(" + (-index * 100) + "%)";
    slides.forEach(function (s, i) {
      s.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    dots.forEach(function (d, i) {
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  function go(i) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    update();
  }

  prevBtn.addEventListener("click", function () { go(index - 1); });
  nextBtn.addEventListener("click", function () { go(index + 1); });

  // Navigation clavier (flèches) quand le carrousel a le focus
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { go(index - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { go(index + 1); e.preventDefault(); }
  });

  // Swipe tactile simple
  var x0 = null;
  track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); }
    x0 = null;
  }, { passive: true });

  update();
})();
