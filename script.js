let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];
let audioCtx = null;

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6'];

window.onload = () => {
    loadProgress();
    initGame();
};

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playPourSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function loadProgress() {
    const saved = localStorage.getItem('waterSort_save');
    if (saved) currentLevel = parseInt(saved);
}

function saveProgress() {
    localStorage.setItem('waterSort_save', currentLevel);
}

function initGame() {
    tubesData = generateLevel(currentLevel);
    document.getElementById('level-number').innerText = currentLevel;
    document.getElementById('win-modal').style.display = 'none';
    moveHistory = [];
    render();
}

function generateLevel(lvl) {
    let colorCount = Math.min(3 + Math.floor(lvl / 5), 10);
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    allColors.sort(() => Math.random() - 0.5);
    let tubes = [];
    for(let i=0; i<colorCount; i++) tubes.push(allColors.slice(i*4, (i+1)*4));
    tubes.push([]); tubes.push([]);
    return tubes;
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
    initAudio();
    if (selectedIndex === null) {
        if (tubesData[i].length > 0) {
            selectedIndex = i;
            render();
        }
    } else {
        const from = tubesData[selectedIndex];
        const to = tubesData[i];
        if (selectedIndex !== i && to.length < 4) {
            const color = from[from.length - 1];
            if (to.length === 0 || to[to.length - 1] === color) {
                moveHistory.push(JSON.stringify(tubesData));
                playPourSound();
                while(from.length > 0 && from[from.length-1] === color && to.length < 4) {
                    to.push(from.pop());
                }
                if (checkWin()) {
                    saveProgress();
                    setTimeout(() => document.getElementById('win-modal').style.display = 'flex', 500);
                }
            }
        }
        selectedIndex = null;
        render();
    }
}

function addExtraTube() {
    initAudio();
    if (tubesData.length < 14) {
        tubesData.push([]);
        playPourSound();
        render();
    }
}

function skipLevel() {
    if(confirm("Skip this level?")) nextLevel();
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
