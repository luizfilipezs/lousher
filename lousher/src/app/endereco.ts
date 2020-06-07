export interface Endereco {
  id?: number;
  uf: string;
  cidade: string;
  rua: string;
  numero: number;
  cep: string;
  bairro?: string;
  complemento?: string;
  nome_destinatario: string;
  telefone: string;
}