import View from './view';
import MessagesView from './messages.view';

interface Route {
  path: string;
  view: View<{}>;
}

type Routes = Route[];

export const appRoutes: Routes = [
  { path: '/', view: new MessagesView() }
];

export default Routes;