import { user } from './user-state.js';
import { updateBalanceDisplay } from './update-displays.js';

if (!document.getElementById('no-acc-overlay')) {
    await new Promise(resolve => document.addEventListener('shared-elements-loaded', resolve, { once: true }));
}

const gameTypeButtons = {
    auto: document.getElementById('auto-button'),
    manual: document.getElementById('manual-button')
};

const betAmountInput = document.getElementById('bet-amount-input');
const maxBetButton = document.getElementById('max-bet-button');
const autoPickButton = document.getElementById('auto-pick-button');
const resetButton = document.getElementById('reset-button');
const playAmountInput = document.getElementById('play-amount-input');
const infinitePlayButton = document.getElementById('infinite-play-button');
const startButton = document.getElementById('start-button');

const autoPlayContainer = document.getElementById('auto-play-container');

const manualPlayContainer = document.querySelector('.manual-play-container');
const playButton = document.getElementById('play-button');
const quickPlayButton = document.getElementById('quick-play-button');

const noAccountOverlay = document.getElementById('no-acc-overlay');
const loginButton = document.getElementById('login-button');
const closeNoAccOverlayButton = document.getElementById('close-no-acc-overlay');

const noFundsOverlay = document.getElementById('no-funds-overlay');
const closeNoFundsOverlayButton = document.getElementById('close-no-funds-overlay');
const depositButtonNoFunds = document.getElementById('no-funds-deposit-button');
const depositOverlay = document.getElementById('deposit-overlay');

closeNoFundsOverlayButton.addEventListener('click', () => {
    noFundsOverlay.hidden = true;
});

depositButtonNoFunds.addEventListener('click', () => {
    noFundsOverlay.hidden = true;
    depositOverlay.hidden = false;
});

const tilesContainer = document.getElementById('tiles-container');

const tileAmount = 40;

const hitSound = new Audio('./audio/hit.mp3');
const hitEmptySound = new Audio('./audio/hitempty.mp3');
const tileSelectSound = new Audio('./audio/tileselect.mp3');
const winSound = new Audio('./audio/win.mp3');

let tiles = []; 

for (let i = 0; i < tileAmount; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    const tileNumber = document.createElement('h1');
    tileNumber.classList.add('tile-number');
    tileNumber.textContent = i + 1;
    tile.appendChild(tileNumber);
    tilesContainer.appendChild(tile);
    tiles.push(tile);
}

if (!user) {
    noAccountOverlay.hidden = false;
    loginButton.addEventListener('click', () => {
        noAccountOverlay.hidden = true;
        location.href = 'index.html#register';
    });
    closeNoAccOverlayButton.addEventListener('click', () => {
        noAccountOverlay.hidden = true;
        location.href = 'index.html';
    });
    noAccountOverlay.addEventListener('click', (event) => {
        if (event.target === noAccountOverlay) {
            noAccountOverlay.hidden = true;
            location.href = 'index.html';
        }
    });
}else{
    startButton.disabled = true;
    playButton.disabled = true;
}

autoPlayContainer.hidden = false;

gameTypeButtons.auto.addEventListener('click', () => {
    gameTypeButtons.auto.setAttribute('aria-pressed', 'true');
    gameTypeButtons.manual.setAttribute('aria-pressed', 'false');
    
    autoPlayContainer.hidden = false;
    manualPlayContainer.hidden = true;
});

gameTypeButtons.manual.addEventListener('click', () => {
    gameTypeButtons.manual.setAttribute('aria-pressed', 'true');
    gameTypeButtons.auto.setAttribute('aria-pressed', 'false');
    
    autoPlayContainer.hidden = true;
    manualPlayContainer.hidden = false;
});

