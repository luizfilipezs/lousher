import { Service } from "http-service-ts";
import { Pedido, Mensagem } from "./models";

// Global configurations

const root = 'http://localhost:8000/api';
const config = {
  headers: new Headers({
    Authotization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1aXoiLCJleHAiOjE1OTMyODc5NzgsImVtYWlsIjoiZmlsaXBlbHVpei5ic0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU5MzExNTE3OH0.ywFwUTfC6h00tpv7FSbElubBS3-ImYZXhyfGyi3gPD4'
  }),
  appendSlash: true
};

// Exports

export const pedidoService = new Service<Pedido>(root.concat('/pedidos'), config);
export const mensagemService = new Service<Mensagem>(root.concat('/mensagens'), config);