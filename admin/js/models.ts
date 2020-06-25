interface User {
  id: number;
}

interface Endereco {
  id: number;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  cep: string;
  bairro: string;
  complemento: string;
  nome_destinatario: string;
  telefone: string;
}

export interface Pedido {
  id: number;
  usuario: User;
  endereco: Endereco;
  status: string;
  observacoes: string;
  data_pedido: string;
}

export interface Mensagem {
  id: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  data_envio: string;
  lido: boolean;
}