// Intro Animation Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 300);
  }, 1000);
});

// Scroll Reveal Logic
const revealElements = document.querySelectorAll(".reveal");

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 },
);

revealElements.forEach((el) => scrollObserver.observe(el));

// No custom cursor script needed - Standard pointer restored

/* --- TITAN VAULT: PRECISION CINEMATIC LOGIC --- */
const vaultDrum = document.getElementById("drum");
const vNext = document.getElementById("vaultNext");
const vPrev = document.getElementById("vaultPrev");
const vCards = document.querySelectorAll(".vault-card");
const vContainer = document.querySelector(".vault-container");

let vRotation = 0;
let vActiveIndex = 0;
let isAnimating = false;

function rotateVault(direction) {
  if (isAnimating) return;
  isAnimating = true;

  // 1. PHASE 1: THE "RECEDE" (Image moves straight back)
  const currentCard = vCards[vActiveIndex];
  const currentImg = currentCard.querySelector("img");
  const currentLabel = currentCard.querySelector(".card-label");

  // Make current card look like it's going into "Standby"
  currentImg.style.transform = "scale(1.2)"; // Stay zoomed but fade
  currentLabel.style.opacity = "0";
  currentLabel.style.transform = "translateY(30px)";

  // 2. PHASE 2: THE "TURN" (Drum rotates)
  if (direction === "next") {
    vRotation -= 90;
    vActiveIndex = (vActiveIndex + 1) % vCards.length;
  } else {
    vRotation += 90;
    vActiveIndex = (vActiveIndex - 1 + vCards.length) % vCards.length;
  }

  // Apply the rotation with a very smooth "Heavy" easing
  vaultDrum.style.transition = "transform 1.6s cubic-bezier(0.7, 0, 0.2, 1)";
  vaultDrum.style.transform = `rotateY(${vRotation}deg)`;

  // 3. PHASE 3: THE "LOCK-IN" (New image comes forward)
  vCards.forEach((card, i) => {
    const img = card.querySelector("img");
    const border = card.querySelector(".static-border");

    if (i === vActiveIndex) {
      // New Active Card Logic
      card.classList.add("active");
      card.style.filter = "brightness(1) blur(0)";

      // Image starts slightly smaller and grows to "Full Straight"
      img.style.transition = "none"; // Reset for snap
      img.style.transform = "scale(1.3)"; // Start zoomed in

      setTimeout(() => {
        img.style.transition =
          "transform 2s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease";
        img.style.transform = "scale(1)"; // Settle to perfectly straight 1:1
        img.style.filter = "contrast(1.1) brightness(1.1)";
      }, 50);
    } else {
      // Inactive Cards
      card.classList.remove("active");
      card.style.filter = "brightness(0.08) blur(8px)";
      img.style.transform = "scale(1.5)";
    }
  });

  // 4. PHASE 4: THE "REVEAL" (Text comes in last)
  setTimeout(() => {
    const nextLabel = vCards[vActiveIndex].querySelector(".card-label");
    nextLabel.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
    nextLabel.style.opacity = "1";
    nextLabel.style.transform = "translateY(0)";

    isAnimating = false;
  }, 1200);
}

// 5. MOUSE INTERACTION (Subtle Parallax Background - NOT the image)
// We only move the ambient red light, keeping the image perfectly straight
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 50;
  const y = (window.innerHeight / 2 - e.pageY) / 50;

  const bgGlow = document.querySelector(".vault-ambient-bg");
  if (bgGlow) {
    bgGlow.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
  }
});

// Event Listeners
vNext.addEventListener("click", () => rotateVault("next"));
vPrev.addEventListener("click", () => rotateVault("prev"));

// Smooth Keyboard Arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") rotateVault("next");
  if (e.key === "ArrowLeft") rotateVault("prev");
});

const castWrapper = document.getElementById("castWrapper");
const nextBtn = document.getElementById("castNext");
const prevBtn = document.getElementById("castPrev");

let currentIdx = 0;
const cardsToShow = 3;
const totalCards = document.querySelectorAll(".cast-card").length;

function updateSlide() {
  const cardWidth = 350; // Card width
  const gap = 30; // Gap width
  const moveAmount = (cardWidth + gap) * currentIdx;

  castWrapper.style.transform = `translateX(-${moveAmount}px)`;
}

nextBtn.addEventListener("click", () => {
  if (currentIdx < totalCards - cardsToShow) {
    currentIdx++;
  } else {
    currentIdx = 0; // Seamless loop
  }
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  if (currentIdx > 0) {
    currentIdx--;
  } else {
    currentIdx = totalCards - cardsToShow; // Loop to end
  }
  updateSlide();
});
