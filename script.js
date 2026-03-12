// ===== ЦЕЛЕВОЕ ВРЕМЯ =====
// Указываем конкретный момент, до которого идёт таймер
// Формат: "ГГГГ-ММ-ДД ЧЧ:ММ:СС"
const TARGET_DATE = "2026-03-12 18:49:00"; 

let timerInterval = null;

// ===== DOM ЭЛЕМЕНТЫ =====
const timerBox = document.getElementById('timerBox');
const noTimer = document.getElementById('noTimer');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const refreshBtn = document.getElementById('refreshBtn');

// ===== СНЕГ =====
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
const maxFlakes = 100;

for (let i = 0; i < maxFlakes; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();

    for (let f of snowflakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }

    ctx.fill();
    updateSnow();
}

function updateSnow() {
    for (let f of snowflakes) {
        f.y += f.speed;
        f.x += Math.sin(f.y / height * Math.PI * 2) * 0.5;

        if (f.y > height) f.y = 0;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
    }

    requestAnimationFrame(drawSnow);
}

drawSnow();

// ===== ТАЙМЕР =====
window.addEventListener('load', startCountdown);
refreshBtn.addEventListener('click', () => {
    updateDisplay(); // просто обновляем цифры
});

// Основная функция отсчёта
function startCountdown() {
    updateDisplay(); // обновляем сразу
    timerInterval = setInterval(updateDisplay, 1000);
}

function updateDisplay() {
    const now = new Date();
    const target = new Date(TARGET_DATE);

    let diff = target - now; // разница в миллисекундах

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        timerBox.style.display = 'none';
        noTimer.style.display = 'block';
        clearInterval(timerInterval);
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    timerBox.style.display = 'block';
    noTimer.style.display = 'none';
}

// ===== CSS АНИМАЦИЯ =====
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0%,100%{
        transform:scale(1);
        box-shadow:0 0 40px rgba(168,85,247,0.4);
    }
    50%{
        transform:scale(1.05);
        box-shadow:0 0 60px rgba(0,255,255,0.6);
    }
}`;
document.head.appendChild(style);
