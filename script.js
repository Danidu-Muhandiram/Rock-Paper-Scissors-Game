// Rock Paper Scissors Game Logic

function playGame(playerChoice) {
    // Generate random computer choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // winner
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update display elements
    updateDisplay(playerChoice, computerChoice, result);
}

function determineWinner(player, computer) {
    if (player === computer) {
        return "It's a tie!";
    }
    
    // Player wins conditions
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

function updateDisplay(playerChoice, computerChoice, result) {
    // display elements
    const playerDisplay = document.querySelector('.palyerDisplay');
    const computerDisplay = document.querySelector('.ComputerDisplay');
    const resultDisplay = document.querySelector('.ResultDisplay');
    
    // Update displays with choices and result
    playerDisplay.textContent = `You: ${capitalizeFirst(playerChoice)}`;
    computerDisplay.textContent = `Computer: ${capitalizeFirst(computerChoice)}`;
    resultDisplay.textContent = result;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}