"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItems = void 0;
const utils_1 = require("./utils");
const listSelector = document.querySelector('.items-list');
const names = [
    'Jéssica Barbosa',
    'Leandro de Almeida',
    'Joaquim Filho',
    'Cassandra de Oliveira',
    'Humberto Schulz',
    'Renata Alves'
];
exports.renderItems = async () => {
    listSelector.innerHTML = '';
    const randomName = utils_1.getRandomValueFromArray(names);
    for (const name of names) {
        const cls = name === randomName ? 'list-item selected-item' : 'list-item';
        const status = name === randomName ? 'read' : utils_1.getRandomValueFromArray(['read', 'unread']);
        listSelector.innerHTML += `
      <div class="${cls}">
        <p class="item-description">
          ${name}, em ${utils_1.getRandomDate()}
        </p>
        <p class="item-status ${status}"></p>
      </div>
    `;
        await new Promise(r => setTimeout(r, 100));
    }
};
/**
 * Order items list by date or unread messages
 * @param param {'newer' | 'older' | 'unread'}
 */
const orderListBy = (param) => { };
/*
// Render list
const refreshButton = document.getElementById('refresh');

window.addEventListener('load', renderItems);
refreshButton.addEventListener('click', renderItems);
*/ 
