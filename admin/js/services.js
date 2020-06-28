"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpService = exports.mensagemService = exports.pedidoService = void 0;
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
exports.httpService = new http_service_ts_1.RequestParser(root, config);
