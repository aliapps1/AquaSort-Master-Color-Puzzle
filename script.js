const LEVELS = [
    { colors: [['#ef4444', '#3b82f6', '#ef4444', '#3b82f6'], ['#3b82f6', '#ef4444', '#3b82f6', '#ef4444'], []] },
    { colors: [['#10b981', '#f59e0b', '#10b981'], ['#f59e0b', '#10b981', '#f59e0b'], [], []] }
];

let currentLevel = 0;
let tubes = [];
let selected = null;

function init() {
    const data = LEVELS[currentLevel];
    tubes = JSON.parse(JSON.stringify(data.colors));
    document.getElementById('level-tag').innerText = `LEVEL ${currentLevel + 1}`;
    document.getElementById('win-modal').style.display = 'none';
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
            to.push(from.pop());
            if (checkWin()) document.getElementById('win-modal').style.display = 'flex';
        }
        selected = null;
    }
    render();
}

function checkWin() {
    return tubes.every(t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0])));
}

function nextLevel() { currentLevel++; init(); }
function resetLevel() { init(); }

init();
