(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./messages.view":2}],2:[function(require,module,exports){
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

},{"./services":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensagemService = exports.pedidoService = void 0;
const http_service_ts_1 = require("http-service-ts");
// Global configurations
const root = 'http://localhost:8000/api';
const config = {
    headers: new Headers({
        Authotization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMyODc5NzgsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzExNTE3OH0.ywFwUTfC6h00tpv7FSbElubBS3-ImYZXhyfGyi3gPD4'
    }),
    appendSlash: true
};
// Exports
exports.pedidoService = new http_service_ts_1.Service(root + '/pedidos', config);
exports.mensagemService = new http_service_ts_1.Service(root + '/mensagens', config);

},{"http-service-ts":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
exports.Service = service_1.default;
const request_parser_1 = require("./request.parser");
exports.RequestParser = request_parser_1.default;

},{"./request.parser":5,"./service":6}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./request.parser":5}]},{},[1]);
