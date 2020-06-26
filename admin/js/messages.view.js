"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
class MessagesView {
    // Add listeners at the DOM
    constructor() {
        this.items = [];
        this.orderBy = 'newer';
        this.iterateOrder = this.orderParameter();
        this.http = services_1.mensagemService;
        this.DOM = {
            listSelector: document.querySelector('.items-list'),
            orderListButton: document.getElementById('order-by'),
            refreshButton: document.getElementById('refresh')
        };
        this._errorMessage = '';
        // Update list order
        this.DOM.orderListButton
            .addEventListener('click', () => {
            this.reorderItems();
            this.DOM.orderListButton.textContent =
                ['Mais recentes', 'Mais antigas', 'Não lidas'][['newer', 'older', 'unread'].indexOf(this.orderBy)];
        });
        // Refresh list
        this.DOM.refreshButton
            .addEventListener('click', () => this.getItems());
    }
    get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(value) {
        this._errorMessage = value;
        this.emitError();
    }
    emitError() {
        // code
    }
    getItems() {
        this.DOM.refreshButton.style.opacity = '0.4';
        this.http.get()
            .then(items => {
            this.items = items;
            this.renderList();
        }, error => this.errorMessage = 'Erro ao tentar obter as mensagens!')
            .finally(() => this.DOM.refreshButton.style.opacity = '1');
    }
    makeRead() {
        this.http.patch({ lido: true }, this.selectedItem.id)
            .then(partial => {
            for (const key in partial)
                this.selectedItem[key] = partial[key];
            // Update status in DOM after updating object in database
            const element = document.getElementById(this.selectedItem.id.toString());
            const statusText = element.querySelector('.item-status');
            if (statusText.classList.contains('unread')) {
                statusText.classList.remove('unread');
                statusText.classList.add('read');
            }
        }, error => this.errorMessage = 'Erro ao atualizar status da mensagem!');
    }
    selectItem(element) {
        // Update selected item
        this.selectedItem = this.items.find(i => i.id === +element.id);
        // Update read status
        if (!this.selectedItem.lido)
            this.makeRead();
        // Recreate list in DOM
        this.renderList();
    }
    renderList() {
        // Order list
        this.orderItems();
        // Clear list in DOM
        this.DOM.listSelector.innerHTML = '';
        // Check correct 
        const getClasses = (el) => {
            let cls = 'list-item';
            if (this.selectedItem && el.id === this.selectedItem.id)
                cls += ' selected-item';
            return cls;
        };
        // Render list
        this.items.forEach(el => this.DOM.listSelector.innerHTML += `
        <div class="${getClasses(el)}" id="${el.id}">
          <p class="item-description">
            ${el.nome}, em ${el.data_envio}
          </p>
          <p class="item-status ${el.lido ? 'read' : 'unread'}"></p>
        </div>
      `);
        // Update list when an item is selected
        Array.from(this.DOM.listSelector.children).forEach(element => element.addEventListener('click', () => this.selectItem(element)));
    }
    orderItems() {
        // Change array order
        switch (this.orderBy) {
            case 'newer':
                this.items.sort((a, b) => b.id - a.id);
                break;
            case 'older':
                this.items.sort((a, b) => a.id - b.id);
                break;
            case 'unread':
                this.items.sort((a, b) => {
                    if (!a.lido && b.lido)
                        return -1;
                    if (a.lido && !b.lido)
                        return 1;
                    return 0;
                });
        }
    }
    *orderParameter() {
        while (true)
            for (const option of ['older', 'unread', 'newer'])
                yield this.orderBy = option;
    }
    reorderItems() {
        this.iterateOrder.next();
        this.orderItems();
        this.renderList();
    }
}
exports.default = MessagesView;
