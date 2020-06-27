"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions = require("./exceptions");
class App {
    /**
     * @param routes {Routes} Application routes
     * @param autoInit {boolean} If `true`, app will initialize automatically
     */
    constructor(routes, autoInit = true) {
        this.routes = routes;
        if (autoInit)
            document.addEventListener('DOMContentLoaded', () => this.init());
    }
    /**
     * If object was initialized with auto init set to `true`,
     * `init()` will be called after DOM content get loaded.
     */
    init() {
        this.defineView();
        this.view.getItems();
    }
    /**
     * Apply view based in the current route
     */
    defineView() {
        const currentRoute = window.location.pathname;
        const proper = this.routes.find(r => r.path === currentRoute);
        if (proper)
            this.view = proper.view;
        else
            throw new Exceptions.UndefinedRouteError();
    }
}
exports.default = App;
