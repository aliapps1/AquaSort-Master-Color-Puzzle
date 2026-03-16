const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7', '#14b8a6'];
let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];
let audioUnlocked = false;

// تابع جدید برای باز کردن قفل صدای مرورگر
function unlockAudio() {
    if (!audioUnlocked) {
        const pour = document.getElementById('pour-sound');
        const win = document.getElementById('win-sound');
        
        // پخش و استاپ سریع برای فعال شدن در مرورگر
        pour.play().then(() => { pour.pause(); pour.currentTime = 0; });
        win.play().then(() => { win.pause(); win.currentTime = 0; });
        
        audioUnlocked = true;
        console.log("Audio Unlocked");
    }
}

function playSound(id) {
    const s = document.getElementById(id);
    if(s) {
        s.currentTime = 0;
        s.play().catch(e => console.log("Audio play failed:", e));
    }
}

function generateLevel(lvl) {
    let colorCount = Math.min(3 + Math.floor(lvl / 10), 10);
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    allColors.sort(() => Math.random() - 0.5);
    
    let newTubes = [];
    for(let i=0; i<colorCount; i++) {
        newTubes.push(allColors.slice(i*4, (i+1)*4));
    }
    newTubes.push([]); newTubes.push([]);
    return newTubes;
}

function initGame() {
    tubesData = generateLevel(currentLevel);
    document.getElementById('level-display').innerText = `LEVEL ${currentLevel}`;
    document.getElementById('win-modal').style.display = 'none';
    moveHistory = []; selectedIndex = null;
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
        tube.onclick = () => {
            unlockAudio(); // باز کردن قفل صدا در اولین کلیک
            handleTubeClick(i);
        };
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
            const from = tubesData[selectedIndex], to = tubesData[i];
            const color = from[from.length - 1];
            
            if (to.length < 4 && (to.length === 0 || to[to.length - 1] === color)) {
                moveHistory.push(JSON.stringify(tubesData));
                playSound('pour-sound'); 

                while (from.length > 0 && from[from.length - 1] === color && to.length < 4) {
                    to.push(from.pop());
                }
                
                if (checkWin()) { 
                    playSound('win-sound'); 
                    document.getElementById('win-modal').style.display = 'flex'; 
                }
            }
        }
        selectedIndex = null;
    }
    render();
}

function undo() { if (moveHistory.length > 0) { tubesData = JSON.parse(moveHistory.pop()); render(); } }
function checkWin() { return tubesData.every(t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0]))); }
function nextLevel() { currentLevel++; initGame(); }
function resetLevel() { initGame(); }

initGame();
