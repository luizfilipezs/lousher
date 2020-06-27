(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./exceptions":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedRouteError = void 0;
class UndefinedRouteError extends Error {
    constructor() {
        super(`"${window.location.pathname}" is not defined in routes`);
        this.name = 'UndefinedRouteError';
    }
}
exports.UndefinedRouteError = UndefinedRouteError;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const routes_1 = require("./routes");
new app_1.default(routes_1.appRoutes);

},{"./app":1,"./routes":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
class MessagesView {
    // Add listeners at the DOM
    constructor() {
        this.items = [];
        this.orderBy = 'newer';
        this.iterateOrder = this.orderParameter();
        this.http = services_1.mensagemService;
        this.DOM = {
            listSelector: document.querySelector('.items-list'),
            orderListButton: document.getElementById('order-by'),
            refreshButton: document.getElementById('refresh')
        };
        this._errorMessage = '';
        // Update list order
        this.DOM.orderListButton
            .addEventListener('click', () => {
            this.reorderItems();
            this.DOM.orderListButton.textContent =
                ['Mais recentes', 'Mais antigas', 'Não lidas'][['newer', 'older', 'unread'].indexOf(this.orderBy)];
        });
        // Refresh list
        this.DOM.refreshButton
            .addEventListener('click', () => this.getItems());
    }
    get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(value) {
        this._errorMessage = value;
        this.emitError();
    }
    emitError() {
        // code
    }
    getItems() {
        this.DOM.refreshButton.style.opacity = '0.4';
        this.http.get()
            .then(items => {
            this.items = items;
            this.renderList();
        }, error => this.errorMessage = 'Erro ao tentar obter as mensagens!')
            .finally(() => this.DOM.refreshButton.style.opacity = '1');
    }
    makeRead() {
        this.http.patch({ lido: true }, this.selectedItem.id)
            .then(partial => {
            for (const key in partial)
                this.selectedItem[key] = partial[key];
            // Update status in DOM after updating object in database
            const element = document.getElementById(this.selectedItem.id.toString());
            const statusText = element.querySelector('.item-status');
            if (statusText.classList.contains('unread')) {
                statusText.classList.remove('unread');
                statusText.classList.add('read');
            }
        }, error => this.errorMessage = 'Erro ao atualizar status da mensagem!');
    }
    selectItem(element) {
        // Update selected item
        this.selectedItem = this.items.find(i => i.id === +element.id);
        // Update read status
        if (!this.selectedItem.lido)
            this.makeRead();
        // Recreate list in DOM
        this.renderList();
        this.renderSelectedOne();
    }
    renderList() {
        // Order list
        this.orderItems();
        // Clear list in DOM
        this.DOM.listSelector.innerHTML = '';
        // Check correct 
        const getClasses = (el) => {
            let cls = 'list-item';
            if (this.selectedItem && el.id === this.selectedItem.id)
                cls += ' selected-item';
            return cls;
        };
        // Render list
        this.items.forEach(el => this.DOM.listSelector.innerHTML += `
        <div class="${getClasses(el)}" id="${el.id}">
          <p class="item-description">
            ${el.nome}, em ${el.data_envio}
          </p>
          <p class="item-status ${el.lido ? 'read' : 'unread'}"></p>
        </div>
      `);
        // Update list when an item is selected
        Array.from(this.DOM.listSelector.children).forEach(element => element.addEventListener('click', () => this.selectItem(element)));
    }
    orderItems() {
        // Change array order
        switch (this.orderBy) {
            case 'newer':
                this.items.sort((a, b) => b.id - a.id);
                break;
            case 'older':
                this.items.sort((a, b) => a.id - b.id);
                break;
            case 'unread':
                this.items.sort((a, b) => {
                    if (!a.lido && b.lido)
                        return -1;
                    if (a.lido && !b.lido)
                        return 1;
                    return 0;
                });
        }
    }
    *orderParameter() {
        while (true)
            for (const option of ['older', 'unread', 'newer'])
                yield this.orderBy = option;
    }
    reorderItems() {
        this.iterateOrder.next();
        this.orderItems();
        this.renderList();
    }
    renderSelectedOne() {
        const bindingElements = document.querySelectorAll('[bind]');
        bindingElements.forEach(el => {
            const field = el.getAttribute('bind');
            if (field && this.selectedItem[field])
                el.textContent = this.selectedItem[field];
        });
    }
}
exports.default = MessagesView;

},{"./services":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const messages_view_1 = require("./messages.view");
exports.appRoutes = [
    { path: '/', view: new messages_view_1.default() }
];

},{"./messages.view":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensagemService = exports.pedidoService = void 0;
const http_service_ts_1 = require("http-service-ts");
const test_1 = require("./test");
// Global configurations
const root = 'http://localhost:8000/api';
const config = {
    headers: new Headers({
        Authorization: 'JWT ' + test_1.token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }),
    appendSlash: true
};
// Exports
exports.pedidoService = new http_service_ts_1.Service(root.concat('/pedidos'), config);
exports.mensagemService = new http_service_ts_1.Service(root.concat('/mensagens'), config);

},{"./test":7,"http-service-ts":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
exports.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMzNzYyMjMsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzIwMzQyM30.Mboclam0fyfjowIu72F2zOTw_9tJP-Z1wKXcS63fJg4';

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
exports.Service = service_1.default;
const request_parser_1 = require("./request.parser");
exports.RequestParser = request_parser_1.default;

},{"./request.parser":9,"./service":10}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class
 *
 * Allows to make requests and save some configurations for future
 * requests too. Accepts an API root at the constructor that can be used
 * to fix an URL to fetch. If one be provided, every future request will
 * fetch this URL + the URL passed in `RequestArgs` interface.
 */
