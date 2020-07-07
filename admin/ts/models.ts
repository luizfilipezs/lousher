/**
 * Default type for model's ID
 */
type id = number;

export interface Endereco {
  id: id;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  cep: string;
  bairro: string;
  complemento: string;
  nome_destinatario: string;
  telefone: string;
};

export interface Grupo {
  id: number;
  descricao: string;
  pais: string;
  regiao: string;
  mililitros: number;
  vol_alcoolico: number;
  tipo?: string;
  cor?: string;
  docura?: string;
  classe?: string;
  sabor?: string;
}

export interface Oferta {
  id: number;
  porcentagem: number;
  vencimento: string;
};

export interface Produto {
  id: number;
  grupo: Grupo;
  nome: string;
  preco: number;
  ano: number;
  qntd_estoque: number;
  qntd_disponivel: number;
  oferta?: Oferta;
  preco_oferta?: number;
};

export interface Pedido {
  id: id;
  usuario: id;
  endereco: Endereco;
  status: string;
  observacoes: string;
  data_pedido: string;
};

export interface ItemPedido {
  id: id;
  pedido: id;
  produto: Produto;
  qntd: number;
};

export interface Mensagem {
  id: id;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  data_envio: string;
  lido: boolean;
};