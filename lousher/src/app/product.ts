export interface Product {
  id?: number;
  nome: string;
  preco: number;
  qntd_estoque: number;
  pais: string;
  regiao: string;
  // informações para vinhos
  tipo?: string;
  cor?: string;
  docura?: string;
  classe?: string;
  sabor?: string;
}