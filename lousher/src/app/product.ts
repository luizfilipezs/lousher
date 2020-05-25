import { Grupo } from './grupo';

export interface Offer {
  id: number;
  porcentagem: number;
  vencimento: string;
}

export interface Product {
  id: number;
  grupo: Grupo;
  nome: string;
  preco: number;
  ano: number;
  qntd_estoque: number;
  qntd_disponivel: number;
  oferta?: Offer;
  preco_oferta?: number;
}