betAmountInput.addEventListener('input', () => {
    if (betAmountInput.value == 0) {
        betAmount = 0;
        startButton.disabled = true;
        playButton.disabled = true;
    }else if (betAmountInput.value !== '') {
        startButton.disabled = false;
        playButton.disabled = false;
        if (parseFloat(betAmountInput.value) > user.balance) {
            betAmountInput.value = user.balance;
        }
        betAmount = parseFloat(betAmountInput.value);
    } 
    else {
        betAmount = 0;
        startButton.disabled = true;
        playButton.disabled = true;
    }
    betAmountInput.value = betAmount;
});

maxBetButton.addEventListener('click', () => {
    betAmount = user.balance;
    betAmountInput.value = betAmount;
    if(user.balance == 0) {
        startButton.disabled = true;
        playButton.disabled = true;
    }else{
        startButton.disabled = false;
        playButton.disabled = false;
    }
});

infinitePlayButton.addEventListener('click', () => {
    if (infinitePlayButton.getAttribute('aria-pressed') === 'true') {
        infinitePlayButton.setAttribute('aria-pressed', 'false');
        infiniteBets = false;
    } else {
        infinitePlayButton.setAttribute('aria-pressed', 'true');
        infiniteBets = true;
    }
});

startButton.addEventListener('click', () => {
    if (autoBetRunning) {
        autoBetStopped = true;
        startButton.disabled = true;
        startButton.textContent = 'Stopping...';
        return;
    }

    if (selectedTiles.length === 0) return;
    if (!Number.isFinite(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }
    if (!infiniteBets && (!Number.isSafeInteger(bets) || bets <= 0)) {
        alert('Please enter a positive whole number of bets.');
        return;
    }
    if (user.balance < betAmount) {
        noFundsOverlay.hidden = false;
        return;
    }

    autoBetStopped = false;
    autoBetRunning = true;
    startButton.setAttribute('aria-pressed', 'true');
    startButton.textContent = 'Stop';
    setRoundControlsLocked(true);
    handleAutoBets().catch(error => {
        console.error('Auto betting failed', error);
        alert('Auto betting failed. Check the console for details.');
    });
});

playAmountInput.addEventListener('input', () => {
    bets = Number(playAmountInput.value);
});

playButton.addEventListener('click', () => {

    if(selectedTiles.length === 0) return;

    if (user.balance < betAmount) {
        noFundsOverlay.hidden = false;
        return;
    }

    if (playButton.getAttribute('aria-pressed') === 'true') {
        return;
    } 
    else {
        if(finishedDrops){
            tiles.forEach(tile => {
                tile.classList.remove('tile-hit');
            });
        }
        finishedDrops = false;
        playButton.setAttribute('aria-pressed', 'true');
        setRoundControlsLocked(true);
        handleManualBet();
        
    }
});

quickPlayButton.addEventListener('click', () => {
    if (quickPlayButton.getAttribute('aria-pressed') === 'true') {
        quickPlayButton.setAttribute('aria-pressed', 'false');
        playSpeed = 300;
    } else {
        quickPlayButton.setAttribute('aria-pressed', 'true');
        playSpeed = 50;
    }
});

resetButton.addEventListener('click', () => {
    clearTileSelection();
});

autoPickButton.addEventListener('click', () => {
    if (selectedTiles.length < maxTiles) {
        randomTileSelect();
    }else{
        clearTileSelection();
        randomTileSelect();
    }
});

const maxTiles = 10;

let selectedTiles = [];

tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        if (selectedTiles.includes(tile)) {

            unselectTile(tile);
            return;

        } else {
            selectTile(tile);
            return;
        }
    });
});

let playSpeed = 125;

let betAmount = 0;

let bets = 0;

let infiniteBets = false;

let finishedDrops = true;
let autoBetRunning = false;

function setRoundControlsLocked(locked) {
    [
        gameTypeButtons.auto, gameTypeButtons.manual, betAmountInput, maxBetButton,
        autoPickButton, resetButton, playAmountInput, infinitePlayButton, quickPlayButton
    ].forEach(control => {
        control.disabled = locked;
    });

    if(locked){
        tilesContainer.style.pointerEvents = 'none';
    } else {
        tilesContainer.style.pointerEvents = '';
    }

    playButton.disabled = locked || !(betAmount > 0);
    startButton.disabled = (locked && !autoBetRunning) || !(betAmount > 0);
}

