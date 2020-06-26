import { Service } from 'http-service-ts';
import { Pedido, Mensagem } from './models';

// Global configurations

const root = 'http://localhost:8000/api';
const config = {
  headers: new Headers({
    Authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMzNzYyMjMsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzIwMzQyM30.Mboclam0fyfjowIu72F2zOTw_9tJP-Z1wKXcS63fJg4',
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }),
  appendSlash: true
};

// Exports

export const pedidoService = new Service<Pedido>(root + '/pedidos', config);
export const mensagemService = new Service<Mensagem>(root + '/mensagens', config);