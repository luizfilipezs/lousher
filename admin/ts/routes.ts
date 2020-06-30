import { Route } from './types';
import MessagesView from './messages.view';
import PedidosView from './pedidos.view';

export const appRoutes: Route[] = [
  { path: 'mensagens', view: MessagesView },
  { path: 'pedidos', view: PedidosView }
];