/* ═══════════════════════════════════════════════════════
 1. CUSTOM CURSOR (desktop only, hidden on touch devices)
 ═══════════════════════════════════════════════════════ */
const isTouchDevice = window.matchMedia("(pointer:coarse)").matches;
const $dot = document.getElementById("cursor-dot");
const $ring = document.getElementById("cursor-ring");

if (!isTouchDevice) {
  document.addEventListener("mousemove", (e) => {
    $dot.style.left = e.clientX + "px";
    $dot.style.top = e.clientY + "px";
    $ring.style.left = e.clientX + "px";
    $ring.style.top = e.clientY + "px";
  });
  document
    .querySelectorAll("a, button, [onclick], .cert-card, article")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => $ring.classList.add("expanded"));
      el.addEventListener("mouseleave", () =>
        $ring.classList.remove("expanded"),
      );
    });
}

/* ═══════════════════════════════════════════════════════
 2. NAVBAR — transparent → solid glass on scroll
 ═══════════════════════════════════════════════════════ */
const $nav = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    $nav.style.background =
      window.scrollY > 50 ? "rgba(5,5,5,0.70)" : "rgba(5,5,5,0.25)";
    $nav.style.boxShadow =
      window.scrollY > 50 ? "0 4px 40px rgba(0,0,0,0.5)" : "none";
  },
  { passive: true },
);

/* ═══════════════════════════════════════════════════════
 3. MOBILE MENU
 ═══════════════════════════════════════════════════════ */
const $menuBtn = document.getElementById("menu-btn");
const $overlay = document.getElementById("mobile-overlay");
const $ovClose = document.getElementById("overlay-close");

function openMobile() {
  $overlay.classList.add("open");
  $menuBtn.classList.add("open");
  $menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMobile() {
  $overlay.classList.remove("open");
  $menuBtn.classList.remove("open");
  $menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
$menuBtn.addEventListener("click", () =>
  $overlay.classList.contains("open") ? closeMobile() : openMobile(),
);
$ovClose.addEventListener("click", closeMobile);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobile();
    closeCert();
  }
});

/* ═══════════════════════════════════════════════════════
 4. TYPING ANIMATION — 3 correct phrases loop
 ═══════════════════════════════════════════════════════ */
const phrases = [
  "AI & Data Science Student",
  "Python Developer",
  "Cisco-Certified IT Professional",
];
const $typEl = document.getElementById("hero-typing");
let pIdx = 0,
  cIdx = 0,
  isDeleting = false;

(function type() {
  const phrase = phrases[pIdx];
  $typEl.textContent = isDeleting
    ? phrase.slice(0, --cIdx)
    : phrase.slice(0, ++cIdx);

  if (!isDeleting && cIdx === phrase.length) {
    isDeleting = true;
    setTimeout(type, 2400);
    return;
  }
  if (isDeleting && cIdx === 0) {
    isDeleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    setTimeout(type, 380);
    return;
  }
  setTimeout(type, isDeleting ? 36 : 78);
})();

/* ═══════════════════════════════════════════════════════
 5. ANIMATED NUMBER COUNTERS (triggered by IntersectionObserver)
 ═══════════════════════════════════════════════════════ */
function triggerCounter(el) {
  if (el._done) return;
  el._done = true;
  const target = +el.dataset.target;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const id = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(id);
  }, 40);
}

/* ═══════════════════════════════════════════════════════
 6. SCROLL REVEAL + skill bars + counters (IntersectionObserver)
 ═══════════════════════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("active");
      // Animate skill bars inside revealed element
      e.target.querySelectorAll(".skill-fill").forEach((b) => {
        b.style.width = b.dataset.w + "%";
      });
      // Animate counters inside revealed element
      e.target.querySelectorAll(".counter").forEach(triggerCounter);
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => revObs.observe(el));

// Dedicated observer for counters to guarantee they animate when visible
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) triggerCounter(e.target);
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".counter").forEach((el) => counterObs.observe(el));

// Also watch the skills section so bars animate even if card reveals already fired
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".skill-fill").forEach((b) => {
            b.style.width = b.dataset.w + "%";
          });
        }
      });
    },
    { threshold: 0.15 },
  ).observe(skillsSection);
}

/* ═══════════════════════════════════════════════════════
 7. ACTIVE NAV LINK (scroll-spy)
 ═══════════════════════════════════════════════════════ */
