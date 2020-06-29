import { View, Routes } from './types';
import { UndefinedRouteError } from './exceptions';

export default class App {
  /**
   * View that will be used to render proper content
   */
  private view: View<any>;

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
      this.view = new proper.view();
    else
      throw new UndefinedRouteError();
  }
}
