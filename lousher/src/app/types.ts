export type callbackFunction = (...args: any[]) => void;

export type OrderStatus = (
  'processando pag.' |
  'preparando envio' |
  'despachado' |
  'cancelado' |
  'suspenso' |
  'entregue'
);