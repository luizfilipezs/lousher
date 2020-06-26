"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
class MessagesView {
    constructor() {
        this.items = [];
        this.http = services_1.mensagemService;
        this.orderBy = 'newer';
        this._errorMessage = '';
    }
    *changeOrderParam() {
        while (true)
            for (const param of ['newer', 'older', 'unread'])
                yield this.orderBy = param;
    }
    get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(value) {
        this._errorMessage = value;
    }
    getItems() {
        this.http.get()
            .then(messages => {
            this.items = messages;
            this.renderList();
        }, error => this.errorMessage = error);
    }
    renderList() {
        // code
    }
    orderItems() {
        // Update current list order parameter
        this.changeOrderParam().next();
        // code
        // Finalize rendering list
        this.renderList();
    }
}
exports.default = MessagesView;
