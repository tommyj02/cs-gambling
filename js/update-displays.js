

export function updateBalanceDisplay(user) {
    if (!user) return;
    const balanceDisplay = document.getElementById('balance');
    balanceDisplay.textContent = user.balance.toFixed(2); // Saldon display kahden desimaalin tarkkuudella
}