import { Service, RequestParser } from 'http-service-ts';
import { Pedido, Mensagem } from './models';
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

export const pedidoService = new Service<Pedido>(root.concat('/pedidos'), config);
export const mensagemService = new Service<Mensagem>(root.concat('/mensagens'), config);

export const httpService = new RequestParser(root, config);