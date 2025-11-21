// Simple Rock Paper Scissors Game
let gameInProgress = false;
let playerWins = 0;
let computerWins = 0;
const WINS_TO_WIN = 5;

function playGame(playerChoice) {
    // Don't allow clicking during game animation
    if (gameInProgress) {
        return;
    }
    
    // Start the game round
    gameInProgress = true;
    disableButtons();
    
    // Make the button look pressed
    animateButtonPress(playerChoice);
    
    // Start the game animation
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
    // Make buttons unclickable during game
    const buttons = document.querySelectorAll('.game_button');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function enableButtons() {
    // Make buttons clickable again
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
    
    // Show loading animation
    playerDisplay.classList.add('choice-updating');
    computerDisplay.classList.add('choice-updating');
    resultDisplay.classList.add('updating');
    
    // Show player choice first
    setTimeout(() => {
        playerDisplay.textContent = `You: ${capitalizeFirst(playerChoice)}`;
        playerDisplay.classList.remove('choice-updating');
        playerDisplay.classList.add('choice-reveal');
        setTimeout(() => playerDisplay.classList.remove('choice-reveal'), 500);
    }, 200);
    
    // Show countdown for computer
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
    // Computer picks randomly
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // Show computer choice
    computerDisplay.textContent = `Computer: ${capitalizeFirst(computerChoice)}`;
    computerDisplay.classList.remove('choice-updating');
    computerDisplay.classList.add('choice-reveal');
    
    setTimeout(() => {
        computerDisplay.classList.remove('choice-reveal');
        
        // Figure out who won
        const result = determineWinner(playerChoice, computerChoice);
        showResult(result, resultDisplay, playerChoice, computerChoice);
    }, 500);
}

function showResult(result, resultDisplay, playerChoice, computerChoice) {
    resultDisplay.textContent = result;
    resultDisplay.classList.remove('updating');
    resultDisplay.classList.add('show');
    
    // Color the winning choice
    highlightWinner(result, playerChoice, computerChoice);
    
    // Update the score
    updateWinCounter(result);
    
    setTimeout(() => {
        resultDisplay.classList.remove('show');
        
        // Check if game is over
        if (checkGameOver()) {
            return; // Don't allow more clicks if game ended
        }
        
        // Ready for next round
        setTimeout(() => {
            gameInProgress = false;
            enableButtons();
        }, 500);
    }, 500);
}

function highlightWinner(result, playerChoice, computerChoice) {
    const buttons = document.querySelectorAll('.game_button');
    
    // Reset all buttons first
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
    // Same choice = tie
    if (player === computer) {
        return "It's a tie!";
    }
    
    // Check if player wins
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
    // Ties don't increase anyone's score
    
    updateProgressBar();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressCenter = document.querySelector('.progress-center');
    
    // Show current score
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
            
            // Show background effects when someone wins the match
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
    
    // Clear all text displays
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

// Test functions for animations
function testWinAnimation() {
    console.log('Testing win animation...');
    triggerBackgroundAnimation('You win!');
}

function testLoseAnimation() {
    console.log('Testing lose animation...');
    triggerBackgroundAnimation('Computer wins!');
}

function triggerBackgroundAnimation(result) {
    const body = document.body;
    const container = document.getElementById('celebrationContainer');
    
    // Clear any existing animations
    container.innerHTML = '';
    body.className = body.className.replace(/\b(win|lose)-bg-pulse\b/g, '');
    
    console.log('Triggering background animation for:', result); // Debug log
    
    if (result.includes('You win')) {
        // Win animation - Progress bar explodes into confetti
        body.classList.add('win-bg-pulse');
        explodeProgressBar();
    } else if (result.includes('Computer wins')) {
        // Lose animation - Progress bar cracks and breaks apart
        body.classList.add('lose-bg-pulse');
        crackProgressBar();
    }
    
    // Clean up background pulse after animation
    setTimeout(() => {
        body.classList.remove('win-bg-pulse', 'lose-bg-pulse');
    }, 1000);
}

function explodeProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const container = document.getElementById('celebrationContainer');
    
    // Get progress bar position
    const rect = progressBar.getBoundingClientRect();
    
    // Create explosion pieces in waves
    const createExplosionWave = (waveNumber, totalWaves) => {
        const piecesPerWave = 10; // 10 pieces per wave
        const delay = waveNumber * 200; // 200ms between waves
        
        setTimeout(() => {
            for (let i = 0; i < piecesPerWave; i++) {
                const piece = document.createElement('div');
                piece.className = 'progress-piece explosion';
                
                // Use colored rectangles as confetti pieces
                const colors = ['#4CAF50', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF69B4', '#32CD32'];
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (4 + Math.random() * 12) + 'px'; // Reduced from 8-28px to 4-16px
                piece.style.height = (3 + Math.random() * 10) + 'px'; // Reduced from 6-21px to 3-13px
                piece.style.position = 'absolute';
                piece.style.left = rect.left + (rect.width / 2) + 'px';
                piece.style.top = rect.top + (rect.height / 2) + 'px';
                piece.style.borderRadius = '3px';
                piece.style.zIndex = '1002';
                
                // Random explosion direction with some waves going further
                const angle = (Math.PI * 2 * i) / piecesPerWave + (Math.random() - 0.5) * 0.5;
                const velocity = 80 + Math.random() * 150 + (waveNumber * 30); // Later waves go further
                const dx = Math.cos(angle) * velocity;
                const dy = Math.sin(angle) * velocity;
                
                piece.style.animation = `explode 3s ease-out forwards`; // Reduced from 4s to 3s
                piece.style.setProperty('--dx', dx + 'px');
                piece.style.setProperty('--dy', dy + 'px');
                
                container.appendChild(piece);
                
                // Clean up faster
                setTimeout(() => {
                    if (piece.parentNode) piece.parentNode.removeChild(piece);
                }, 3200); // Reduced from 4500ms to 3200ms
            }
        }, delay);
    };
    
    // Create 3 explosion waves
    for (let wave = 0; wave < 3; wave++) {
        createExplosionWave(wave, 3);
    }
    
    // Shake the progress container
    progressContainer.classList.add('shake-long');
    setTimeout(() => progressContainer.classList.remove('shake-long'), 800);
}

function crackProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const container = document.getElementById('celebrationContainer');
    
    // Get progress bar position
    const rect = progressBar.getBoundingClientRect();
    
    // Step 1: Change the progress bar to look like cracked red glass
    progressBar.style.background = 'linear-gradient(90deg, #8B0000, #DC143C, #B22222)';
    progressBar.style.border = '2px solid #FF0000';
    progressBar.style.boxShadow = 'inset 0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(255,0,0,0.3)';
    
    // Add crack patterns to the bar
    const addCrackOverlay = (delay = 0) => {
        setTimeout(() => {
            const crackDiv = document.createElement('div');
            crackDiv.style.position = 'absolute';
            crackDiv.style.top = '0';
            crackDiv.style.left = '0';
            crackDiv.style.width = '100%';
            crackDiv.style.height = '100%';
            crackDiv.style.background = `
                linear-gradient(${45 + Math.random() * 90}deg, transparent 48%, rgba(255,255,255,0.8) 49%, rgba(255,255,255,0.8) 51%, transparent 52%),
                linear-gradient(${-45 + Math.random() * 90}deg, transparent 48%, rgba(255,255,255,0.6) 49.5%, rgba(255,255,255,0.6) 50.5%, transparent 52%),
                linear-gradient(${Math.random() * 180}deg, transparent 47%, rgba(255,255,255,0.4) 50%, transparent 53%)
            `;
            crackDiv.style.pointerEvents = 'none';
            crackDiv.style.animation = 'crackAppear 0.8s ease-out forwards';
            progressBar.appendChild(crackDiv);
        }, delay);
    };
    
    // Show cracks appearing gradually
    addCrackOverlay(0);
    addCrackOverlay(300);
    addCrackOverlay(600);
    addCrackOverlay(900);
    
    // Step 2: Break the bar into falling pieces after 1.5 seconds
    setTimeout(() => {
        // Hide the original bar
        progressBar.style.opacity = '0';
        progressContainer.classList.add('heartbreak-shake');
        
        // Create glass pieces from the bar
        const barWidth = rect.width;
        const barHeight = rect.height;
        const piecesPerRow = 8;
        const rows = 3;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < piecesPerRow; col++) {
                const piece = document.createElement('div');
                piece.className = 'bar-glass-piece';
                
                // Size and position each piece
                const pieceWidth = barWidth / piecesPerRow;
                const pieceHeight = barHeight / rows;
                const startX = rect.left + (col * pieceWidth);
                const startY = rect.top + (row * pieceHeight);
                
                piece.style.position = 'absolute';
                piece.style.left = startX + 'px';
                piece.style.top = startY + 'px';
                piece.style.width = pieceWidth + 'px';
                piece.style.height = pieceHeight + 'px';
                
                // Style it to look like broken red glass
                piece.style.background = `linear-gradient(90deg, 
                    hsl(${350 + Math.random() * 20}, 80%, ${30 + Math.random() * 20}%), 
                    hsl(${340 + Math.random() * 30}, 90%, ${40 + Math.random() * 20}%))`;
                piece.style.border = '1px solid rgba(255,255,255,0.4)';
                piece.style.boxShadow = 'inset 1px 1px 2px rgba(255,255,255,0.3), 2px 2px 6px rgba(0,0,0,0.6)';
                
                // Make realistic jagged glass shard shape
                const points = [];
                const corners = [
                    [0, 0], [100, 0], [100, 100], [0, 100]
                ];
                
                corners.forEach(([x, y]) => {
                    const jitterX = x + (Math.random() - 0.5) * 30;
                    const jitterY = y + (Math.random() - 0.5) * 30;
                    points.push(`${Math.max(0, Math.min(100, jitterX))}% ${Math.max(0, Math.min(100, jitterY))}%`);
                });
                
                // Add extra jagged edges
                const extraPoints = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < extraPoints; i++) {
                    points.splice(
                        1 + Math.floor(Math.random() * (points.length - 1)), 
                        0, 
                        `${Math.random() * 100}% ${Math.random() * 100}%`
                    );
                }
                
                piece.style.clipPath = `polygon(${points.join(', ')})`;
                piece.style.zIndex = '1002';
                
                // Make pieces fall at different times
                const delay = (row * 100) + (col * 50) + Math.random() * 200;
                piece.style.animation = `barShatter ${2 + Math.random() * 1.5}s ease-in forwards`;
                piece.style.animationDelay = delay + 'ms';
                
                // Give each piece random falling motion
                piece.style.setProperty('--rotation', (Math.random() - 0.5) * 1080 + 'deg');
                piece.style.setProperty('--sway', (Math.random() - 0.5) * 300 + 'px');
                piece.style.setProperty('--fallSpeed', 80 + Math.random() * 40);
                
                container.appendChild(piece);
                
                // Clean up the piece after animation
                setTimeout(() => {
                    if (piece.parentNode) piece.parentNode.removeChild(piece);
                }, 4000);
            }
        }
    }, 1500);
    
    // Put the progress bar back to normal after animation
    setTimeout(() => {
        progressBar.style.background = '';
        progressBar.style.border = '';
        progressBar.style.boxShadow = '';
        progressBar.style.opacity = '1';
        progressBar.innerHTML = progressBar.innerHTML.replace(/<div[^>]*crack[^>]*>.*?<\/div>/g, '');
        progressContainer.classList.remove('heartbreak-shake');
    }, 4500);
}