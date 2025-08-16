const board = document.getElementById('board');
const confettiContainer = document.getElementById('confetti-container');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const turnDisplay = document.getElementById('turnDisplay');

// Using publicly hosted sound files to avoid file path errors
const clickSound = new Audio('https://actions.google.com/sounds/v1/cartoon/bubble_pop.ogg'); 
const newGameSound = new Audio('https://actions.google.com/sounds/v1/doors/door_knob_turn_and_click.ogg'); 
const confettiSound = new Audio('https://actions.google.com/sounds/v1/science/laser_zap.ogg'); 
const winSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'); 
const tieSound = new Audio('https://actions.google.com/sounds/v1/cartoon/airplane_cabin.ogg'); 

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

/**
 * Checks the game board for a winning combination.
 * @returns {boolean} True if a player has won, otherwise false.
 */
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

/**
 * Checks if the game is a tie.
 * @returns {boolean} True if the board is full with no winner, otherwise false.
 */
function checkTie() {
    return gameBoard.every(cell => cell !== '');
}

// Sound playing functions
function playClickSound() {
    clickSound.play(); 
}

function playNewGameSound() {
    newGameSound.play(); 
}

function playConfettiSound() {
    confettiSound.play(); 
}

function playWinSound() {
    winSound.play(); 
}

function playTieSound() {
    tieSound.play(); 
}

/**
 * Handles a click on a game cell.
 * @param {number} index The index of the clicked cell.
 */
function handleClick(index) {
    if (!gameActive || gameBoard[index] !== '') {
        return;
    }

    playClickSound();

    gameBoard[index] = currentPlayer;
    document.getElementById(`cell${index}`).innerText = currentPlayer;

    // Check for a winner first
    if (checkWinner()) {
        // Play sounds and animations BEFORE the alert() dialog
        // This is crucial because alert() is "modal" and blocks all other code execution
        playWinSound();
        triggerConfetti();
        updateScore();
        resetBoard();
        
        // Now show the alert, after the sounds and animations have started
        alert(`Player ${currentPlayer} wins!`);

    } else if (checkTie()) {
        playTieSound();
        resetBoard();
        alert('It\'s a tie!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
}

/**
 * Creates the 3x3 game board dynamically.
 */
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell${i}`;
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
    }
    updateTurnDisplay();
}

/**
 * Updates the score for the winning player.
 */
function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }
}

/**
 * Resets the game board for a new round.
 */
function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    updateTurnDisplay();
    gameActive = true;
}

/**
 * Starts a new game without resetting the score.
 */
function newGame() {
    gameActive = true;
    playNewGameSound();
    resetBoard();
}

/**
 * Resets the score to zero for both players.
 */
function resetScore() {
    scoreX = 0;
    scoreO = 0;
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
    resetBoard(); // Also reset the board when resetting the score
}

/**
 * Creates and animates confetti.
 */
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

    // Clear the confetti after 3 seconds
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 3000);
}

/**
 * Updates the display to show whose turn it is.
 */
function updateTurnDisplay() {
    turnDisplay.innerText = `Turn: Player ${currentPlayer}`;
}

// Initialize the board when the script loads
createBoard();