class RequestParser {
    /**
     * @param {string} [root] You can provide a value for root property
     * or simply pass one every time you access `request()` method.
     * @param {HttpConfig} [config] Configurations that will be aplied
     * in every request.
     */
    constructor(root, config) {
        this.root = root;
        /**
         * @param {string} start First piece of URL (API root). E.g. `'https://api.example.com'`
         * @param {string} [final] Last piece of URL. E.g. `'users/12'`
         *
         * @return {string} URL with a slash between its first and last pieces or a slash at the end of the first.
         */
        this.hasSlash = (start, end) => end ? start.endsWith('/') || end.startsWith('/') : start.endsWith('/');
        this.config = config || {
            headers: new Headers(),
            appendSlash: false,
        };
    }
    /**
     * @param {RequestArgs<T>} args Provide request configurations
     *
     * @return {Promise<T>} Promise with parsed content
     */
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '';
            // Add root if there's one
            if (this.root)
                url = this.root;
            // Concat root with URI if they were provided
            if (this.root && args.url)
                url += this.hasSlash(this.root, args.url) ? args.url : `/${args.url}`;
            // fetch URL provided in arguments
            if (!this.root && args.url)
                url = args.url;
            // add a slash
            if (this.config.appendSlash && !this.hasSlash(url))
                url += '/';
            // add ID
            if (args.id)
                url += this.config.appendSlash ? `${args.id}/` : args.id.toString();
            // Append search params to the end of URL
            if (args.params) {
                // Remove last slash and add a "?"
                if (url.endsWith('/'))
                    url = url.substring(0, url.length - 1);
                url += '?';
                // Add params and remove last "&"
                for (const key in args.params)
                    url += `${key}=${args.params[key]}&`;
                url = url.substring(0, url.length - 1);
            }
            // Configure request
            const requestInit = {
                method: args.method,
                headers: args.headers || this.config.headers,
                mode: args.noCors === true ? 'no-cors' : 'cors',
            };
            // Add body if there is one
            if (args.method !== 'get' && args.obj)
                requestInit.body = JSON.stringify(args.obj);
            // Request
            const req = yield fetch(url, requestInit);
            // Return promise with parsed content from response
            return this.parse(req);
        });
    }
    /**
     * @param {Response} response Response to turn into JSON, Text or Blob
     *
     * @return {Promise<T | string | null | Blob>} Promise with formatted content
     */
    parse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let p;
            const contentType = response.headers.get('content-type');
            if (contentType === 'application/json')
                // Object
                p = yield response.json();
            else if (contentType && contentType.startsWith('text'))
                // Text
                p = yield response.text();
            else if (!contentType)
                // Null
                p = null;
            // Blob
            else
                p = yield response.blob();
            return new Promise((resolve, reject) => (response.status >= 200 && response.status < 300 ? resolve(p) : reject(p)));
        });
    }
}
exports.default = RequestParser;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_parser_1 = require("./request.parser");
/**
 * @class
 *
 * Customizable service that allow to perform main HTTP requests.
 * Extends `RequestParser` class. So it's possible to add more types of
 * request when extending this class.
 */
class Service extends request_parser_1.default {
    /**
     * @param {string} apiRoot Collection path (e.g. `"https://api.example.com/users/"`)
     */
    constructor(apiRoot, config) {
        super(apiRoot, config);
    }
    /**
     * @return {Promise<T[]>} Promise with array of objets
     */
    get() {
        return this.request({ method: 'get' });
    }
    /**
     * @param {number} id Object ID to fetch
     * @return {Promise<T>} A promise of object
     */
    getById(id) {
        return this.request({ method: 'get', id });
    }
    /**
     * @param {T} obj Object to post
     * @return {Promise<T>} Posted object
     */
    post(obj) {
        return this.request({ method: 'post', obj });
    }
    /**
     * @param {T} obj Object to update
     * @param {number} id ID of object that will be updated
     * @return {Promise<T>} Updated object
     */
    put(obj, id) {
        return this.request({ method: 'put', obj, id });
    }
    /**
     * @param {Partial<T>} obj Object to update
     * @param {number} id ID of object that will be updated
     * @return {Promise<Partial<T>>} Updated object part
     */
    patch(obj, id) {
        return this.request({ method: 'patch', obj, id });
    }
    /**
     * @param {number} id ID of object that will be deleted
     * @return {Promise<null>} Null
     */
    delete(id) {
        return this.request({ method: 'delete', id });
    }
}
exports.default = Service;

},{"./request.parser":9}]},{},[3]);
