import { user } from './user-state.js';
import { showNoAccountOverlay } from './no-account.js';

const itemListPath = './json/itemlist.json';


const inventoryButton = document.getElementById('inv-button');
const inventoryOverlay = document.getElementById('inv-overlay');
const inventoryItemsContainer = document.getElementById('inv-items');
const closeInventoryOverlay = document.getElementById('close-inv-overlay');


inventoryButton.addEventListener('click', () => {
    inventoryOverlay.hidden = false;
    updateInventoryDisplay(user);
    
});

closeInventoryOverlay.addEventListener('click', () => {
    inventoryOverlay.hidden = true;
});

inventoryOverlay.addEventListener('click', (event) => {
    if (event.target === inventoryOverlay) {
        inventoryOverlay.hidden = true;
    }
});


const maxItems = 108; // Sopii just kivasti tohon ikkunaan 108 slottia

//const itemList = JSON.parse(await fetch(itemListPath).then(res => res.text())); 


export function updateInventoryDisplay(user) {

    if (!user) {
        inventoryOverlay.hidden = true;
        showNoAccountOverlay();
        return;
    }

    inventoryItemsContainer.innerHTML = '';
    var invSlots = [];
    for (let i = 0; i < maxItems; i++) {
        const itemSlotElement = document.createElement('div');
        itemSlotElement.classList.add('inv-slot');
        inventoryItemsContainer.appendChild(itemSlotElement);
        invSlots.push(itemSlotElement);
    }


    user.inventory.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('inv-item');
        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.classList.add('inv-item-img');
        itemElement.appendChild(itemImage);
        itemElement.append(`${item.name}`);

        const sellOverlay = document.createElement('div');
        sellOverlay.classList.add('sell-item');

        const sellButton = document.createElement('button');
        sellButton.type = 'button';
        sellButton.textContent = 'Sell';

        sellButton.addEventListener('click', () => {
            user.removeItemFromInventory(item);
            user.deposit(item.value);
            document.getElementById('balance').textContent = user.balance.toFixed(2);
            updateInventoryDisplay(user);
        });

        const valueText = document.createElement('span');
        valueText.textContent = `Value: ${item.value.toFixed(2)}`;
        valueText.classList.add('item-value');

        sellOverlay.appendChild(valueText);
        sellOverlay.appendChild(sellButton);
        itemElement.appendChild(sellOverlay);

        const emptySlot = invSlots.find(slot => !slot.hasChildNodes());
        if (emptySlot) {
            emptySlot.appendChild(itemElement);
        }
    });

}