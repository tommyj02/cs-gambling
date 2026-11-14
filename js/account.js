const depositedAmountElement = document.getElementById('deposited-amount');
const accountNameElement = document.getElementById('account-name');

let deposited = localStorage.getItem('deposited');
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