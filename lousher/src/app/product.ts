export interface Offer {
  id: number;
  preco_oferta: number;
  vencimento: string;
}

export interface Product {
  id?: number;
  nome: string;
  preco: number;
  qntd_estoque: number;
  pais: string;
  regiao: string;
  oferta?: Offer;
  // informações para vinhos
  tipo?: string;
  cor?: string;
  docura?: string;
  classe?: string;
  sabor?: string;
}