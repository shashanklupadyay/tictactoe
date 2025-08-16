const board = document.getElementById('board');
const confettiContainer = document.getElementById('confetti-container');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const turnDisplay = document.getElementById('turnDisplay');
const clickSound = new Audio('path/to/click-sound.mp3'); // Replace with the path to your click sound
const newGameSound = new Audio('path/to/new-game-sound.mp3'); // Replace with the path to your new game sound
const confettiSound = new Audio('path/to/confetti-sound.mp3'); // Replace with the path to your confetti sound
const winSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'); // Default browser sound for winning
const tieSound = new Audio('https://actions.google.com/sounds/v1/cartoon/airplane_cabin.ogg'); // Default browser sound for a tie

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }

    return false;
}

function checkTie() {
    return gameBoard.every(cell => cell !== '');
}

function playClickSound() {
    clickSound.play(); // Play click sound
}

function playNewGameSound() {
    newGameSound.play(); // Play new game sound
}

function playConfettiSound() {
    confettiSound.play(); // Play confetti sound
}

function playWinSound() {
    winSound.play(); // Play win sound
}

function playTieSound() {
    tieSound.play(); // Play tie sound
}

function handleClick(index) {
    if (!gameActive || gameBoard[index] !== '') {
        return;
    }

    playClickSound();

    gameBoard[index] = currentPlayer;
    document.getElementById(`cell${index}`).innerText = currentPlayer;

    if (checkWinner()) {
        playWinSound();
        alert(`Player ${currentPlayer} wins!`);
        updateScore();
        triggerConfetti();
        resetBoard();
    } else if (checkTie()) {
        playTieSound();
        alert('It\'s a tie!');
        resetBoard();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell${i}`;
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
    }
    updateTurnDisplay(); // Initialize the turn display
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }
}

function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    updateTurnDisplay();
}

function newGame() {
    gameActive = true;
    playNewGameSound();
    resetBoard();
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
}

function triggerConfetti() {
    confettiContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        confettiContainer.appendChild(confetti);
    }

    playConfettiSound();

    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 3000);
}

function updateTurnDisplay() {
    turnDisplay.innerText = `Turn: Player ${currentPlayer}`;
}

createBoard();
