import { View } from './types';
import { Mensagem } from './models';
import { mensagemService, httpService } from './services';

type OrderParam = 'newer' | 'older' | 'unread';

export default class MessagesView implements View<Mensagem> {

  selectedItem: Mensagem;
  items: Mensagem[] = [];
  orderBy: OrderParam = 'newer';

  iterateOrder = this.orderParameter();

  http = mensagemService;

  DOM: { [key: string]: HTMLElement } = {
    listSelector: document.querySelector('.items-list'),
    orderListButton: document.getElementById('order-by'),
    refreshButton: document.getElementById('refresh'),
    sendEmailButton: document.getElementById('send-mail'),
    responseMessage: document.getElementById('response-text'),
    errorMessageMask: document.getElementById('mask')
  };

  // Add listeners at the DOM
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

    // Send mail
    this.DOM.sendEmailButton
      .addEventListener('click', () => this.sendEmail());
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
        error => this.emitError('Erro ao tentar obter as mensagens!')
      )
      .finally(() => this.DOM.refreshButton.style.opacity = '1');
  }

  makeRead(): void {
    this.http.patch({ lido: true }, this.selectedItem.id)
      .then(
        partial => {
          // Update local item
          for (const key in partial)
            this.selectedItem[key] = partial[key];

          // Update status in DOM after updating object in database
          const element = document.getElementById(this.selectedItem.id.toString()),
                statusText = element.querySelector('.item-status');
            
          if (statusText.classList.contains('unread')) {
            statusText.classList.remove('unread');
            statusText.classList.add('read');
          }
        },
        error => this.emitError('Erro ao tentar atualizar status da mensagem!')
      );
  }

  selectItem(element: Element): void {
    // Update selected item
    this.selectedItem = this.items.find(i => i.id === +element.id);
    // Update read status
    if (!this.selectedItem.lido)
      this.makeRead();

    // Recreate list in DOM
    this.renderList();
    this.renderSelectedOne();
  }

  renderList(): void {
    // Order list
    this.orderItems();

    // Clear list in DOM
    this.DOM.listSelector.innerHTML = '';

    // Check correct 
    const getClasses = (el: Mensagem) => {
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
            ${el.nome}, em ${el.data_envio}
          </p>
          <p class="item-status ${el.lido ? 'read' : 'unread'}"></p>
        </div>
      `
    );
    
    // Update list when an item is selected
    [...this.DOM.listSelector.children].forEach(el =>
      el.addEventListener('click', () => this.selectItem(el)));
  }

  orderItems(): void {
    // Change array order
    switch(this.orderBy) {
      case 'newer':
        this.items.sort((a, b) => b.id - a.id);
        break;

      case 'older':
        this.items.sort((a, b) => a.id - b.id);
        break;

      case 'unread':
        this.items.sort((a, b) => {
          if (!a.lido && b.lido) return -1;
          if (a.lido && !b.lido) return 1;
          return 0;
        });
    }
  }

  private *orderParameter() {
    while (true)
      for (const option of ['older', 'unread', 'newer'] as OrderParam[])
        yield this.orderBy = option;
  }

  reorderItems(): void {
    this.iterateOrder.next();
    this.orderItems();
    this.renderList();
  }

  renderSelectedOne(): void {
    const bindingElements = document.querySelectorAll('[bind]');

    // Render message
    bindingElements.forEach(
      el => {
        const field = el.getAttribute('bind');
        
        if (field && this.selectedItem[field])
          el.textContent = this.selectedItem[field];
      }
    );

    const hiddenElements = document.querySelectorAll('[invisibleUntil]') as NodeListOf<HTMLElement>;
    
    // Enable hidden elements
    hiddenElements.forEach(
      el => {
        const condition = el.getAttribute('invisibleUntil');

        if (condition === 'open-content')
          el.style.visibility = 'visible';
      }
    );

    // Clear textarea
    (this.DOM.responseMessage as HTMLTextAreaElement).value = '';
  }

  sendEmail(): void {
    const textInput = this.DOM.responseMessage as HTMLTextAreaElement;
    const minLength = +textInput.getAttribute('minlength');

    if (textInput.value.length >= minLength) {
      const originalButtonText = this.DOM.sendEmailButton.innerHTML;
      this.DOM.sendEmailButton.innerHTML = 'Processando...';

      // Send request
      httpService.request({
        url: 'email/resposta/',
        method: 'post',
        obj: {
          mensagem_id: this.selectedItem.id,
          resposta: textInput.value
        }
      })
        .then(
          (success) => {
            this.emitError('Resposta enviada com sucesso!');
            textInput.value = '';
          },
          (error) => this.emitError('Falha ao enviar o email. Tente novamente mais tarde.')
        )
        .finally(() => this.DOM.sendEmailButton.innerHTML = originalButtonText)
    }
    else this.emitError('Verifique se a mensagem contém pelo menos 50 caracteres.');
  }

}