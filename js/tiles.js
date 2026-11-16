import { user } from './user-state.js';


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


const tilesContainer = document.getElementById('tiles-container');

const tileAmount = 40;

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
    gameType = 'auto';
    autoPlayContainer.hidden = false;
    manualPlayContainer.hidden = true;
});

gameTypeButtons.manual.addEventListener('click', () => {
    gameTypeButtons.manual.setAttribute('aria-pressed', 'true');
    gameTypeButtons.auto.setAttribute('aria-pressed', 'false');
    gameType = 'manual';
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
    } else {
        infinitePlayButton.setAttribute('aria-pressed', 'true');
    }
});

startButton.addEventListener('click', () => {

    if(selectedTiles.length === 0) return;

    if (startButton.getAttribute('aria-pressed') === 'true') {
        startButton.setAttribute('aria-pressed', 'false');
        startButton.textContent = 'Start';
    } else {
        startButton.setAttribute('aria-pressed', 'true');
        startButton.textContent = 'Stop';
        setTimeout(() => {
            handleAutoBets();
        }, 500);
    }
});

playAmountInput.addEventListener('input', () => {
    if (playAmountInput.value !== '') {
        bets = playAmountInput.value;
    }
});

playButton.addEventListener('click', () => {

    if(selectedTiles.length === 0) return;

    if (playButton.getAttribute('aria-pressed') === 'true') {
        return;
    } else {
        if(finishedDrops){
            tiles.forEach(tile => {
                tile.classList.remove('tile-hit');
            });
        }
        finishedDrops = false;
        playButton.setAttribute('aria-pressed', 'true');
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

let playSpeed = 300;

let gameType = 'auto';

let betAmount = 0;

let bets = 0;

let finishedDrops = true;

function selectTile(tile) {
    if (!selectedTiles.includes(tile)) {
        if (selectedTiles.length < maxTiles) {
            selectedTiles.push(tile);
            tile.classList.add('tile-selected');
            tile.style.transform = 'scale(1.05)';
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

function randomTileSelect() {
    tiles.forEach(tile => {
        let pick = Math.random() < 0.1;
        if (pick) {
            selectTile(tile);
        }
    });
    if (selectedTiles.length !== maxTiles) {
        randomTileSelect();
    }
}

function clearTileSelection() {
    [...selectedTiles].forEach(tile => {
        unselectTile(tile);
    });
}

function handleAutoBets() {
    
}


function handleManualBet() {
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
    
}

function handleTileHit(tile) {
    if (selectedTiles.includes(tile)) {
        
        tile.classList.add('tile-hit');
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


function runAnimation(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRect = canvas.getBoundingClientRect();


    balls = balls.filter(ball => {
        if (currentTime >= ball.startTime + 500) {
            if (selectedTiles.includes(ball.tile)) {
                
                handleTileHit(ball.tile);
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
        setTimeout(() => {
            playButton.setAttribute('aria-pressed', 'false');
        }, 300);
    }

    requestAnimationFrame(runAnimation);
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(runAnimation);