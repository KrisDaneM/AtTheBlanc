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

  // Remove transform initially to prevent jumps
  header.style.transform = "none";
}

// ===================== INITIALIZE PAGE =====================
window.addEventListener("DOMContentLoaded", () => {
  restoreHeaderPosition();

  let page = window.location.pathname.split("/").pop();
  if (page === "") page = "index.html";

  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute("href") === page);
  if (activeBtn) {
    indicator.style.transition = "none";
    moveIndicator(activeBtn);
    activeBtn.classList.add("active");

    setTimeout(() => {
      indicator.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    }, 50);
  }
});

// ===================== NAV BUTTON CLICK =====================
buttons.forEach(btn => {
  btn.addEventListener("click", (e) => {
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

// ===================== DRAG HEADER WITH AFK EFFECT =====================
let isDragging = false;
let offsetX, offsetY;
let idleTimer;

// Activate header (show fully)
function activateHeader() {
  header.classList.add('active');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!isDragging) header.classList.remove('active');
  }, 2000); // 2 seconds after last interaction
}

// Drag start
header.addEventListener("mousedown", e => {
  isDragging = true;
  header.style.cursor = "grabbing";

  // Remove transform during drag to avoid jump
  header.style.transform = "none";

  const rect = header.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  activateHeader();
});

// Drag move
document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  activateHeader();

  let left = e.clientX - offsetX;
  let top = e.clientY - offsetY;

  const maxLeft = window.innerWidth - header.offsetWidth;
  const maxTop = window.innerHeight - header.offsetHeight;
  left = Math.max(0, Math.min(left, maxLeft));
  top = Math.max(0, Math.min(top, maxTop));

  header.style.left = left + "px";
  header.style.top = top + "px";
});

// Drag end
document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  header.style.cursor = "grab";
  activateHeader();

  localStorage.setItem("headerLeft", parseInt(header.style.left));
  localStorage.setItem("headerTop", parseInt(header.style.top));
});

// Hover effects for AFK transparency
header.addEventListener('mouseenter', activateHeader);
header.addEventListener('mouseleave', () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!isDragging) header.classList.remove('active');
  }, 2000);
});

// ===================== WINDOW RESIZE =====================
window.addEventListener("resize", () => {
  const storedLeft = localStorage.getItem("headerLeft");
  const storedTop = localStorage.getItem("headerTop");

  if (!storedLeft || !storedTop) {
    const headerWidth = header.offsetWidth;
    header.style.left = ((window.innerWidth - headerWidth) / 2) + "px";
    header.style.top = "20px";
  }
});

// ===================== FAQ ACCORDION =====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});
