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

/* ─── ROUTE MAP / SCROLL TO SECTION ─── */
const routeMap = {
  "inicio": "body",
  "compania": "compania",
  "servicios": "servicios",
  "blog": "mediumblog",
  "contacto": "contacto",
  "idioma": "idioma"
};

function normalizePath(path) {
  return path.replace(/^\/|\/$/g, "");
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const redirectedPath = params.get("redirect");

  let path = redirectedPath
    ? normalizePath(redirectedPath)
    : normalizePath(location.pathname);

  const targetId = routeMap[path];
  if (targetId) {
    history.replaceState({}, "", `/${path}/`);
    scrollToId(targetId);
  }
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-target]");
  if (!link) return;
  if (link.id === "langSwitch") return;

  e.preventDefault();
  const targetId = link.dataset.target;
  let path = normalizePath(link.getAttribute("href"));
  history.pushState({ targetId }, "", `/${path}/`);
  scrollToId(targetId);
});

window.addEventListener("popstate", () => {
  const path = normalizePath(location.pathname);
  const targetId = routeMap[path];
  if (targetId) scrollToId(targetId);
});

/* ─── SOMOSV CARDS ANIMATION ─── */
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.somosv-card');
  const symbols = document.querySelectorAll('.somosv-symbol');

  function animateElements() {
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add('somosv-card-visible'), 200 * index);
    });
    symbols.forEach((symbol, index) => {
      setTimeout(() => symbol.classList.add('somosv-symbol-visible'), 150 + (200 * index));
    });
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
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

  /* ─── SOMOSV ARROW RESPONSIVE ─── */
  function updateArrow() {
    const arrowElement = document.querySelector('.somosv-arrow');
    if (arrowElement) {
      arrowElement.textContent = window.innerWidth <= 991 ? '↓' : '→';
    }
  }
  updateArrow();
  window.addEventListener('resize', updateArrow);
});

/* ─── ROTATING CIRCLE (HERRAMIENTAS DESKTOP) ─── */
document.addEventListener('DOMContentLoaded', function () {
  let angle = 0;
  const speed = 0.02;
  const boxes = document.querySelectorAll('.despliegue-info-box');
  const circleContainer = document.querySelector('.despliegue-circle');
  const circleImage = document.querySelector('.despliegue-circle-image');

  const centerX = 300;
  const centerY = 300;
  const circleRadius = circleContainer ? circleContainer.offsetWidth / 2 : 150;
  const orbitRadius = circleRadius + 140;

  const images = [
    'img/soluciones.jpg',
    'img/soluciones2.jpg',
    'img/soluciones3.jpg'
  ];
  let currentImageIndex = 0;

  /* Cache box dimensions to avoid layout thrashing in rAF loop */
  let boxDims = [];
  function cacheBoxDims() {
    boxDims = Array.from(boxes).map(b => ({ w: b.offsetWidth, h: b.offsetHeight }));
  }

  function preloadImages() {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  function changeImage() {
    if (!circleImage) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = new Image();
    nextImage.src = images[currentImageIndex];
    nextImage.onload = function () {
      circleImage.style.opacity = '0';
      setTimeout(() => {
        circleImage.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        circleImage.style.opacity = '1';
      }, 500);
    };
  }

  function isMobile() {
    return window.innerWidth <= 991;
  }

  preloadImages();
  setInterval(changeImage, 4000);

  function animateBoxes() {
    if (isMobile()) return;
    boxes.forEach((box, index) => {
      const boxAngle = angle + (index * (360 / boxes.length));
      const radians = boxAngle * Math.PI / 180;
      const x = centerX + orbitRadius * Math.cos(radians);
      const y = centerY + orbitRadius * Math.sin(radians);
      const dim = boxDims[index] || { w: 0, h: 0 };
      box.style.left = (x - dim.w / 2) + 'px';
      box.style.top  = (y - dim.h / 2) + 'px';
    });
    angle += speed;
    if (angle >= 360) angle = 0;
    if (!isMobile()) requestAnimationFrame(animateBoxes);
  }

  function handleResponsiveLayout() {
    const textContainer = document.querySelector('.deploy-text-container');
    const boxesContainer = document.querySelector('.despliegue-boxes-container');

    if (isMobile()) {
      document.body.classList.add('mobile-view');
      if (circleContainer) circleContainer.classList.add('mobile-hidden');
      if (textContainer) textContainer.classList.add('mobile-text');
      if (boxesContainer) boxesContainer.classList.add('mobile-boxes');
      boxes.forEach(box => {
        box.style.position = 'static';
        box.style.left = 'auto';
        box.style.top = 'auto';
        box.style.transform = 'none';
        box.classList.add('mobile-box');
      });
    } else {
      document.body.classList.remove('mobile-view');
      if (circleContainer) circleContainer.classList.remove('mobile-hidden');
      if (textContainer) textContainer.classList.remove('mobile-text');
      if (boxesContainer) boxesContainer.classList.remove('mobile-boxes');
      boxes.forEach(box => box.classList.remove('mobile-box'));
      cacheBoxDims();
      requestAnimationFrame(animateBoxes);
    }
  }

  cacheBoxDims();
  handleResponsiveLayout();
  window.addEventListener('resize', handleResponsiveLayout);
});

/* ─── CONSOLE TITLES TYPEWRITER ─── */
document.addEventListener('DOMContentLoaded', function () {
  setupScrollObserver();

  window.addEventListener('resize', function () {
    document.querySelectorAll('.titulo-console').forEach(title => {
      title.style.fontSize = window.innerWidth <= 991 ? '1.1rem' : '1.4rem';
    });
  });
});

function setupScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target;
        if (!title.dataset.animated || title.dataset.animated === 'false') {
          animateTitle(title, 500);
          title.dataset.animated = 'true';
        }
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.3 });

  document.querySelectorAll('.titulo-console').forEach(title => observer.observe(title));
}

