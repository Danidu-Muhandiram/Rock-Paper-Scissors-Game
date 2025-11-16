// Rock Paper Scissors Game Logic
let gameInProgress = false;
let playerWins = 0;
let computerWins = 0;
const WINS_TO_WIN = 5;

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
    
    // Update win counters and progress bar
    updateWinCounter(result);
    
    setTimeout(() => {
        resultDisplay.classList.remove('show');
        
        // Check for game over - this is where animations should trigger
        if (checkGameOver()) {
            return; // Don't re-enable buttons if game is over
        }
        
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

function updateWinCounter(result) {
    if (result.includes('You win')) {
        playerWins++;
    } else if (result.includes('Computer wins')) {
        computerWins++;
    }
    // Ties don't count toward win total
    
    updateProgressBar();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressCenter = document.querySelector('.progress-center');
    
    // Update center text
    progressCenter.textContent = `${playerWins} - ${computerWins}`;
    
    // Each win = 10% of bar width (5 wins = 50% of total bar)
    const playerPercentage = (playerWins / WINS_TO_WIN) * 50; // Player fills left half (0% to 50%)
    const computerPercentage = (computerWins / WINS_TO_WIN) * 50; // Computer fills right half (50% to 100%)
    
    // Create gradient: [Player Green][Center][Computer Red]
    // Player side: 0% to 50%, Computer side: 50% to 100%
    const playerEnd = playerPercentage; // How much green from left
    const computerStart = 100 - computerPercentage; // Where red starts from right
    
    progressFill.style.background = `linear-gradient(to right, 
        #4CAF50 0%, #4CAF50 ${playerEnd}%, 
        #333 ${playerEnd}%, #333 ${computerStart}%, 
        #f44336 ${computerStart}%, #f44336 100%)`;
}

function checkGameOver() {
    if (playerWins >= WINS_TO_WIN || computerWins >= WINS_TO_WIN) {
        const resultDisplay = document.querySelector('.ResultDisplay');
        const winner = playerWins >= WINS_TO_WIN ? 'YOU WIN THE MATCH!' : 'COMPUTER WINS THE MATCH!';
        
        setTimeout(() => {
            resultDisplay.textContent = winner;
            resultDisplay.style.fontSize = '35px';
            resultDisplay.style.color = playerWins >= WINS_TO_WIN ? '#4CAF50' : '#f44336';
            
            // Trigger background animations when match is won (5 wins reached)
            const matchResult = playerWins >= WINS_TO_WIN ? 'You win!' : 'Computer wins!';
            triggerBackgroundAnimation(matchResult);
            
            // Add reset button
            setTimeout(() => {
                const resetBtn = document.createElement('button');
                resetBtn.textContent = 'Play Again';
                resetBtn.className = 'reset-button';
                resetBtn.onclick = resetGame;
                document.body.appendChild(resetBtn);
            }, 2000);
        }, 1000);
        
        return true;
    }
    return false;
}

function resetGame() {
    playerWins = 0;
    computerWins = 0;
    gameInProgress = false;
    
    // Reset displays
    const resultDisplay = document.querySelector('.ResultDisplay');
    resultDisplay.textContent = "Let's play!";
    resultDisplay.style.fontSize = '40px';
    resultDisplay.style.color = 'white';
    
    const playerDisplay = document.querySelector('.palyerDisplay');
    const computerDisplay = document.querySelector('.ComputerDisplay');
    playerDisplay.textContent = 'You :';
    computerDisplay.textContent = 'Computer :';
    
    // Reset progress bar
    updateProgressBar();
    
    // Remove reset button
    const resetBtn = document.querySelector('.reset-button');
    if (resetBtn) {
        resetBtn.remove();
    }
    
    // Re-enable buttons
    enableButtons();
    
    // Reset button highlights
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        button.style.border = '3px solid white';
        button.style.boxShadow = 'none';
        button.style.backgroundColor = 'transparent';
    });
}

function triggerBackgroundAnimation(result) {
    const body = document.body;
    const container = document.getElementById('celebrationContainer');
    
    // Clear any existing animations
    container.innerHTML = '';
    body.className = body.className.replace(/\b(win|lose|tie)-bg-pulse\b/g, '');
    
    if (result.includes('You win')) {
        // Win animation
        body.classList.add('win-bg-pulse');
        createCelebrationItems(['🎉', '🎊', '✨', '🌟', '🎈', '🏆'], 'win-confetti', 15);
    } else if (result.includes('Computer wins')) {
        // Lose animation  
        body.classList.add('lose-bg-pulse');
        createCelebrationItems(['😢', '💧', '😔', '😞', '😿', '💔'], 'lose-float', 10);
    } else {
        // Tie animation
        body.classList.add('tie-bg-pulse');
        createCelebrationItems(['⭐', '✨', '💫', '🌟', '⚡', '💎'], 'tie-sparkle', 8);
    }
    
    // Remove background pulse class after animation
    setTimeout(() => {
        body.classList.remove('win-bg-pulse', 'lose-bg-pulse', 'tie-bg-pulse');
    }, 1000);
}

function createCelebrationItems(emojis, animationClass, count) {
    const container = document.getElementById('celebrationContainer');
    
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.className = `celebration-item ${animationClass}`;
        item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random positioning
        item.style.left = Math.random() * 100 + '%';
        item.style.top = Math.random() * -100 + 'px';
        
        // Random delay for staggered effect
        item.style.animationDelay = Math.random() * 2 + 's';
        
        // Random size variation
        const size = 20 + Math.random() * 20; // 20-40px
        item.style.fontSize = size + 'px';
        
        container.appendChild(item);
        
        // Remove item after animation completes
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, 5000);
    }
}