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
