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

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let player1Name = "Player 1";
let player2Name = "Player 2";

setNamesBtn.addEventListener('click', () => {
    player1Name = player1NameInput.value || player1Name;
    player2Name = player2NameInput.value || player2Name;
    nameInputArea.style.display = 'none';
    gameArea.classList.remove('hidden');
    startGameBtn.style.display = 'none';
    playerText.innerHTML = `${player1Name}'s Turn (X)`;
});

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
};

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

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

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
