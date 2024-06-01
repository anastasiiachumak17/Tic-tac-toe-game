const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const timerDisplay = document.querySelector("#time-left");
const newGameButton = document.querySelector("#new-game");
const circleScoreDisplay = document.querySelector("#circle-score");
const crossScoreDisplay = document.querySelector("#cross-score");

const startCells = ["", "", "", "", "", "", "", "", ""];
let go = 'circle';
let timeLeft = 60;
let timer;
let circleScore = 0;
let crossScore = 0;

infoDisplay.textContent = 'Circle goes first';

function createBoard() {
    gameBoard.innerHTML = '';
    startCells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('square');
        cellElement.id = index;
        cellElement.addEventListener('click', addGo);
        gameBoard.append(cellElement);
    });
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            infoDisplay.textContent = (go === 'circle' ? 'Cross' : 'Circle') + ' wins by timeout!';
            updateScore(go === 'circle' ? 'cross' : 'circle');
            disableBoard();
        }
    }, 1000);
}

function disableBoard() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
}

function addGo(e) {
    const goDisplay = document.createElement("div");
    goDisplay.classList.add(go);
    e.target.append(goDisplay);
    go = go === 'circle' ? 'cross' : 'circle';
    infoDisplay.textContent = 'It is now ' + go + "'s go";
    e.target.removeEventListener('click', addGo);
    startTimer();
    checkScore();
}

function checkScore() {
    const allSquares = document.querySelectorAll('.square');
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let gameWon = false;

    winningCombos.forEach(array => {
        const circleWins = array.every(cell =>
            allSquares[cell].firstChild?.classList.contains('circle'));
        if (circleWins) {
            infoDisplay.textContent = 'Circle Wins!';
            clearInterval(timer);
            disableBoard();
            updateScore('circle');
            gameWon = true;
            highlightWinningCombination(array);
        }
    });

    winningCombos.forEach(array => {
        const crossWins = array.every(cell =>
            allSquares[cell].firstChild?.classList.contains('cross'));
        if (crossWins) {
            infoDisplay.textContent = 'Cross Wins!';
            clearInterval(timer);
            disableBoard();
            updateScore('cross');
            gameWon = true;
            highlightWinningCombination(array);
        }
    });

    if (!gameWon && [...allSquares].every(square => square.firstChild)) {
        infoDisplay.textContent = 'It\'s a draw!';
        clearInterval(timer);
        disableBoard();
    }
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        document.getElementById(index).classList.add('highlight');
    });
}

function updateScore(winner) {
    if (winner === 'circle') {
        circleScore++;
        circleScoreDisplay.textContent = `Circle: ${circleScore}`;
    } else {
        crossScore++;
        crossScoreDisplay.textContent = `Cross: ${crossScore}`;
    }
}

newGameButton.addEventListener('click', () => {
    go = 'circle';
    infoDisplay.textContent = 'Circle goes first';
    createBoard();
    startTimer();
});

createBoard();
startTimer();