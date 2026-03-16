const COLORS = ['#FF3D00', '#3D5AFE', '#00E676', '#FFEA00', '#D500F9', '#00B0FF', '#FF9100', '#AEEA00', '#F50057', '#64FFDA'];

let currentLevel = 1;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];

// پخش صدای آب
function playSound(id) {
    const sound = document.getElementById(id);
    sound.currentTime = 0;
    sound.play();
}

// تولید مرحله هوشمند (از ۱ تا ۱۰۰۰)
function generateLevel(level) {
    let colorCount = Math.min(3 + Math.floor(level / 5), 10); // افزایش تدریجی رنگ‌ها
    let emptyTubes = 2;
    let totalTubes = colorCount + emptyTubes;
    
    let allColors = [];
    for(let i=0; i<colorCount; i++) {
        for(let j=0; j<4; j++) allColors.push(COLORS[i]);
    }
    
    // مخلوط کردن رنگ‌ها
    allColors.sort(() => Math.random() - 0.5);
    
    let newTubes = [];
    for(let i=0; i<colorCount; i++) {
        newTubes.push(allColors.slice(i*4, (i+1)*4));
    }
    for(let i=0; i<emptyTubes; i++) newTubes.push([]);
    
    return newTubes;
}

function initGame() {
    tubesData = generateLevel(currentLevel);
    document.getElementById('level-display').innerText = `LEVEL ${currentLevel}`;
    document.getElementById('win-modal').style.display = 'none';
    moveHistory = [];
    selectedIndex = null;
    render();
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    // تنظیم خودکار ردیف‌ها برای تعداد بطری زیاد
    let columns = tubesData.length > 8 ? 4 : (tubesData.length > 5 ? 3 : 3);
    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    tubesData.forEach((colors, i) => {
        const tube = document.createElement('div');
        tube.className = `tube ${selectedIndex === i ? 'selected' : ''}`;
        tube.onclick = () => handleTubeClick(i);
        colors.forEach(color => {
            const liquid = document.createElement('div');
            liquid.className = 'liquid';
            liquid.style.backgroundColor = color;
            tube.appendChild(liquid);
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
            const color = from[from.length - 1];

            if (to.length < 4 && (to.length === 0 || to[to.length - 1] === color)) {
                moveHistory.push(JSON.parse(JSON.stringify(tubesData)));
                playSound('pour-sound'); // صدای ریختن آب

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

function undo() {
    if (moveHistory.length > 0) {
        tubesData = moveHistory.pop();
        render();
    }
}

function checkWin() {
    return tubesData.every(t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0])));
}

function nextLevel() {
    currentLevel++;
    initGame();
}

function resetLevel() { initGame(); }

initGame();
