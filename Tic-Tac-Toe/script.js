const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const winnerMessageElement = document.getElementById('winnerMessage');
const restartButton = document.getElementById('restartButton');
const startGameButton = document.getElementById('startGameButton');
let oTurn;
let mode;
let playerMarker;
let aiMarker;

startGameButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    mode = document.querySelector('input[name="mode"]:checked').value;
    playerMarker = document.querySelector('input[name="marker"]:checked').value;
    aiMarker = playerMarker === 'X' ? 'O' : 'X';
    oTurn = playerMarker === 'O';
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        cell.dataset.hover = playerMarker;
    });
    setBoardHoverClass();
    winnerMessageElement.innerText = '';
    board.style.pointerEvents = 'auto';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (mode === 'pve' && oTurn) {
            board.style.pointerEvents = 'none';
            setTimeout(() => {
                aiMove();
                board.style.pointerEvents = 'auto';
            }, 500);
        } else {
            updateHoverMarkers();
        }
    }
}

function endGame(draw) {
    if (draw) {
        winnerMessageElement.innerText = "Draw!";
    } else {
        winnerMessageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    }
    board.style.pointerEvents = 'none';
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function updateHoverMarkers() {
    cellElements.forEach(cell => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.dataset.hover = oTurn ? 'O' : 'X';
        } else {
            cell.dataset.hover = '';
        }
    });
}

function aiMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        updateHoverMarkers();
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
