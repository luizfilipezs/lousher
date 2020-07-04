import { View } from './types';
import { Pedido, Endereco } from './models';
import { pedidoService } from './services';
import { removeSpecialChars } from './utils';

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
    errorMessageMask: document.getElementById('mask'),
    updateStatusButton: document.getElementById('update-status-btn')
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

    // Update order status
    this.DOM.updateStatusButton
      .addEventListener('click', () => this.updateStatus());
    
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

  private updateStatus(): void {
    const id = this.selectedItem.id;
    let status = removeSpecialChars(this.selectedItem.status);

    if (status === 'em analise')
      status = 'analise';
    else if (status === 'preparando envio')
      status = 'preparando';

    this.http.patch({ status }, id)
      .then(
        (partial) => {
          // DOM selectors and available CSS classes
          const
            parentElement = document.getElementById(id.toString()),
            statusSelector = document.createElement('p'),
            classes = [
              'em-analise',
              'preparando-envio',
              'despachado',
              'suspenso',
              'cancelado',
              'entregue'
            ];
          
          // Remove old status text
          parentElement.querySelector('.item-status').remove();

          // Update text
          status = partial.status;

          // Add status style
          statusSelector.classList.add('item-status');

          switch(status) {
            case 'analise':
              statusSelector.classList.add(classes[0]);
              statusSelector.innerHTML = 'em análise';
              break;
            case 'preparando':
              statusSelector.classList.add(classes[1]);
              statusSelector.innerHTML = 'preparando envio';
              break;
            default:
              statusSelector.classList.add(classes.find(cls => cls === status));
              statusSelector.innerHTML = status;
          }

          // Add status text to the DOM
          parentElement.appendChild(statusSelector);
        },
        (error) => this.emitError(`Erro ao tentar atualizar o status do pedido #${id}!`)
      );
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

    const getStatusClass = (status: string) => removeSpecialChars(status).replace(/ /g, '-');

    // Render list
    this.items.forEach(
      el => this.DOM.listSelector.innerHTML += `
        <div class="${getClasses(el)}" id="${el.id}">
          <p class="item-description">
            ${el.endereco.nome_destinatario}, em ${el.data_pedido}
          </p>
          <p class="item-status ${getStatusClass(el.status)}">${el.status}</p>
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
        mensagem: item.observacoes,
        ...this.formatAddress(item.endereco)
      },
      bindingElements = document.querySelectorAll('[bind]'),
      listItems = document.querySelectorAll('.list-item'),
      statusBoxes = document.querySelectorAll('.status-box');
    
    // Display content parent
    const
      contentSelector = document.querySelector('.open-content') as HTMLElement,
      hasInvisibleAttr = contentSelector.getAttribute('invisibleUntil') === 'open-content';

    if (hasInvisibleAttr)
      contentSelector.style.visibility = 'visible';

    // Render message
    bindingElements.forEach(
      el => {
        const field = el.getAttribute('bind');

        if (field && model[field])
          el.textContent = model[field];
      }
    );

    // Select status
    const updateStatusBoxes = () => statusBoxes.forEach(
      el => {
        const cls = 'selected-status';

        if (el.textContent === this.selectedItem.status)
          el.classList.add(cls);
        else if (el.classList.contains(cls))
          el.classList.remove(cls);
      }
    );

    updateStatusBoxes();

    statusBoxes.forEach(el => el.addEventListener('click', () => {
      this.selectedItem.status = el.textContent;
      updateStatusBoxes();
    }));
    
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

  private formatAddress(address: Endereco): object {
    return {
      cidade: address.cidade + ' - ' + address.uf,
      rua: address.rua + ', ' + address.numero + (address.complemento ? ', ' + address.complemento : ''),
      bairro: 'Bairro ' + address.bairro + ', ' + address.cep,
      destinatario: 'Entregar a ' + address.nome_destinatario
    };
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