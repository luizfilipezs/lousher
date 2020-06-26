"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensagemService = exports.pedidoService = void 0;
const http_service_ts_1 = require("http-service-ts");
// Global configurations
const root = 'http://localhost:8000/api';
const config = {
    headers: new Headers({
        Authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMzNzYyMjMsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzIwMzQyM30.Mboclam0fyfjowIu72F2zOTw_9tJP-Z1wKXcS63fJg4',
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }),
    appendSlash: true
};
// Exports
exports.pedidoService = new http_service_ts_1.Service(root + '/pedidos', config);
exports.mensagemService = new http_service_ts_1.Service(root + '/mensagens', config);
