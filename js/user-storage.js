export function saveData(user) {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));
}