const $navLinks = document.querySelectorAll(".nav-link");
const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        $navLinks.forEach((l) =>
          l.classList.toggle("active", l.dataset.s === id),
        );
      }
    });
  },
  { threshold: 0.4, rootMargin: "-60px 0px 0px 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => navObs.observe(s));

/* ═══════════════════════════════════════════════════════
 8. CERT CAROUSEL (SWIPER) & MODAL
 ═══════════════════════════════════════════════════════ */

if (document.querySelector(".cert-swiper")) {
  const certSwiper = new Swiper(".cert-swiper", {
    on: {
      click: function (swiper, event) {
        if (event && typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        if (event && typeof event.stopPropagation === "function") {
          event.stopPropagation();
        }
        const slide = event.target.closest('.swiper-slide');
        if (slide) {
          const imgFile = slide.getAttribute('data-img');
          const pdfFile = slide.getAttribute('data-pdf');
          if (imgFile && typeof window.openCert === 'function') {
            window.openCert(imgFile, pdfFile);
          }
        }
      },
    },
    slidesPerView: "auto",
    centeredSlides: true,
    loop: true,
    spaceBetween: 24,
    grabCursor: true,
    speed: 400,
    navigation: {
      nextEl: '#cert-next',
      prevEl: '#cert-prev',
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        spaceBetween: 16,
      },
      768: {
        spaceBetween: 24,
      },
    },
  });
}

// Certificate Modal
const $modal = document.getElementById('cert-modal');
const $modalCard = document.getElementById('cert-modal-card');
const $previewImg = document.getElementById('cert-preview-img');
const $downloadLink = document.getElementById('cert-download-link');

// Blob workaround for Resume PDF to bypass IDM interception
window.openResumeBlob = async function (e, url) {
  e.preventDefault();
  const tab = window.open('', '_blank');
  if (tab) {
    tab.document.write('<title>Loading Résumé...</title><div style="font-family:sans-serif;text-align:center;padding:50px;color:#888;">Loading Résumé...</div>');
  }
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    if (tab) {
      tab.location.href = blobUrl;
    } else {
      window.open(blobUrl, '_blank');
    }
  } catch (err) {
    if (tab) tab.location.href = url;
    else window.open(url, '_blank');
  }
};

window.openCert = function (imgFile, pdfFile) {
  // imgFile = path to .jpg preview, pdfFile = path to .pdf for download
  $previewImg.classList.add('hidden');
  $previewImg.src = '';

  // Show modal IMMEDIATELY — no delay, no fetch
  $modal.classList.replace('pointer-events-none', 'pointer-events-auto');
  $modal.classList.replace('opacity-0', 'opacity-100');
  $modalCard.classList.replace('scale-95', 'scale-100');
  document.body.style.overflow = 'hidden';

  // Set download link
  $downloadLink.href = pdfFile;

  // Set image src — browser loads it natively, no IDM interception
  $previewImg.src = imgFile;
  $previewImg.onload = function () {
    $previewImg.classList.remove('hidden');
  };
  // Also unhide in case onload already fired (cached image)
  if ($previewImg.complete && $previewImg.naturalWidth > 0) {
    $previewImg.classList.remove('hidden');
  }
};

window.closeCert = function () {
  $modal.classList.replace('pointer-events-auto', 'pointer-events-none');
  $modal.classList.replace('opacity-100', 'opacity-0');
  $modalCard.classList.replace('scale-100', 'scale-95');
  document.body.style.overflow = '';
  setTimeout(function () {
    $previewImg.src = '';
    $previewImg.classList.add('hidden');
    $downloadLink.href = '#';
  }, 300);
};

window.handleModalClick = function (e) {
  if (e.target === $modal) window.closeCert();
};

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && $modal.classList.contains('opacity-100'))
    window.closeCert();
});

/* ═══════════════════════════════════════════════════════
 10. CONTACT FORM
 ═══════════════════════════════════════════════════════ */
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById("form-btn");
  const prevHTML = btn.innerHTML;
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">refresh</span>Sending...`;
  setTimeout(() => {
    btn.innerHTML = `<span class="material-symbols-outlined text-sm">check</span>Message Sent!`;
    btn.classList.add("bg-green-500", "text-white", "border-green-500");
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = prevHTML;
      btn.classList.remove("bg-green-500", "text-white", "border-green-500");
    }, 4000);
  }, 1500);
}