function selectTile(tile) {
    if (!selectedTiles.includes(tile)) {
        if (selectedTiles.length < maxTiles) {
            selectedTiles.push(tile);
            tile.classList.add('tile-selected');
            tile.style.transform = 'scale(1.05)';
            playSound(tileSelectSound);
            setTimeout(() => {
                tile.style.transform = 'scale(1)';
            }, 500);

            if (selectedTiles.length === maxTiles) {
                tiles.forEach(t => {
                    if (!selectedTiles.includes(t)) {
                        t.classList.add('tile-disabled');
                        t.style.pointerEvents = 'none';
                    }
                });
            }
        }
    }
}

function unselectTile(tile) {
    selectedTiles.splice(selectedTiles.indexOf(tile), 1);
    tile.classList.remove('tile-selected');
    tile.classList.remove('tile-hit');
    tile.style.transform = 'scale(1)';

    tiles.forEach(t => {
        if (!selectedTiles.includes(t)) {
            t.classList.remove('tile-disabled');
            t.style.pointerEvents = 'auto';
        }
    });
}

async function randomTileSelect() {
    while (selectedTiles.length < maxTiles) {
        const tile = tiles[Math.floor(Math.random() * tiles.length)];
        if (!selectedTiles.includes(tile)) {
            selectTile(tile);
            await new Promise(r => setTimeout(r, 100));
        }
    }
}

function clearTileSelection() {
    [...selectedTiles].forEach(tile => {
        unselectTile(tile);
    });
}

let autoBetStopped = false;

