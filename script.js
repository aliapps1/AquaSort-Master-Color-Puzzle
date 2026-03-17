let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];
let audioCtx = null;

const COLORS = ['#38bdf8', '#fb7185', '#34d399', '#fbbf24', '#818cf8', '#f472b6', '#2dd4bf', '#fb923c', '#a78bfa', '#a3e635'];

window.onload = () => {
    loadProgress();
    initGame();
};

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(freq = 150, duration = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function initGame() {
    tubesData = generateLevel(currentLevel);
    document.getElementById('level-number').innerText = currentLevel;
    document.getElementById('win-modal').style.display = 'none';
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
        const isComplete = colors.length === 4 && colors.every(c => c === colors[0]);
        tube.className = `tube ${selectedIndex === i ? 'selected' : ''} ${isComplete ? 'completed' : ''}`;
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
    const tubeElements = document.querySelectorAll('.tube');

    if (selectedIndex === null) {
        if (tubesData[i].length > 0) {
            selectedIndex = i;
            render();
        }
    } else {
        const from = tubesData[selectedIndex];
        const to = tubesData[i];
        
        if (selectedIndex !== i) {
            if (to.length < 4 && (to.length === 0 || to[to.length - 1] === from[from.length - 1])) {
                moveHistory.push(JSON.stringify(tubesData));
                playSound(200, 0.15); // صدای ریختن
                
                const color = from[from.length - 1];
                while(from.length > 0 && from[from.length-1] === color && to.length < 4) {
                    to.push(from.pop());
                }
                
                if (checkWin()) {
                    setTimeout(() => {
                        playSound(400, 0.5); // صدای پیروزی
                        document.getElementById('win-modal').style.display = 'flex';
                    }, 500);
                }
            } else {
                // افکت لرزش برای حرکت اشتباه
                tubeElements[i].classList.add('shake');
                playSound(100, 0.2); // صدای اخطار
                setTimeout(() => render(), 300);
            }
        }
        selectedIndex = null;
        render();
    }
}

function addExtraTube() {
    initAudio();
    if (tubesData.length < 15) {
        tubesData.push([]);
        render();
    }
}

function skipLevel() {
    if(confirm("Skip?")) { currentLevel++; initGame(); }
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
    localStorage.setItem('waterSort_save', currentLevel);
    initGame();
}

function resetLevel() {
    initGame();
}

function loadProgress() {
    const saved = localStorage.getItem('waterSort_save');
    if (saved) currentLevel = parseInt(saved);
}
