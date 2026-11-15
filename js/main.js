//Importit ja tiedostojen polut

import { Inventory, User } from './inventoryclasses.js';
import { user, setUser } from './user-state.js';
import './inventory.js';

// HTML DOM elementit



const gamesDropdown = document.getElementById('games-dropdown');
const depositButton = document.getElementById('deposit-button');
const accountButton = document.getElementById('account-button');
const visaOverlay = document.getElementById('visa-overlay');
const closeVisaOverlay = document.getElementById('close-visa-overlay');

const balanceDisplay = document.getElementById('balance');

const depositOverlay = document.getElementById('deposit-overlay');
const closeDepositOverlay = document.getElementById('close-deposit-overlay');

const depositAmountInput = document.getElementById('deposit-amount');
const submitDeposit = document.getElementById('submit-visa-deposit');
const visaError = document.getElementById('visa-error');
const visaCardNumber = document.getElementById('visa-card-number');
const visaCardExpiry = document.getElementById('visa-card-expiry');
const visaCardCvc = document.getElementById('visa-card-cvc');
const backToDeposit = document.getElementById('back-visa-overlay');

const visaOption = document.getElementById('visa-option');

const depositCompleteOverlay = document.getElementById('deposit-complete-overlay');
const depositCompleteMessage = document.getElementById('deposit-complete-message');
const closeDepositCompleteOverlay = document.getElementById('close-deposit-complete-overlay');


const accountOverlay = document.getElementById('account-overlay');
const closeAccountOverlay = document.getElementById('close-account-overlay');
const createAccountButton = document.getElementById('create-account');
const accountUsernameInput = document.getElementById('account-username');
const accountPasswordInput = document.getElementById('account-password');
const accountError = document.getElementById('account-error');

accountError.hidden = true;


const skinsButton = document.getElementById('skins-button');

// Event listenerit


//------------Pelin valinta-----------------

gamesDropdown.addEventListener('change', (event) => {
    const selectedGame = event.target.value;
    if (selectedGame === 'case-opening') {
        window.location.href = 'case-opening.html';
    } else if (selectedGame === 'tiles') {
        window.location.href = 'tiles.html';
    }
});

//---------------Overlay event listenerit-----------------


depositButton.addEventListener('click', () => {
    depositOverlay.hidden = false;
});

closeDepositOverlay.addEventListener('click', () => {
    depositOverlay.hidden = true;
});

depositOverlay.addEventListener('click', (event) => {
    if (event.target === depositOverlay) {
        depositOverlay.hidden = true;
    }
});

visaOption.addEventListener('click', () => {
    depositOverlay.hidden = true;
    visaOverlay.hidden = false;
});

closeVisaOverlay.addEventListener('click', () => {
    visaOverlay.hidden = true;
});

visaOverlay.addEventListener('click', (event) => {
    if (event.target === visaOverlay) {
        visaOverlay.hidden = true;
    }
});

backToDeposit.addEventListener('click', () => {
    visaOverlay.hidden = true;
    depositOverlay.hidden = false;
});

visaError.hidden = true;

submitDeposit.addEventListener('click', () => {
    const depositAmount = parseFloat(depositAmountInput.value);

    if (isNaN(depositAmount) || depositAmount <= 0) {
        visaError.textContent = 'Please enter a valid deposit amount.';
        visaError.hidden = false;
        return;
    }
    if (!visaCardNumber.value || !visaCardExpiry.value || !visaCardCvc.value) {
        visaError.textContent = 'Please fill in all card details.';
        visaError.hidden = false;
        return;
    }
    if (depositAmount > 100) {
        visaError.textContent = 'Deposit amount cannot exceed 100.';
        visaError.hidden = false;
        return;
    }
    if (!user) {
        visaError.textContent = 'Please log in to deposit.';
        visaError.hidden = false;
        return;
    }

    visaError.hidden = true;
    
    addBalance(depositAmount);
    depositOverlay.hidden = true;
    visaOverlay.hidden = true;
    depositCompleteMessage.textContent = `You have successfully deposited ${depositAmount.toFixed(2)}.`; 
    localStorage.setItem('deposited', depositAmount.toFixed(2));
    depositCompleteOverlay.hidden = false;
});

closeDepositCompleteOverlay.addEventListener('click', () => {
    depositCompleteOverlay.hidden = true;
});

depositCompleteOverlay.addEventListener('click', (event) => {
    if (event.target === depositCompleteOverlay) {
        depositCompleteOverlay.hidden = true;
    }
});

accountButton.addEventListener('click', () => {
    if (!user) {
        accountOverlay.hidden = false;
        return;
    }
    window.location.href = 'account.html';
});

closeAccountOverlay.addEventListener('click', () => {
    accountOverlay.hidden = true;
});

accountOverlay.addEventListener('click', (event) => {
    if (event.target === accountOverlay) {
        accountOverlay.hidden = true;
    }
});

createAccountButton.addEventListener('click', () => {
    const username = accountUsernameInput.value.trim();
    const password = accountPasswordInput.value.trim();

    if (!username || !password) {
        accountError.textContent = 'Please enter both username and password.';
        accountError.hidden = false;
        return;
    }

    setUser(new User(username, 0, new Inventory()));
    accountOverlay.hidden = true;
    accountError.hidden = true;
    
    updateBalanceDisplay(user);

    updateAccountDisplay(user);
});

skinsButton.addEventListener('click', () => {
    location.href = 'skins.html';
});


if (!user && location.hash === '#register') {
    accountOverlay.hidden = false;
    history.replaceState(null, '', location.pathname + location.search);
}



// Variablet

updateBalanceDisplay(user);
updateAccountDisplay(user);



function addBalance(amount) {
    if (!user) return;
    user.deposit(amount);
    localStorage.setItem('user', JSON.stringify(user));
    updateBalanceDisplay(user);
}

function updateBalanceDisplay(user) {
    if (!user) return;
    balanceDisplay.textContent = user.balance.toFixed(2); // Saldon display kahden desimaalin tarkkuudella
}

function updateAccountDisplay(user) {
    if(user) {
        accountButton.innerHTML = user.name;
    }else{
        accountButton.innerHTML = 'Login';
    }
}
