// ===== ТАЙМЕР С JSON И КОНФЕТТИ =====
let timerInterval = null;
let targetTime = null;

const timerBox = document.getElementById("timerBox");
const noTimer = document.getElementById("noTimer");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const refreshBtn = document.getElementById("refreshBtn");

// Загружаем JSON с отключением кэша
async function loadTargetDate() {
  try {
    const url = "https://raw.githubusercontent.com/toolgool2021-coder/Time/main/date.json?nocache=" + Date.now();
    const res = await fetch(url);
    const data = await res.json();
    targetTime = new Date(data.target).getTime();
    startCountdown();
  } catch (e) {
    console.error("Ошибка загрузки даты:", e);
    showNoTimer();
  }
}

// Запуск таймера
function startCountdown() {
  updateDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateDisplay, 1000);
}

function updateDisplay() {
  if (!targetTime) return;

  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    launchConfetti(); // 🎉

    clearInterval(timerInterval);
    timerBox.style.display = "none";
    noTimer.style.display = "block";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  timerBox.style.display = "block";
  noTimer.style.display = "none";
}

// Кнопка “Обновить”
refreshBtn.addEventListener("click", () => {
  updateDisplay();
});

// Конфетти при окончании
function launchConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function showNoTimer() {
  timerBox.style.display = "none";
  noTimer.style.display = "block";
}

window.addEventListener("load", loadTargetDate);
