import { Service, RequestParser } from 'http-service-ts';
import { Pedido, Mensagem, ItemPedido } from './models';
import { Cookies } from './utils';

// Global configurations

const root = '/api/';
const config = {
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  }),
  appendSlash: true
};

// Customizations

class PedidoService extends Service<Pedido> {
  constructor() {
    super(root.concat('pedidos'), config);
  }

  getItems(id: number) {
    return this.request<ItemPedido[]>({ url: id + '/itens', method: 'get' });
  }
}

// Exports

export const pedidoService = new PedidoService();
export const mensagemService = new Service<Mensagem>(root.concat('mensagens'), config);

export const httpService = new RequestParser(root, config);