function animateTitle(title, delay) {
  if (!title) return;

  let pathPart = '';
  let importantPart = '';
  let extensionPart = '';

  switch (title.id) {
    case 'sobre-akroma':
      pathPart = 'cat /home/akroma/'; importantPart = 'Sobre_Akroma'; extensionPart = '.txt'; break;
    case 'future':
      pathPart = 'cat /home/akroma/'; importantPart = 'Futuro'; extensionPart = '.txt'; break;
    case 'soporte':
      pathPart = 'C:\\servicios\\'; importantPart = 'Soporte e implementación'; extensionPart = '.xlsx'; break;
    case 'despliegue':
    case 'despliegue-rueda':
      pathPart = 'C:\\servicios\\'; importantPart = 'Despliegue de soluciones y herramientas informáticas'; extensionPart = '.exe'; break;
    case 'consultoria':
      pathPart = 'C:\\servicios\\'; importantPart = 'Consultoría Informática y Capacitación'; extensionPart = '.docx'; break;
  }

  title.innerHTML = '';
  if (title.blinkIntervalId) {
    clearInterval(title.blinkIntervalId);
    title.blinkIntervalId = null;
  }
  title.classList.remove('titulo-cursor-blink');
  title.style.fontWeight = '200';

  setTimeout(() => {
    const pathEl = document.createElement('span');
    const importantEl = document.createElement('span');
    const extensionEl = document.createElement('span');

    pathEl.style.fontWeight = '200';
    importantEl.style.fontWeight = '700';
    extensionEl.style.fontWeight = '200';

    title.appendChild(pathEl);
    title.appendChild(importantEl);
    title.appendChild(extensionEl);

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
                  if (++blinks >= 10) {
                    clearInterval(title.blinkIntervalId);
                    title.classList.remove('titulo-cursor-blink');
                  }
                }, 800);
              }
            }, 50);
          }
        }, 50);
      }
    }, 50);
  }, delay);
}
