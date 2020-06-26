import { Mensagem } from './models';
import { mensagemService } from './services';
import { Service } from 'http-service-ts';
import View, { OrderParam } from './view';

export default class MessagesView implements View<Mensagem> {
  items: Mensagem[] = [];
  http: Service<Mensagem> = mensagemService;

  orderBy: OrderParam = 'newer';

  private _errorMessage: string = '';

  constructor() { }

  *changeOrderParam() {
    while (true)
      for (const param of ['newer', 'older', 'unread'] as OrderParam[])
        yield this.orderBy = param;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(value) {
    this._errorMessage = value;
  }

  getItems(): void {
    this.http.get()
      .then(
        messages => {
          this.items = messages;
          this.renderList();
        },
        error => this.errorMessage = error
      );
  }

  renderList(): void {
    // code
  }

  orderItems(): void {
    // Update current list order parameter
    this.changeOrderParam().next();

    // code

    // Finalize rendering list
    this.renderList();
  }

}