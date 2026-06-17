/* ─── NAVBAR SCROLL ─── */
let _navbarTicking = false;
document.addEventListener('scroll', function () {
  if (_navbarTicking) return;
  _navbarTicking = true;
  requestAnimationFrame(function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 200) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    _navbarTicking = false;
  });
}, { passive: true });

/* ─── ROUTE MAP (EN) ─── */
const routeMapEn = {
  "home":     "body",
  "company":  "compania",
  "services": "servicios",
  "blog":     "mediumblog",
  "contact":  "contacto",
  "language": "idioma"
};

const legacyToEn = {
  "inicio":   "home",
  "compania": "company",
  "servicios":"services",
  "blog":     "blog",
  "contacto": "contact",
  "idioma":   "language"
};

function normalizePath(path) { return (path || "").replace(/^\/|\/$/g, ""); }
function stripEnPrefix(p)    { return p.startsWith("en/") ? p.slice(3) : p; }
function scrollToId(id)      { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); }

function resolveEnRoute(rawPath) {
  let p = stripEnPrefix(normalizePath(rawPath));
  if (!p || p === "en") p = "home";
  if (legacyToEn[p]) p = legacyToEn[p];
  return p;
}

function goToEnRoute(route, replace) {
  const targetId = routeMapEn[route];
  if (!targetId) return;
  const url = route === "home" ? "/en/" : `/en/${route}/`;
  if (replace) history.replaceState({}, "", url);
  else         history.pushState({}, "", url);
  scrollToId(targetId);
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const raw    = params.get("redirect") || location.pathname;
  goToEnRoute(resolveEnRoute(raw), true);
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-target]");
  if (!link || link.id === "langSwitch") return;
  e.preventDefault();
  goToEnRoute(resolveEnRoute(link.getAttribute("href") || ""), false);
});

window.addEventListener("popstate", () => {
  const route    = resolveEnRoute(location.pathname);
  const targetId = routeMapEn[route];
  if (targetId) scrollToId(targetId);
});

/* ─── SOMOSV CARDS ANIMATION ─── */
document.addEventListener('DOMContentLoaded', function () {
  const cards   = document.querySelectorAll('.somosv-card');
  const symbols = document.querySelectorAll('.somosv-symbol');

  function animateElements() {
    cards.forEach((card, i)   => setTimeout(() => card.classList.add('somosv-card-visible'),   200 * i));
    symbols.forEach((sym, i)  => setTimeout(() => sym.classList.add('somosv-symbol-visible'),  150 + 200 * i));
  }

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top <= (window.innerHeight || document.documentElement.clientHeight) && r.bottom >= 0;
  }

  function checkElements() {
    const container = document.querySelector('.somosv-cards-container');
    if (container && isInViewport(container) && !container.classList.contains('animated')) {
      container.classList.add('animated');
      animateElements();
    }
  }
  let _somosTicking = false;
  function checkElementsThrottled() {
    if (_somosTicking) return;
    _somosTicking = true;
    requestAnimationFrame(function () { checkElements(); _somosTicking = false; });
  }
  checkElements();
  window.addEventListener('scroll', checkElementsThrottled, { passive: true });

  /* Arrow direction */
  function updateArrow() {
    const el = document.querySelector('.somosv-arrow');
    if (el) el.textContent = window.innerWidth <= 991 ? '↓' : '→';
  }
  updateArrow();
  window.addEventListener('resize', updateArrow);
});

