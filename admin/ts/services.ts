import { Service, RequestParser } from 'http-service-ts';
import { Pedido, Mensagem, ItemPedido } from './models';
import { token } from './test';

// Global configurations

const root = 'http://localhost:8000/api';
const config = {
  headers: new Headers({
    Authorization: 'JWT ' + token,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }),
  appendSlash: true
};

// Exports

class PedidoService extends Service<Pedido> {
  constructor() {
    super(root.concat('/pedidos'), config);
  }

  getItems(id: number) {
    return this.request<ItemPedido[]>({ url: id + '/itens', method: 'get' });
  }
}

export const pedidoService = new PedidoService();
export const mensagemService = new Service<Mensagem>(root.concat('/mensagens'), config);

export const httpService = new RequestParser(root, config);