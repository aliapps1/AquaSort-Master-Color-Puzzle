const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6'];
let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];

// ۱. سیستم ذخیره‌سازی
function saveProgress() {
    localStorage.setItem('aquaSort_currentLevel', currentLevel);
}

function loadProgress() {
    const savedLevel = localStorage.getItem('aquaSort_currentLevel');
    if (savedLevel) {
        currentLevel = parseInt(savedLevel);
    }
}

function playSound(id) {
    const s = document.getElementById(id);
    if(s) {
        s.currentTime = 0;
        s.play().catch(e => {});
    }
}

function startGame() {
    // بارگذاری آخرین مرحله ذخیره شده
    loadProgress();
    
    document.getElementById('start-screen').style.display = 'none';
    document.querySelector('.game-ui').style.display = 'flex';
    
    const p = document.getElementById('pour-sound');
    const w = document.getElementById('win-sound');
    p.load(); w.load();
    
    initGame();
}

function generateLevel(lvl) {
    let colorCount = Math.min(3 + Math.floor(lvl / 10), 10);
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    
    // استفاده از لول به عنوان سید برای رندومایزر (برای ثابت ماندن هر مرحله)
    let seed = lvl; 
    const random = () => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    
    allColors.sort(() => random() - 0.5);
    
    let newTubes = [];
    for(let i=0; i<colorCount; i++) {
        newTubes.push(allColors.slice(i*4, (i+1)*4));
    }
    newTubes.push([]);
    newTubes.push([]);
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
    let cols = tubesData.length > 8 ? 5 : (tubesData.length > 5 ? 4 : 3);
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
            if (from.length === 0) {
                selectedIndex = null;
                return;
            }
            const color = from[from.length - 1];
            
            if (to.length < 4 && (to.length === 0 || to[to.length - 1] === color)) {
                moveHistory.push(JSON.stringify(tubesData));
                playSound('pour-sound');

                while (from.length > 0 && from[from.length - 1] === color && to.length < 4) {
                    to.push(from.pop());
                }
                
                if (checkWin()) {
                    playSound('win-sound');
                    // ذخیره بلافاصله بعد از پیروزی
                    saveProgress(); 
                    setTimeout(() => {
                        document.getElementById('win-modal').style.display = 'flex';
                    }, 500);
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
    saveProgress(); // ذخیره لول جدید
    initGame();
}

function resetLevel() {
    initGame();
}