/* ─── ROTATING CIRCLE (HERRAMIENTAS DESKTOP) ─── */
document.addEventListener('DOMContentLoaded', function () {
  let angle = 0;
  const speed = 0.02;
  const boxes           = document.querySelectorAll('.despliegue-info-box');
  const circleContainer = document.querySelector('.despliegue-circle');
  const circleImage     = document.querySelector('.despliegue-circle-image');

  const centerX      = 300;
  const centerY      = 300;
  const circleRadius = circleContainer ? circleContainer.offsetWidth / 2 : 150;
  const orbitRadius  = circleRadius + 140;

  const images = ['/img/soluciones.jpg', '/img/soluciones2.jpg', '/img/soluciones3.jpg'];
  let currentImageIndex = 0;

  /* Cache box dimensions to avoid layout thrashing in rAF loop */
  let boxDims = [];
  function cacheBoxDims() {
    boxDims = Array.from(boxes).map(b => ({ w: b.offsetWidth, h: b.offsetHeight }));
  }

  function preloadImages() { images.forEach(src => { const img = new Image(); img.src = src; }); }

  function changeImage() {
    if (!circleImage) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const next = new Image();
    next.src = images[currentImageIndex];
    next.onload = () => {
      circleImage.style.opacity = '0';
      setTimeout(() => { circleImage.style.backgroundImage = `url('${images[currentImageIndex]}')`; circleImage.style.opacity = '1'; }, 500);
    };
  }

  function isMobile() { return window.innerWidth <= 991; }

  preloadImages();
  setInterval(changeImage, 4000);

  function animateBoxes() {
    if (isMobile()) return;
    boxes.forEach((box, i) => {
      const rad = (angle + i * (360 / boxes.length)) * Math.PI / 180;
      const dim = boxDims[i] || { w: 0, h: 0 };
      box.style.left = (centerX + orbitRadius * Math.cos(rad) - dim.w / 2) + 'px';
      box.style.top  = (centerY + orbitRadius * Math.sin(rad) - dim.h / 2) + 'px';
    });
    angle = (angle + speed) % 360;
    if (!isMobile()) requestAnimationFrame(animateBoxes);
  }

  function handleResponsiveLayout() {
    const textContainer  = document.querySelector('.deploy-text-container');
    const boxesContainer = document.querySelector('.despliegue-boxes-container');
    if (isMobile()) {
      document.body.classList.add('mobile-view');
      if (circleContainer) circleContainer.classList.add('mobile-hidden');
      if (textContainer)   textContainer.classList.add('mobile-text');
      if (boxesContainer)  boxesContainer.classList.add('mobile-boxes');
      boxes.forEach(box => { box.style.position='static'; box.style.left='auto'; box.style.top='auto'; box.style.transform='none'; box.classList.add('mobile-box'); });
    } else {
      document.body.classList.remove('mobile-view');
      if (circleContainer) circleContainer.classList.remove('mobile-hidden');
      if (textContainer)   textContainer.classList.remove('mobile-text');
      if (boxesContainer)  boxesContainer.classList.remove('mobile-boxes');
      boxes.forEach(box => box.classList.remove('mobile-box'));
      cacheBoxDims();
      requestAnimationFrame(animateBoxes);
    }
  }

  cacheBoxDims();
  handleResponsiveLayout();
  window.addEventListener('resize', handleResponsiveLayout);
});

/* ─── CONSOLE TITLES TYPEWRITER (EN) ─── */
document.addEventListener('DOMContentLoaded', function () {
  setupScrollObserverEn();
  window.addEventListener('resize', function () {
    document.querySelectorAll('.titulo-console').forEach(t => {
      t.style.fontSize = window.innerWidth <= 991 ? '1.1rem' : '1.4rem';
    });
  });
});

function setupScrollObserverEn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target;
        if (!title.dataset.animated || title.dataset.animated === 'false') {
          animateTitleEn(title, 500);
          title.dataset.animated = 'true';
        }
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.3 });

  document.querySelectorAll('.titulo-console').forEach(t => observer.observe(t));
}

function animateTitleEn(title, delay) {
  if (!title) return;

  let pathPart = '', importantPart = '', extensionPart = '';

  switch (title.id) {
    case 'sobre-akroma':
      pathPart = 'cat /home/akroma/'; importantPart = 'About_Akroma';     extensionPart = '.txt';  break;
    case 'future':
      pathPart = 'cat /home/akroma/'; importantPart = 'Future';           extensionPart = '.txt';  break;
    case 'soporte':
      pathPart = 'C:\\services\\';    importantPart = 'Support & Implementation'; extensionPart = '.xlsx'; break;
    case 'despliegue':
    case 'despliegue-rueda':
      pathPart = 'C:\\services\\';    importantPart = 'Solution & Tool Deployment'; extensionPart = '.exe'; break;
    case 'consultoria':
      pathPart = 'C:\\services\\';    importantPart = 'IT Consulting & Training'; extensionPart = '.docx'; break;
  }

  title.innerHTML = '';
  if (title.blinkIntervalId) { clearInterval(title.blinkIntervalId); title.blinkIntervalId = null; }
  title.classList.remove('titulo-cursor-blink');
  title.style.fontWeight = '200';

  setTimeout(() => {
    const pathEl      = document.createElement('span');
    const importantEl = document.createElement('span');
    const extensionEl = document.createElement('span');
    pathEl.style.fontWeight      = '200';
    importantEl.style.fontWeight = '700';
    extensionEl.style.fontWeight = '200';
    title.appendChild(pathEl); title.appendChild(importantEl); title.appendChild(extensionEl);

    let i = 0;
    const typePath = setInterval(() => {
      if (i < pathPart.length) { pathEl.textContent += pathPart[i++]; }
      else {
        clearInterval(typePath);
        let j = 0;
        const typeImportant = setInterval(() => {
          if (j < importantPart.length) { importantEl.textContent += importantPart[j++]; }
          else {
            clearInterval(typeImportant);
            let k = 0;
            const typeExt = setInterval(() => {
              if (k < extensionPart.length) { extensionEl.textContent += extensionPart[k++]; }
              else {
                clearInterval(typeExt);
                title.classList.add('titulo-cursor-blink');
                let blinks = 0;
                title.blinkIntervalId = setInterval(() => {
                  if (++blinks >= 10) { clearInterval(title.blinkIntervalId); title.classList.remove('titulo-cursor-blink'); }
                }, 800);
              }
            }, 50);
          }
        }, 50);
      }
    }, 50);
  }, delay);
}
