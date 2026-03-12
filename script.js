// ===== КОНФИГУРАЦИЯ =====
// Используем CORS прокси для доступа к Gist'у
const GIST_URL = 'https://gist.githubusercontent.com/toolgool2021-coder/ccec7ab757f8ca35a783465f9c31eb66/raw/4aeb74103442ee044755ff3add663587efb5e5cf/Time.txt';
const CORS_PROXY = 'https://corsproxy.io/?';

let timerInterval = null;
let targetTime = null;

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
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
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

// Обработчик кнопки обновления
refreshBtn.addEventListener('click', () => {
    loadTimer();
    animateButton();
});

// Загрузить таймер при загрузке страницы
window.addEventListener('load', loadTimer);

// Автоматическое обновление каждые 5 секунд
setInterval(loadTimer, 5000);

async function loadTimer() {
    try {
        console.log('🔄 Загружаю таймер...');
        
        // Используем CORS прокси
        const proxyUrl = CORS_PROXY + encodeURIComponent(GIST_URL);
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📄 Содержимое Gist:', text);

        // Парсим формат [Day:Hour:Min:Sec]
        const match = text.match(/\[(\d+):(\d+):(\d+):(\d+)\]/);
        
        if (!match || !text) {
            console.log('❌ Таймер не найден');
            showNoTimer();
            return;
        }

        const days = parseInt(match[1]);
        const hours = parseInt(match[2]);
        const minutes = parseInt(match[3]);
        const seconds = parseInt(match[4]);

        console.log(`✅ Найден таймер: ${days}д ${hours}ч ${minutes}м ${seconds}с`);

        // Проверяем, есть ли вообще время
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            console.log('⏸️  Время = 0, показываю "нету таймеров"');
            showNoTimer();
            return;
        }

        // Вычисляем целевое время
        const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
        targetTime = Date.now() + totalSeconds * 1000;

        console.log(`⏱️  Целевое время: ${new Date(targetTime)}`);

        showTimer();
        startCountdown();
    } catch (error) {
        console.error('❌ Ошибка загрузки таймера:', error);
        showNoTimer();
    }
}

function showTimer() {
    timerBox.style.display = 'block';
    noTimer.style.display = 'none';
}

function showNoTimer() {
    timerBox.style.display = 'none';
    noTimer.style.display = 'block';
    stopCountdown();
}

function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    
    updateDisplay();
    timerInterval = setInterval(updateDisplay, 100);
}

function stopCountdown() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateDisplay() {
    if (!targetTime) return;

    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        stopCountdown();
        playFinishAnimation();
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
}

function playFinishAnimation() {
    timerBox.style.animation = 'none';
    setTimeout(() => {
        timerBox.style.animation = 'pulse 0.5s ease-in-out 3';
    }, 10);
}

function animateButton() {
    refreshBtn.style.opacity = '0.7';
    setTimeout(() => {
        refreshBtn.style.opacity = '1';
    }, 300);
}

// CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
        }
        50% { 
            transform: scale(1.05);
            box-shadow: 0 0 60px rgba(0, 255, 255, 0.6);
        }
    }
`;
document.head.appendChild(style);
