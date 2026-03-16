const LEVELS = [
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
            [], [] // دو بطری خالی برای شروع جابجایی
        ]
    }
];

let currentLevel = 0;
let tubes = [];
let selected = null;
let history = []; // برای سیستم برگشت به عقب

function init() {
    tubes = JSON.parse(JSON.stringify(LEVELS[currentLevel].tubes));
    render();
}

function render() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
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
            history.push(JSON.parse(JSON.stringify(tubes))); // ذخیره برای Undo
            to.push(from.pop());
            if (checkWin()) alert("Excellent! Level Clear");
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

init();
