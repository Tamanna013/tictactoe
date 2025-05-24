// DOM Elements
let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('clearBoardBtn');
let startGameBtn = document.getElementById('startGameBtn');
let gameArea = document.getElementById('gameArea');
let boxes = Array.from(document.getElementsByClassName('box'));
let player1NameInput = document.getElementById('player1Name');
let player2NameInput = document.getElementById('player2Name');
let setNamesBtn = document.getElementById('setNamesBtn');
let nameInputArea = document.getElementById('nameInputArea');
let confettiCanvas = document.getElementById('confettiCanvas');
let confettiCtx = confettiCanvas.getContext('2d');

// This gets a custom CSS variable --winning-blocks for the background color of winning cells.
let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

// Initialization
const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let player1Name = "Player 1";
let player2Name = "Player 2";

// Setting player names:
setNamesBtn.addEventListener('click', () => {
    player1Name = player1NameInput.value || player1Name;
    player2Name = player2NameInput.value || player2Name;
    nameInputArea.style.display = 'none';
    gameArea.classList.remove('hidden');
    startGameBtn.style.display = 'none';
    playerText.innerHTML = `${player1Name}'s Turn (X)`;
});

// Start game:
const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
};

// When a box is clicked: 
// Check if it’s empty.
// Fill it with the current player’s symbol.
// Check if that move caused a win:
// If yes, highlight the winning boxes and show a winner message.
// If it's a tie (all boxes filled), show a tie message.
// If the game isn’t over, switch to the next player.
function boxClicked(e) {
    const id = e.target.id;

    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon() !== false) {
            const winning_blocks = playerHasWon();
            playerText.innerHTML = `${currentPlayer === X_TEXT ? player1Name : player2Name} has won!`;

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);

            triggerConfetti();
            return;
        }

        if (spaces.every(space => space !== null)) {
            playerText.innerHTML = "It's a tie!";
            return;
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
        playerText.innerHTML = `${currentPlayer === X_TEXT ? player1Name : player2Name}'s Turn`;
    }
}

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// This function checks if the current player has filled any winning combination of boxes. If yes, it returns the winning indexes.
function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

// Confetti
function triggerConfetti() {
    confettiCanvas.style.display = 'block';
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    let confetti = [];
    for (let i = 0; i < 150; i++) {
        let shapeType = Math.random() > 0.5 ? '🌸' : Math.random() > 0.5 ? '🌻' : '🔥';
        confetti.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 6 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            size: Math.random() * 10 + 4,
            shape: shapeType
        });
    }

    let confettiInterval = setInterval(() => {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confetti.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.05; 

            if (particle.y > window.innerHeight) {
                particle.y = 0;
                particle.x = Math.random() * window.innerWidth;
            }

            confettiCtx.beginPath();
            if (particle.shape === '🌸') {
                confettiCtx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            } else if (particle.shape === '🌻') {
                confettiCtx.rect(particle.x, particle.y, particle.size, particle.size);
            } else if (particle.shape === '🔥') {
                confettiCtx.moveTo(particle.x, particle.y);
                confettiCtx.lineTo(particle.x + particle.size, particle.y);
                confettiCtx.lineTo(particle.x + particle.size / 2, particle.y - particle.size);
                confettiCtx.closePath();
            }
            confettiCtx.fillStyle = particle.color;
            confettiCtx.fill();
        });

    }, 1000 / 60);
    
    setTimeout(() => {
        clearInterval(confettiInterval);
        confettiCanvas.style.display = 'none';
    }, 5000);
}

restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerHTML = `${player1Name}'s Turn (X)`;
    currentPlayer = X_TEXT;
    confettiCanvas.style.display = 'none';
}

startGame();
