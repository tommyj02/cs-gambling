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

for (let i = 0; i < tileAmount; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tilesContainer.appendChild(tile);
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
    if (betAmountInput.value !== '') {
        if (parseFloat(betAmountInput.value) > user.balance) {
            betAmountInput.value = user.balance;
        }
        betAmount = parseFloat(betAmountInput.value);
    } else {
        betAmount = 0;
    }
    betAmountInput.value = betAmount;
});

maxBetButton.addEventListener('click', () => {
    betAmount = user.balance;
    betAmountInput.value = betAmount;
});

infinitePlayButton.addEventListener('click', () => {
    if (infinitePlayButton.getAttribute('aria-pressed') === 'true') {
        infinitePlayButton.setAttribute('aria-pressed', 'false');
    } else {
        infinitePlayButton.setAttribute('aria-pressed', 'true');
    }
});

startButton.addEventListener('click', () => {
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
    if (playButton.getAttribute('aria-pressed') === 'true') {
        return;
    } else {
        playButton.setAttribute('aria-pressed', 'true');
        setTimeout(() => {
            playButton.setAttribute('aria-pressed', 'false');
        }, playSpeed);
    }
});

quickPlayButton.addEventListener('click', () => {
    if (quickPlayButton.getAttribute('aria-pressed') === 'true') {
        quickPlayButton.setAttribute('aria-pressed', 'false');
        playSpeed = 2000;
    } else {
        quickPlayButton.setAttribute('aria-pressed', 'true');
        playSpeed = 500;
    }
});

let playSpeed = 2000;

let gameType = 'auto';

let betAmount = 0;

let bets = 0;

function handleAutoBets() {
    
}