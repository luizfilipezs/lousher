import { Pedido } from './models';
import {
  getRandomValueFromArray,
  getRandomDate
} from './utils';

const listSelector = document.querySelector('.items-list');

const names: string[] = [
  'Jéssica Barbosa',
  'Leandro de Almeida',
  'Joaquim Filho',
  'Cassandra de Oliveira',
  'Humberto Schulz',
  'Renata Alves'
];

export const renderItems = async () => {
  listSelector.innerHTML = '';

  const randomName = getRandomValueFromArray(names);

  for (const name of names) {
    const cls = name === randomName ? 'list-item selected-item' : 'list-item';
    const status = name === randomName ? 'read' : getRandomValueFromArray(['read', 'unread']);

    listSelector.innerHTML += `
      <div class="${cls}">
        <p class="item-description">
          ${name}, em ${getRandomDate()}
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
const orderListBy = (param: 'newer' | 'older' | 'unread'): void => { };



/*
// Render list
const refreshButton = document.getElementById('refresh');

window.addEventListener('load', renderItems);
refreshButton.addEventListener('click', renderItems);
*/