async function handleAutoBets() {
    let played = 0;
    try {
        while (!autoBetStopped && (infiniteBets || played < bets)) {
            if (user.balance < betAmount) {
                noFundsOverlay.hidden = false;
                break;
            }
            tiles.forEach(tile => {
                tile.classList.remove('tile-hit');
            });
            finishedDrops = false;
            const roundFinished = new Promise(resolve => {
                document.addEventListener('tile-round-finished', event => resolve(event.detail), { once: true });
            });
            handleManualBet();
            await roundFinished;
            played++;
            if (!autoBetStopped && (infiniteBets || played < bets)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } finally {
        autoBetRunning = false;
        startButton.setAttribute('aria-pressed', 'false');
        startButton.textContent = 'Start';
        setRoundControlsLocked(false);
    }
}


function handleManualBet() {

    if (user.balance < betAmount) {
        noFundsOverlay.hidden = false;
        return;
    }

    if (closeActiveWinOverlay) closeActiveWinOverlay();

    balls.length = 0;
    let hits = [];
    for(let i = 0; i < selectedTiles.length; i++) {
        let hit = Math.floor(Math.random() * tiles.length);
        if (hits.includes(hit)) {
            i--;
        } else {
            console.log(`Hit: ${hit}`);
            hits.push(hit);
        }
    }
    hits.forEach((hit, index) => {
        
        const tile = tiles[hit];
        drawBall(tile, index * playSpeed);
        
        
    });

    const prevPlayedAmount = localStorage.getItem('tilesPlayed');
    localStorage.setItem('tilesPlayed', prevPlayedAmount ? (parseFloat(prevPlayedAmount) + betAmount).toFixed(2) : betAmount.toFixed(2));
    user.deduct(betAmount);
    updateBalanceDisplay(user);
}

function handleTileHit(tile) {
    if (selectedTiles.includes(tile)) {
        
        tile.classList.add('tile-hit');
        playSound(hitSound);
    }
}

const canvas = document.getElementById('ball-canvas');
const ctx = canvas.getContext('2d');
let balls = [];

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}




function drawBall(tile, delay) {
    balls.push({
        tile: tile,
        startTime: performance.now() + delay
    });
}

let tileHits = [];

function handlePayout(hits) {

    let payout = 0;

    switch(hits) {
        case 0:            
            break;
        case 1:            
            break;
        case 2:    
            break;
        case 3:
            payout = betAmount * 1.3;
            break;
        case 4:
            payout = betAmount * 2;
            break;
        case 5:
            payout = betAmount * 4;
            break;
        case 6:
            payout = betAmount * 12;
            break;
        case 7: 
            payout = betAmount * 40;
            break;
        case 8:
            payout = betAmount * 200;
            break;
        case 9:
            payout = betAmount * 1500;
            break;
        case 10:
            payout = betAmount * 1000000;
            break;
        default:
            break;
    }
    user.deposit(payout);
    updateBalanceDisplay(user);
    tileHits = [];
    if (payout > 0) {
        return showWinOverlay(payout, autoBetRunning ? 1000 : 3000);
    }
}

let closeActiveWinOverlay = null;

function showWinOverlay(payout, duration) {
    const winOverlay = document.getElementById('tiles-win-overlay');
    const winDiv = document.getElementById('tiles-win-overlay-content');
    const winCloseButton = document.getElementById('close-win-overlay');
    const winMessage = document.getElementById('tiles-win-message');
    winMessage.textContent = `You have won ${payout.toFixed(2)} coins!`;
    const winImage = document.getElementById('tiles-win-image');
    winImage.src = './images/coins2.png';
    winOverlay.hidden = false;

    playSound(winSound);

    return new Promise(resolve => {
        const close = () => {
            clearTimeout(timeout);
            closeActiveWinOverlay = null;
            winOverlay.hidden = true;
            winOverlay.removeEventListener('click', onOverlayClick);
            winDiv.removeEventListener('click', onContentClick);
            winCloseButton.removeEventListener('click', close);
            resolve();
        };
        const onOverlayClick = event => {
            if (event.target === winOverlay) close();
        };
        const onContentClick = event => {
            if (event.target === winDiv) close();
        };
        winOverlay.addEventListener('click', onOverlayClick);
        winDiv.addEventListener('click', onContentClick);
        winCloseButton.addEventListener('click', close);
        const timeout = setTimeout(close, duration);
        closeActiveWinOverlay = close;
    });
}

function playSound(sound) {
    const copy = sound.cloneNode();
    copy.play();
}

function runAnimation(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRect = canvas.getBoundingClientRect();

    

    balls = balls.filter(ball => {
        if (currentTime >= ball.startTime + 500) {
            if (selectedTiles.includes(ball.tile)) {
                tileHits.push(ball.tile);
                handleTileHit(ball.tile);
            }else{
                ball.tile.classList.add('tile-emptyhit');
                playSound(hitEmptySound);
                ball.tile.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    ball.tile.classList.remove('tile-emptyhit');
                    ball.tile.style.transform = 'scale(1)';
                }, 500);
            }
            return false; // Poistaa pallon
        }
        return true; 
    });

    balls.forEach(ball => {
        if (currentTime < ball.startTime) return;
        const tileRect = ball.tile.getBoundingClientRect();
        const x = tileRect.left - canvasRect.left + tileRect.width / 2;
        const targetY = tileRect.top - canvasRect.top + tileRect.height / 2;

        const progress = Math.min((currentTime - ball.startTime) / 500, 1);
        const easedProgress = progress * progress;
        const y = targetY - 500 * (1 - easedProgress);

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    });

    if(balls.length === 0 && !finishedDrops) {
        finishedDrops = true;

        const payoutFinished = handlePayout(tileHits.length);
        document.dispatchEvent(new CustomEvent('tile-round-finished', { detail: payoutFinished }));

        if (!autoBetRunning) {
            setTimeout(() => {
                playButton.setAttribute('aria-pressed', 'false');
                setRoundControlsLocked(false);
            }, 300);
        }
    }

    requestAnimationFrame(runAnimation);
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(runAnimation);