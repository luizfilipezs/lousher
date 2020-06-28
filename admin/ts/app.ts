import View from './view';
import Routes from './routes';
import * as Exceptions from './exceptions';

export default class App {
  /**
   * View that will be used to render proper content
   */
  private view: View<{}>;

  /**
   * @param routes {Routes} Application routes
   * @param autoInit {boolean} If `true`, app will initialize automatically
   */
  constructor(private routes: Routes, autoInit: boolean = true) {
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
   * Apply view based in the current route
   */
  private defineView(): void {
    const currentRoute = window.location.pathname;
    const proper = this.routes.find(r => '/' + r.path === currentRoute);

    if (proper) 
      this.view = proper.view;
    else
      throw new Exceptions.UndefinedRouteError();
  }
}
