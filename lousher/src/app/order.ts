import { Endereco } from './endereco';
import { Product } from './product';
import { OrderStatus } from './types';

export interface OrderItem {
  id?: number;
  pedido: number;
  produto?: Product;
  produto_id?: number;
  qntd: number;
}

export interface Order {
  id?: number;
  usuario?: number;
  endereco?: Endereco;
  endereco_id?: number;
  status?: OrderStatus;
  observacoes?: string;
}