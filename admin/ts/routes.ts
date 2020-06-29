import { Routes } from './types';
import MessagesView from './messages.view';
import PedidosView from './pedidos.view';

export const appRoutes: Routes = [
  { path: '', view: MessagesView },
  { path: 'pedidos', view: PedidosView }
];