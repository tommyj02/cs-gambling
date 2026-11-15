import { Inventory, User } from './inventoryclasses.js';

export let user = null;

const savedUser = localStorage.getItem('user');
if (savedUser) {
    const userData = JSON.parse(savedUser);
    const inventoryItems = userData.inventory && Array.isArray(userData.inventory.items)
        ? userData.inventory.items
        : [];
    user = new User(userData.name, userData.balance, new Inventory(inventoryItems));
}

export function setUser(newUser) {
    user = newUser;
}

export function saveData(user) {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));
}