import { Endereco } from './endereco';
import { Product } from './product';

export interface OrderItem {
  id?: number;
  pedido: number;
  produto?: Product;
  produto_id?: number;
  qntd: number;
}

export class Order {
  id?: number;
  usuario?: number;
  endereco?: Endereco;
  endereco_id?: number;
  status?: string;
  observacoes = '';
}