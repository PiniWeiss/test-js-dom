// משתנים גלובליים לניהול המצב
let scores = [0, 0];
let activePlayer = 0;
let targetScore = 50;
let gamePlaying = false;
let isRolling = false;

// אלמנטים מה-DOM
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const messageBox = document.getElementById('message-box');
const die1Cube = document.getElementById('die1');
const die2Cube = document.getElementById('die2');
const player0Panel = document.getElementById('player-0');
const player1Panel = document.getElementById('player-1');
const score0El = document.getElementById('score-0');
const score1El = document.getElementById('score-1');

// מפת רוטציות לכל מספר בקובייה
const diceRotations = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(0deg) rotateY(-90deg)',
    3: 'rotateX(0deg) rotateY(180deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(-90deg) rotateY(0deg)',
    6: 'rotateX(90deg) rotateY(0deg)'
};

// --- אירועים (Event Listeners) ---
document.getElementById('start-game-btn').addEventListener('click', startGame);
document.getElementById('roll-btn').addEventListener('click', rollDice);
document.getElementById('hold-btn').addEventListener('click', holdTurn);
document.getElementById('new-game-btn').addEventListener('click', showSetup);

// --- פונקציות משחק ---

function startGame() {
    targetScore = parseInt(document.getElementById('target-input').value) || 50;
    scores = [0, 0];
    activePlayer = Math.floor(Math.random() * 2);
    gamePlaying = true;
    isRolling = false;

    // שחרור נעילת כפתורים
    const rollBtn = document.getElementById('roll-btn');
    const holdBtn = document.getElementById('hold-btn');
    rollBtn.disabled = false;
    holdBtn.disabled = false;
    rollBtn.style.opacity = '1';
    holdBtn.style.opacity = '1';

    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    resetDicePositions();
    updateUI();
}

function showSetup() {
    setupScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
}

function rollDice() {
    if (!gamePlaying || isRolling) return;
    isRolling = true;

    // הפעלת אנימציית גלגול
    die1Cube.classList.add('rolling');
    die2Cube.classList.add('rolling');

    // המתנה לסיום האנימציה וקביעת התוצאה
    setTimeout(() => {
        const die1Result = Math.floor(Math.random() * 6) + 1;
        const die2Result = Math.floor(Math.random() * 6) + 1;

        // עצירת האנימציה וסיבוב לפאה הנכונה
        die1Cube.classList.remove('rolling');
        die2Cube.classList.remove('rolling');
        setDicePosition(die1Cube, die1Result);
        setDicePosition(die2Cube, die2Result);

        // עיבוד התוצאה לאחר שהקוביות נעצרו
        setTimeout(() => {
            processRoll(die1Result, die2Result);
            isRolling = false;
        }, 1100); // זמן לסיבוב הסופי
    }, 1000); // זמן אנימציית הגלגול
}

// קביעת המיקום הסופי של הקובייה
function setDicePosition(cubeEl, number) {
    const rotation = diceRotations[number];
    cubeEl.style.transform = `translateZ(calc(var(--die-size) / -2)) ${rotation}`;
}

function resetDicePositions() {
    setDicePosition(die1Cube, 1);
    setDicePosition(die2Cube, 1);
}

function processRoll(d1, d2) {
    if (d1 === d2) {
        scores[activePlayer] = 0;
        showMessage(`אוי לא! דאבל ${d1} 😱 הניקוד של ${getPlayerName()} התאפס!`);
        nextPlayer();
    } else {
        scores[activePlayer] += (d1 + d2);
        updateScoresUI();

        if (scores[activePlayer] >= targetScore) {
            gamePlaying = false;
            showMessage(`🎉 יש לנו מנצח! ${getPlayerName()} הגיע ליעד! 🏆`, true);
            
            // תיקון: ננעל רק את כפתורי המשחק ולא את כל האזור
            document.getElementById('roll-btn').disabled = true;
            document.getElementById('hold-btn').disabled = true;
            document.getElementById('roll-btn').style.opacity = '0.5';
            document.getElementById('hold-btn').style.opacity = '0.5';
        }
    }
}

function holdTurn() {
    if (gamePlaying && !isRolling) {
        nextPlayer();
    }
}

function nextPlayer() {
    activePlayer = activePlayer === 0 ? 1 : 0;
    updateUI();
}

// --- פונקציות UI ---

function updateUI() {
    updateScoresUI();
    // עדכון סטטוס "תורך" / "ממתין"
    player0Panel.classList.toggle('active', activePlayer === 0);
    player0Panel.querySelector('.status-badge').textContent = activePlayer === 0 ? 'תורך!' : 'ממתין...';
    player0Panel.querySelector('.status-badge').classList.toggle('waiting', activePlayer !== 0);
    
    player1Panel.classList.toggle('active', activePlayer === 1);
    player1Panel.querySelector('.status-badge').textContent = activePlayer === 1 ? 'תורך!' : 'ממתין...';
    player1Panel.querySelector('.status-badge').classList.toggle('waiting', activePlayer !== 1);
}

function updateScoresUI() {
    score0El.textContent = scores[0];
    score1El.textContent = scores[1];
}

function showMessage(text, persist = false) {
    messageBox.textContent = text;
    messageBox.classList.remove('hidden');
    messageBox.style.backgroundColor = persist ? '#27ae60' : '#e74c3c'; // ירוק לניצחון, אדום לדאבל

    if (!persist) {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

function getPlayerName() {
    return activePlayer === 0 ? "רס\"ן רון" : "סרן דני";
}