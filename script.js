// ===================== SELECT ELEMENTS =====================
const buttons = document.querySelectorAll(".nav-btn");
const indicator = document.querySelector(".bubble-indicator");
const header = document.querySelector(".bubble-header");

// ===================== NAV BUBBLE =====================
function moveIndicator(btn) {
  const rect = btn.getBoundingClientRect();
  const parentRect = btn.parentElement.getBoundingClientRect();

  const left = rect.left - parentRect.left;
  const width = rect.width;

  indicator.style.width = width + "px";
  indicator.style.transform = `translateX(${left}px)`;
}

// ===================== INITIALIZE HEADER POSITION =====================
function restoreHeaderPosition() {
  const storedLeft = localStorage.getItem("headerLeft");
  const storedTop = localStorage.getItem("headerTop");

  if (storedLeft && storedTop) {
    header.style.left = storedLeft + "px";
    header.style.top = storedTop + "px";
  } else {
    const headerWidth = header.offsetWidth;
    const viewportWidth = window.innerWidth;
    header.style.left = (viewportWidth - headerWidth) / 2 + "px";
    header.style.top = "20px";
  }

  header.style.transform = "none";
}

// ===================== INITIALIZE PAGE =====================
window.addEventListener("DOMContentLoaded", () => {
  restoreHeaderPosition();

  let page = window.location.pathname.split("/").pop();
  if (page === "") page = "index.html";

  const activeBtn = Array.from(buttons).find(
    btn => btn.getAttribute("href") === page
  );

  if (activeBtn) {
    indicator.style.transition = "none";
    moveIndicator(activeBtn);
    activeBtn.classList.add("active");

    setTimeout(() => {
      indicator.style.transition =
        "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    }, 50);
  }
});

// ===================== NAV BUTTON CLICK =====================
buttons.forEach(btn => {
  btn.addEventListener("click", e => {
    const href = btn.getAttribute("href");
    e.preventDefault();

    if (btn.classList.contains("active")) return;

    document.querySelector(".nav-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    moveIndicator(btn);

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});

// ===================== DRAG HEADER (DESKTOP) =====================
let isDragging = false;
let offsetX, offsetY;
let idleTimer;

function activateHeader() {
  header.classList.add("active");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!isDragging) header.classList.remove("active");
  }, 2000);
}

header.addEventListener("mousedown", e => {
  isDragging = true;
  header.style.cursor = "grabbing";
  header.style.transform = "none";

  const rect = header.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  activateHeader();
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;

  let left = e.clientX - offsetX;
  let top = e.clientY - offsetY;

  const maxLeft = window.innerWidth - header.offsetWidth;
  const maxTop = window.innerHeight - header.offsetHeight;

  header.style.left = Math.max(0, Math.min(left, maxLeft)) + "px";
  header.style.top = Math.max(0, Math.min(top, maxTop)) + "px";

  activateHeader();
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;

  isDragging = false;
  header.style.cursor = "grab";

  localStorage.setItem("headerLeft", parseInt(header.style.left));
  localStorage.setItem("headerTop", parseInt(header.style.top));

  activateHeader();
});

// ===================== DRAG HEADER (MOBILE TOUCH, SMOOTH) =====================
let touchX = 0;
let touchY = 0;
let touchMoving = false;

header.addEventListener("touchstart", e => {
  isDragging = true;
  header.style.transform = "none";

  const touch = e.touches[0];
  const rect = header.getBoundingClientRect();

  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  activateHeader();
}, { passive: false });

document.addEventListener("touchmove", e => {
  if (!isDragging) return;

  const touch = e.touches[0];
  touchX = touch.clientX;
  touchY = touch.clientY;

  if (!touchMoving) {
    touchMoving = true;
    requestAnimationFrame(() => {
      let left = touchX - offsetX;
      let top = touchY - offsetY;

      const maxLeft = window.innerWidth - header.offsetWidth;
      const maxTop = window.innerHeight - header.offsetHeight;

      header.style.left = Math.max(0, Math.min(left, maxLeft)) + "px";
      header.style.top = Math.max(0, Math.min(top, maxTop)) + "px";

      activateHeader();
      touchMoving = false;
    });
  }

  e.preventDefault(); // prevent page scrolling while dragging
}, { passive: false });

document.addEventListener("touchend", () => {
  if (!isDragging) return;

  isDragging = false;
  touchMoving = false;

  localStorage.setItem("headerLeft", parseInt(header.style.left));
  localStorage.setItem("headerTop", parseInt(header.style.top));

  activateHeader();
});

// ===================== HOVER AFK =====================
header.addEventListener("mouseenter", activateHeader);

header.addEventListener("mouseleave", () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!isDragging) header.classList.remove("active");
  }, 2000);
});

// ===================== WINDOW RESIZE =====================
window.addEventListener("resize", () => {
  const storedLeft = localStorage.getItem("headerLeft");
  const storedTop = localStorage.getItem("headerTop");

  if (!storedLeft || !storedTop) {
    const headerWidth = header.offsetWidth;
    header.style.left = (window.innerWidth - headerWidth) / 2 + "px";
    header.style.top = "20px";
  }
});

// ===================== FAQ ACCORDION =====================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove("active");
    });
    item.classList.toggle("active");
  });
});
