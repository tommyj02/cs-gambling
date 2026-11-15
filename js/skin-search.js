import { Item } from './inventoryclasses.js';
import { user } from './user-state.js';

const itemListPath = './json/itemlist.json';
const itemList = JSON.parse(await fetch(itemListPath).then(res => res.text())); 

const skinSearch = document.getElementById('skin-search');
const skinsList = document.getElementById('skins-list');

const skinAddedOverlay = document.getElementById('skin-added-overlay');

skinSearch.addEventListener('input', () => {
    const searchFor = skinSearch.value.toLowerCase();
    const foundItems = itemList.filter(item => item.name.toLowerCase().includes(searchFor) || item.id.toString().includes(searchFor));
    skinsList.innerHTML = '';
    foundItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('inv-item');
        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.classList.add('inv-item-img');
        itemElement.appendChild(itemImage);
        itemElement.append(`${item.name}`);
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.classList.add('add-button');
        
        addButton.addEventListener('click', () => {
            if (!user) {
                alert('Create an account before adding skins.');
                return;
            }
            user.addItemToInventory(new Item(item.name, item.value, item.image));
            skinAddedOverlay.hidden = false;

            skinAddedOverlay.addEventListener('click', (event) => {
                if (event.target === skinAddedOverlay) {
                    skinAddedOverlay.hidden = true;
                }
            });

            setTimeout(() => {
                skinAddedOverlay.hidden = true;
            }, 2000);
        });

        itemElement.appendChild(addButton);
        skinsList.appendChild(itemElement);
    });
})

