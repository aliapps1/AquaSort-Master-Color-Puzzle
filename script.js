// سیستم مراحل سخت و حرفه‌ای (مشابه عکس‌های ارسالی)
const LEVELS = [
    { 
        tubes: [
            ['#FF3D00', '#3D5AFE', '#FF3D00', '#00E676'], 
            ['#00E676', '#FF3D00', '#00E676', '#3D5AFE'],
            ['#3D5AFE', '#00E676', '#3D5AFE', '#FF3D00'],
            ['#FFEA00', '#FFEA00', '#FFEA00', '#FFEA00'], // بطری یکرنگ
            ['#D500F9', '#D500F9', '#D500F9', '#D500F9'],
            [], [] // بطری‌های استراتژیک خالی
        ]
    },
    // مرحله با ۱۰ بطری (High-Class)
    {
        tubes: [
            ['#f44336', '#9c27b0', '#f44336', '#9c27b0'],
            ['#2196f3', '#4caf50', '#2196f3', '#4caf50'],
            ['#ffeb3b', '#ff9800', '#ffeb3b', '#ff9800'],
            ['#795548', '#607d8b', '#795548', '#607d8b'],
            ['#9c27b0', '#f44336', '#9c27b0', '#f44336'],
            ['#4caf50', '#2196f3', '#4caf50', '#2196f3'],
            ['#ff9800', '#ffeb3b', '#ff9800', '#ffeb3b'],
            ['#607d8b', '#795548', '#607d8b', '#795548'],
            [], []
        ]
    }
];

let currentLevel = 0;
let tubes = [];
let selected = null;
let history = []; // برای سیستم Undo

function init() {
    tubes = JSON.parse(JSON.stringify(LEVELS[currentLevel].tubes));
    document.getElementById('level-num').innerText = `LEVEL ${currentLevel + 1}`;
    document.getElementById('win-screen').style.display = 'none';
    history = [];
    render();
}

function render() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    
    // تنظیم ردیف‌ها: اگر تعداد بطری زیاد بود، در دو ردیف نمایش بده
    if (tubes.length > 6) {
        container.style.gridTemplateColumns = 'repeat(5, 1fr)';
    } else {
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }

    tubes.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = `tube ${selected === i ? 'selected' : ''}`;
        div.onclick = () => handleClick(i);
        t.forEach(color => {
            const liq = document.createElement('div');
            liq.className = 'liquid';
            liq.style.backgroundColor = color;
            div.appendChild(liq);
        });
        container.appendChild(div);
    });
}

function handleClick(i) {
    if (selected === null) {
        if (tubes[i].length > 0) selected = i;
    } else {
        const from = tubes[selected];
        const to = tubes[i];
        
        if (selected !== i && to.length < 4 && (to.length === 0 || to[to.length-1] === from[from.length-1])) {
            // ذخیره وضعیت برای Undo
            history.push(JSON.parse(JSON.stringify(tubes)));
            
            to.push(from.pop());
            if (checkWin()) {
                document.getElementById('win-screen').style.display = 'flex';
            }
        }
        selected = null;
    }
    render();
}

function undo() {
    if (history.length > 0) {
        tubes = history.pop();
        render();
    }
}

function checkWin() {
    return tubes.every(t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0])));
}

function nextLevel() {
    if (currentLevel < LEVELS.length - 1) {
        currentLevel++;
        init();
    }
}

function resetLevel() { init(); }

init();
