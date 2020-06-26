import MessagesView from './messages.view';
import View from './view';

class App {
  /**
   * View that will be used to render proper content
   */
  view: View<{}>;

  /**
   * Define if app will initialize automatically when DOM get loaded
   * @param autoInit {boolean} If `true`, app will initialize automatically
   */
  constructor(autoInit: boolean = true) {
    if (autoInit)
      document.addEventListener('DOMContentLoaded', () => this.init());
  }

  /**
   * If object was initialized with auto init set to `true`,
   * `init()` will be called after DOM content get loaded.
   */
  init(): void {
    this.defineView();
    this.view.getItems();
  }

  /**
   * Choose view based in the current route
   */
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