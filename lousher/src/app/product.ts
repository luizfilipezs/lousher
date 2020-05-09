export interface Offer {
  id: number;
  descricao: string;
  preco_oferta: number;
  vencimento: string;
}

export interface Product {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  qntd_estoque: number;
  pais: string;
  regiao: string;
  oferta?: Offer;
  ano: number;
  mililitros: number;
  // informações para vinhos
  tipo?: string;
  cor?: string;
  docura?: string;
  classe?: string;
  sabor?: string;
}