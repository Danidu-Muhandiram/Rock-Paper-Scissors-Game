// Rock Paper Scissors Game Logic
let gameInProgress = false;

function playGame(playerChoice) {
    // Prevent clicks if game is already in progress
    if (gameInProgress) {
        return;
    }
    
    // Set game state to in progress
    gameInProgress = true;
    disableButtons();
    
    // Add button press animation
    animateButtonPress(playerChoice);
    
    // Start countdown/reveal sequence
    startGameSequence(playerChoice);
}

function animateButtonPress(choice) {
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        if (button.onclick.toString().includes(`'${choice}'`)) {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 300);
        }
    });
}

function disableButtons() {
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function enableButtons() {
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
}

function startGameSequence(playerChoice) {
    // Get display elements
    const playerDisplay = document.querySelector('.palyerDisplay');
    const computerDisplay = document.querySelector('.ComputerDisplay');
    const resultDisplay = document.querySelector('.ResultDisplay');
    
    // Show updating states
    playerDisplay.classList.add('choice-updating');
    computerDisplay.classList.add('choice-updating');
    resultDisplay.classList.add('updating');
    
    // Update player choice immediately
    setTimeout(() => {
        playerDisplay.textContent = `You: ${capitalizeFirst(playerChoice)}`;
        playerDisplay.classList.remove('choice-updating');
        playerDisplay.classList.add('choice-reveal');
        setTimeout(() => playerDisplay.classList.remove('choice-reveal'), 500);
    }, 200);
    
    // Countdown and reveal computer choice
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        computerDisplay.textContent = `Computer: ${countdown}...`;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            revealComputerChoice(playerChoice, computerDisplay, resultDisplay);
        }
    }, 600);
}

function revealComputerChoice(playerChoice, computerDisplay, resultDisplay) {
    // Generate random computer choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // Reveal computer choice with animation
    computerDisplay.textContent = `Computer: ${capitalizeFirst(computerChoice)}`;
    computerDisplay.classList.remove('choice-updating');
    computerDisplay.classList.add('choice-reveal');
    
    setTimeout(() => {
        computerDisplay.classList.remove('choice-reveal');
        
        // Determine winner and show result
        const result = determineWinner(playerChoice, computerChoice);
        showResult(result, resultDisplay, playerChoice, computerChoice);
    }, 500);
}

function showResult(result, resultDisplay, playerChoice, computerChoice) {
    resultDisplay.textContent = result;
    resultDisplay.classList.remove('updating');
    resultDisplay.classList.add('show');
    
    // Add winner highlighting
    highlightWinner(result, playerChoice, computerChoice);
    
    setTimeout(() => {
        resultDisplay.classList.remove('show');
        
        // Re-enable buttons after animation completes
        setTimeout(() => {
            gameInProgress = false;
            enableButtons();
        }, 500);
    }, 500);
}

function highlightWinner(result, playerChoice, computerChoice) {
    const buttons = document.querySelectorAll('.game_button');
    
    // Reset all buttons to default state
    buttons.forEach(button => {
        button.style.border = '3px solid white';
        button.style.boxShadow = 'none';
        button.style.backgroundColor = 'transparent';
    });
    
    if (result.includes('You win')) {
        highlightChoice(playerChoice, '#4CAF50'); // Green for player win
    } else if (result.includes('Computer wins')) {
        highlightChoice(computerChoice, '#f44336'); // Red for computer win
    } else {
        // Tie - highlight both
        highlightChoice(playerChoice, '#FFC107'); // Yellow for tie
        highlightChoice(computerChoice, '#FFC107');
    }
}

function highlightChoice(choice, color) {
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        if (button.onclick.toString().includes(`'${choice}'`)) {
            button.style.border = `3px solid ${color}`;
            button.style.backgroundColor = `${color}40`; // 40 = 25% opacity
            button.style.boxShadow = `0 0 25px ${color}80`;
        }
    });
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