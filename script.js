// دیتای مراحل (هر رنگ ۴ بار تکرار می‌شود)
const LEVELS = [
    { // مرحله ۱: میان رده
        tubes: [['#ef4444', '#3b82f6', '#ef4444', '#3b82f6'], ['#3b82f6', '#ef4444', '#3b82f6', '#ef4444'], []]
    },
    { // مرحله ۲: سخت و "های‌کلاس" با ۱۰ بطری
        tubes: [
            ['#f44336', '#9c27b0', '#2196f3', '#4caf50'],
            ['#ffeb3b', '#ff9800', '#795548', '#607d8b'],
            ['#f44336', '#9c27b0', '#2196f3', '#4caf50'],
            ['#ffeb3b', '#ff9800', '#795548', '#607d8b'],
            ['#f44336', '#9c27b0', '#2196f3', '#4caf50'],
            ['#ffeb3b', '#ff9800', '#795548', '#607d8b'],
            ['#f44336', '#9c27b0', '#2196f3', '#4caf50'],
            ['#ffeb3b', '#ff9800', '#795548', '#607d8b'],
            [], [] // دو بطری خالی استراتژیک
        ]
    }
];

let currentLevelIndex = 0;
let tubesData = [];
let selectedIndex = null;
let moveHistory = [];

function initGame() {
    const level = LEVELS[currentLevelIndex];
    tubesData = JSON.parse(JSON.stringify(level.tubes));
    document.getElementById('level-display').innerText = `LEVEL ${currentLevelIndex + 1}`;
    document.getElementById('win-modal').style.display = 'none';
    moveHistory = [];
    selectedIndex = null;
    render();
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    // تنظیم ردیف‌ها بر اساس تعداد بطری
    if (tubesData.length > 5) {
        board.style.gridTemplateColumns = 'repeat(5, 1fr)';
    } else {
        board.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }

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
        if (tubesData[i].length > 0) {
            selectedIndex = i;
        }
    } else {
        if (selectedIndex !== i) {
            const fromTube = tubesData[selectedIndex];
            const toTube = tubesData[i];
            const colorToMove = fromTube[fromTube.length - 1];

            if (toTube.length < 4 && (toTube.length === 0 || toTube[toTube.length - 1] === colorToMove)) {
                // ذخیره برای Undo
                moveHistory.push(JSON.parse(JSON.stringify(tubesData)));
                
                // جابجایی تمام رنگ‌های مشابه متوالی
                while (fromTube.length > 0 && fromTube[fromTube.length - 1] === colorToMove && toTube.length < 4) {
                    toTube.push(fromTube.pop());
                }
                
                if (checkWin()) {
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
    return tubesData.every(tube => 
        tube.length === 0 || (tube.length === 4 && tube.every(c => c === tube[0]))
    );
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % LEVELS.length;
    initGame();
}

function resetLevel() {
    initGame();
}

// شروع بازی
initGame();
