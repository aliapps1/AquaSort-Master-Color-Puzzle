const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6', '#d9f99d', '#fb7185'];
let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];
let audioCtx = null;

// موتور صوتی آفلاین (دیجیتال)
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playPourSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function playWinSound() {
    if (!audioCtx) return;
    [523, 659, 783, 1046].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.2);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1); osc.stop(audioCtx.currentTime + i * 0.1 + 0.2);
    });
}

// سیستم ذخیره بی‌نهایت
function saveProgress() { localStorage.setItem('aquaSort_infinity_save', currentLevel); }
function loadProgress() {
    const saved = localStorage.getItem('aquaSort_infinity_save');
    if (saved) currentLevel = parseInt(saved);
}

function startGame() {
    initAudio();
    loadProgress();
    document.getElementById('start-screen').style.display = 'none';
    document.querySelector('.game-ui').style.display = 'flex';
    initGame();
}

// الگوریتم تولید مرحله نامحدود
function generateLevel(lvl) {
    // تعداد رنگ‌ها: از ۳ شروع می‌شود و با بالا رفتن لول تا ۱۲ رنگ افزایش می‌یابد
    let colorCount = Math.min(3 + Math.floor(lvl / 5), 12);
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    
    // استفاده از شماره لول برای فیکس کردن چیدمان آن لول
    let seed = lvl * 12345; 
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    
    // مخلوط کردن رنگ‌ها
    for (let i = allColors.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }
    
    let newTubes = [];
    for(let i=0; i<colorCount; i++) {
        newTubes.push(allColors.slice(i*4, (i+1)*4));
    }
    // اضافه کردن بطری‌های خالی (در لول‌های بالا ۳ بطری خالی برای تعادل)
    let emptyCount = lvl > 50 ? 3 : 2;
    for(let i=0; i<emptyCount; i++) newTubes.push([]);
    
    return newTubes;
}

function initGame() {
    tubesData = generateLevel(currentLevel);
    document.getElementById('level-number').innerText = currentLevel;
    document.getElementById('win-modal').style.display = 'none';
    moveHistory = [];
    selectedIndex = null;
    render();
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    // چیدمان هوشمند در ردیف‌های ۵ تایی برای موبایل
    let cols = Math.min(tubesData.length, 5);
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    tubesData.forEach((colors, i) => {
        const tube = document.createElement('div');
        tube.className = `tube ${selectedIndex === i ? 'selected' : ''}`;
        tube.onclick = () => handleTubeClick(i);
        colors.forEach(c => {
            const liq = document.createElement('div');
            liq.className = 'liquid';
            liq.style.backgroundColor = c;
            tube.appendChild(liq);
        });
        board.appendChild(tube);
    });
}

function handleTubeClick(i) {
    if (selectedIndex === null) {
        if (tubesData[i].length > 0) selectedIndex = i;
    } else {
        if (selectedIndex !== i) {
            const from = tubesData[selectedIndex];
            const to = tubesData[i];
            if (from.length > 0) {
                const color = from[from.length - 1];
                if (to.length < 4 && (to.length === 0 || to[to.length - 1] === color)) {
                    moveHistory.push(JSON.stringify(tubesData));
                    playPourSound();
                    while (from.length > 0 && from[from.length - 1] === color && to.length < 4) {
                        to.push(from.pop());
                    }
                    if (checkWin()) {
                        playWinSound();
                        saveProgress();
                        setTimeout(() => document.getElementById('win-modal').style.display = 'flex', 500);
                    }
                }
            }
        }
        selectedIndex = null;
    }
    render();
}

function undo() {
    if (moveHistory.length > 0) {
        tubesData = JSON.parse(moveHistory.pop());
        render();
    }
}

function checkWin() {
    return tubesData.every(t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0])));
}

function nextLevel() {
    currentLevel++;
    saveProgress();
    initGame();
}

function resetLevel() {
    initGame();
}
