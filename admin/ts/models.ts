/**
 * Default type for model's ID
 */
type id = number;

interface Endereco {
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

export interface Pedido {
  id: id;
  usuario: id;
  endereco: Endereco;
  status: string;
  observacoes: string;
  data_pedido: string;
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