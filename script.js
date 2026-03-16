let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6'];

function startGame() {
    console.log("Button clicked!"); // برای تست در کنسول
    
    // مخفی کردن صفحه شروع
    const startScreen = document.getElementById('start-screen');
    const gameUI = document.querySelector('.game-ui');
    
    if(startScreen) startScreen.style.display = 'none';
    if(gameUI) gameUI.style.display = 'flex';
    
    loadProgress();
    initGame();
}

function loadProgress() {
    const saved = localStorage.getItem('waterSort_save');
    if (saved) currentLevel = parseInt(saved);
}

function saveProgress() {
    localStorage.setItem('waterSort_save', currentLevel);
}

function initGame() {
    // تولید مرحله ساده برای تست
    tubesData = [
        [COLORS[0], COLORS[1], COLORS[0], COLORS[1]],
        [COLORS[1], COLORS[0], COLORS[1], COLORS[0]],
        [], []
    ];
    
    document.getElementById('level-number').innerText = currentLevel;
    document.getElementById('win-modal').style.display = 'none';
    render();
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
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
        const from = tubesData[selectedIndex];
        const to = tubesData[i];
        if (selectedIndex !== i && to.length < 4) {
            if (to.length === 0 || to[to.length - 1] === from[from.length - 1]) {
                to.push(from.pop());
                if (checkWin()) {
                    saveProgress();
                    document.getElementById('win-modal').style.display = 'flex';
                }
            }
        }
        selectedIndex = null;
    }
    render();
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

function undo() {
    // فعلا برای تست ساده حذف شد
}
