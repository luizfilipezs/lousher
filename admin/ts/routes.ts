import View from './view';
import MessagesView from './messages.view';
import PedidosView from './pedidos.view';

interface Route {
  path: string;
  view: View<{}>;
}

type Routes = Route[];
export default Routes;

export const appRoutes: Routes = [
  { path: '', view: new MessagesView() },
  { path: 'pedidos', view: new PedidosView() }
];