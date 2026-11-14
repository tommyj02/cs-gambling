export class Item {
    constructor(name, value, image) {
        this.name = name;
        this.value = value;
        this.image = image;
    }
}

export class Inventory {
    constructor(items) {
        this.items = items || [];
    }

    addItem(item) {
        if(this.items.length == 108) {
            alert('Inventory is full, you cannot add more items.');
            return;
        }
        this.items.push(item);
        if(this.items.length == 108) {
            alert('Inventory is full, sell something or you will lose your next skin.');
        }
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }
}

export class User {
    constructor(name, balance, inventory) {
        this.name = name;
        this.balance = balance;
        this.inventory = inventory || new Inventory();
    }

    deposit(amount) {
        this.balance += amount;
    }

    addItemToInventory(item) {
        this.inventory.addItem(item);
    }

    removeItemFromInventory(item) {
        this.inventory.removeItem(item);
    }
}