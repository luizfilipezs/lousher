"use strict";
exports.__esModule = true;
exports.MensagemService = exports.PedidoService = void 0;
var http_service_ts_1 = require("http-service-ts");
var root = 'http://localhost:8000/api';
exports.PedidoService = new http_service_ts_1.Service(root.concat('/pedidos'));
exports.PedidoService.config.headers.append('Authorization', 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMyODc5NzgsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzExNTE3OH0.ywFwUTfC6h00tpv7FSbElubBS3-ImYZXhyfGyi3gPD4');
exports.PedidoService.config.appendSlash = true;
exports.MensagemService = new http_service_ts_1.Service(root.concat('/mensagens'));
