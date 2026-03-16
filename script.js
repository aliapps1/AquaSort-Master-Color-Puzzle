const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6', '#d9f99d', '#fb7185'];
let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];

// صدای واقعی ریختن آب (بصورت کد شده برای کارکرد آفلاین)
const POUR_SOUND_BASE64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA== "; 
// نکته: برای جلوگیری از سنگین شدن متن اینجا، از Audio استفاده می‌کنیم
const pourAudio = new Audio("https://www.soundjay.com/misc/sounds/water-pour-1.mp3"); // این را در اپلیکیشن نهایی با فایل محلی جایگزین می‌کنیم

function playPour() {
    pourAudio.currentTime = 0;
    pourAudio.volume = 0.5;
    pourAudio.play().catch(e => console.log("Click to enable sound"));
}

function startGame() {
    loadProgress();
    document.getElementById('start-screen').style.display = 'none';
    document.querySelector('.game-ui').style.display = 'flex';
    pourAudio.play().then(() => { pourAudio.pause(); }); // باز کردن قفل صدا
    initGame();
}

// سیستم ذخیره
function saveProgress() { localStorage.setItem('waterSort_save', currentLevel); }
function loadProgress() {
    const saved = localStorage.getItem('waterSort_save');
    if (saved) currentLevel = parseInt(saved);
}

// تولید مرحله بی‌نهایت
function generateLevel(lvl) {
    let colorCount = Math.min(3 + Math.floor(lvl / 6), 12);
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    
    let seed = lvl * 1234; 
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    
    for (let i = allColors.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }
    
    let newTubes = [];
    for(let i=0; i<colorCount; i++) newTubes.push(allColors.slice(i*4, (i+1)*4));
    newTubes.push([]); newTubes.push([]);
    if(lvl > 20) newTubes.push([]); // بطری سوم خالی برای مراحل سخت
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
    let cols = tubesData.length > 9 ? 5 : (tubesData.length > 5 ? 4 : 3);
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
                    playPour(); // پخش صدای واقعی
                    while (from.length > 0 && from[from.length - 1] === color && to.length < 4) {
                        to.push(from.pop());
                    }
                    if (checkWin()) {
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
