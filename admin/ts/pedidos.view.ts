import { View } from './types';
import { Pedido } from './models';
import { pedidoService } from './services';

type OrderParam = 'newer' | 'older';

export default class PedidosView implements View<Pedido> {
  items: Pedido[] = [];
  selectedItem: Pedido;

  http = pedidoService;

  orderBy: OrderParam = 'newer';
  iterateOrder = this.orderParameter();

  DOM: { [key: string]: HTMLElement } = {
    listSelector: document.querySelector('.items-list'),
    orderListButton: document.getElementById('order-by'),
    refreshButton: document.getElementById('refresh'),
    errorMessageMask: document.getElementById('mask')
  };

  constructor() {
    this.addListeners();
  }

  addListeners(): void {
    // Update list order
    this.DOM.orderListButton
      .addEventListener('click', () => {
        this.reorderItems();

        this.DOM.orderListButton.textContent =
          ['Mais recentes', 'Mais antigas', 'Não lidas']
          [['newer', 'older', 'unread'].indexOf(this.orderBy)];
      });

    // Refresh list
    this.DOM.refreshButton
      .addEventListener('click', () => this.getItems());
    
    // Close error message mask
    this.DOM.errorMessageMask
      .addEventListener('click', () => this.DOM.errorMessageMask.style.display = 'none');
  }

  private emitError(errorMessage: string): void {
    const element = document.querySelector('[errorMessage]');

    if (element) {
      element.textContent = errorMessage;
      this.DOM.errorMessageMask.style.display = 'flex';
    }
  }

  getItems(): void {
    this.DOM.refreshButton.style.opacity = '0.4';
    this.http.get()
      .then(
        items => {
          this.items = items;
          this.renderList();
        },
        error => this.emitError('Erro ao tentar obter os pedidos!')
      )
      .finally(() => this.DOM.refreshButton.style.opacity = '1');
  }

  renderList(): void {
    // Order list
    this.orderItems();

    // Clear list in DOM
    this.DOM.listSelector.innerHTML = '';

    // Check correct 
    const getClasses = (el: Pedido) => {
      let cls = 'list-item';
      if (this.selectedItem && el.id === this.selectedItem.id)
        cls += ' selected-item';
      return cls;
    };

    // Render list
    this.items.forEach(
      el => this.DOM.listSelector.innerHTML += `
        <div class="${getClasses(el)}" id="${el.id}">
          <p class="item-description">
            ${el.endereco.nome_destinatario}, em ${el.data_pedido}
          </p>
          <p class="item-status">${el.status}</p>
        </div>
      `
    );
    
    // Update list when an item is selected
    [...this.DOM.listSelector.children].forEach(el =>
      el.addEventListener('click', () => this.selectItem(el)));
  }

  selectItem(element: Element): void {
    // Update selected item
    this.selectedItem = this.items.find(i => i.id === +element.id);
    // Recreate list in DOM
    this.renderSelectedOne();
  }

  renderSelectedOne(): void {
    // Inforations about the order / DOM elements
    const
      item = this.selectedItem,
      address = item.endereco,
      model = {
        id: item.id,
        nome: address.nome_destinatario,
        data_pedido: item.data_pedido,
        mensagem: item.observacoes
      },
      bindingElements = document.querySelectorAll('[bind]'),
      listItems = document.querySelectorAll('.list-item');

    // Render message
    bindingElements.forEach(
      el => {
        const field = el.getAttribute('bind');

        if (field && model[field])
          el.textContent = model[field];
      }
    );
    
    // Update classes for selecting an item from list
    listItems.forEach(
      el => {
        if (el.id === this.selectedItem.id.toString()) {
          if (!el.classList.contains('selected-item'))
            el.classList.add('selected-item');
        }
        else {
          if (el.classList.contains('selected-item'))
            el.classList.remove('selected-item');
        }
      }
    );
  }

  orderItems(): void {
    if (this.orderBy === 'newer')
      this.items.sort((a, b) => b.id - a.id);
    else if (this.orderBy === 'older')
      this.items.sort((a, b) => a.id - b.id);
  }

  private *orderParameter() {
    while (true) {
      yield this.orderBy = 'older';
      yield this.orderBy = 'newer';
    }
  }

  reorderItems(): void {
    this.iterateOrder.next();
    this.orderItems();
    this.renderList();
  }
  
}