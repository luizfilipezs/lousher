import MessagesView from './messages.view';
import View from './view';
import { Mensagem, Pedido } from './models';

class App {
  view: View<Mensagem | Pedido>;

  constructor(autoInit: boolean = true) {
    if (!autoInit)
      document.addEventListener('DOMContentLoaded', () => this.init());
  }

  /**
   * If object was initialized with auto init set to `true`,
   * `init()` will be called after DOM content get loaded.
   */
  init(): void {
    this.defineView();
  }

  private defineView(): void {
    switch(window.location.pathname) {
      case '/':
        this.view = new MessagesView();
        break;
      case '/pedidos':
        //this.view = new PedidosView();
    }
  }
}

new App();