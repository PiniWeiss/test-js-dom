// Game state
let gameState = {
  players: [
    { total: 0, name: "player 1" },
    { total: 0, name: "player 2" },
  ],
  currentPlayer: 0,
  gameActive: true,
  rolling: false,
};

let player1Score = document.getElementById("player1Total").textContent;
let player2Score = document.getElementById("player2Total");

// Update display
function updateDisplay() {
  document.getElementById("player1Total").textContent =
    gameState.players[0].total;
  document.getElementById("player2Total").textContent =
    gameState.players[1].total;

  // Update active player
  const player1Card = document.getElementById("player1Card");
  const player2Card = document.getElementById("player2Card");

  if (gameState.currentPlayer === 0) {
    player1Card.classList.add("active");
    player2Card.classList.remove("active");
    player1Card.querySelector(".current-turn").textContent = "your turn!";
    player2Card.querySelector(".current-turn").textContent = "wait...";
  } else {
    player1Card.classList.remove("active");
    player2Card.classList.add("active");
    player1Card.querySelector(".current-turn").textContent = "wait...";
    player2Card.querySelector(".current-turn").textContent = "your turn!";
  }
}

function diceRoling(currentPlayer) {
  const num1 = Math.floor(Math.random() * 6) + 1;
  const num2 = Math.floor(Math.random() * 6) + 1;
  document.getElementById("rollBtn").addEventListener("click", (e) => {
    const h2Dice1 = document.createElement("h2");
    const h2Dice2 = document.createElement("h2");
    h2Dice1.textContent = num1;
    document.querySelector("#dice2 .dice-face .dot").remove();
    document.querySelector("#dice2 .dice-face ").append(h2Dice1);
    h2Dice2.textContent = num2;
    document.querySelector("#dice1 .dice-face .dot").remove();
    document.querySelector("#dice1 .dice-face ").append(h2Dice2);
    if (currentPlayer === 0) {
      document.getElementById("player1Total").textContent =
        +document.getElementById("player1Total").textContent + num1 + num2;
      gameState.players[0].total += num1 + num2;
    } else if (currentPlayer === 1) {
      document.getElementById("player2Total").textContent =
        +document.getElementById("player2Total").textContent + num1 + num2;
      gameState.players[1].total += num1 + num2;
    }
  });
}

document.getElementById("holdBtn").addEventListener("click", () => {
  switchPlayer();
});

// Switch player
async function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
  
  updateDisplay(gameState.currentPlayer);
  
}


updateDisplay();
diceRoling(gameState.currentPlayer);
