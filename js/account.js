const depositedAmountElement = document.getElementById('deposited-amount');
const tilesPlayedElement = document.getElementById('tiles-played');
const accountNameElement = document.getElementById('account-name');
const resetButton = document.getElementById('reset-button');

let deposited = localStorage.getItem('deposited');
let tilesPlayed = localStorage.getItem('tilesPlayed');
let accountName = JSON.parse(localStorage.getItem('user'))?.name;

if (accountName) {
    accountNameElement.textContent = accountName;
} else {
    accountNameElement.textContent = 'No account found.';
}

if (deposited) {
    depositedAmountElement.textContent = 'Total deposited: ' + deposited;
}else{
    depositedAmountElement.textContent = 'You have not deposited any amount yet.';
}
if (tilesPlayed) {
    tilesPlayedElement.textContent = 'Tiles played: ' + tilesPlayed;
} else {
    tilesPlayedElement.textContent = 'You have not played any tiles yet.';
}

resetButton.addEventListener('click', () => {
    resetAccountData();
    location.reload();
});


function resetAccountData() {
    localStorage.removeItem('deposited');
    localStorage.removeItem('user');
    localStorage.removeItem('tilesPlayed');
}