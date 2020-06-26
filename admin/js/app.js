"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_view_1 = require("./messages.view");
class App {
    constructor(autoInit = true) {
        if (!autoInit)
            document.addEventListener('DOMContentLoaded', () => this.init());
    }
    /**
     * If object was initialized with auto init set to `true`,
     * `init()` will be called after DOM content get loaded.
     */
    init() {
        this.defineView();
    }
    defineView() {
        switch (window.location.pathname) {
            case '/':
                this.view = new messages_view_1.default();
                break;
            case '/pedidos':
            //this.view = new PedidosView();
        }
    }
}
new App();
