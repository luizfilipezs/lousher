import { Endereco } from './endereco';
import { Product } from './product';
import { OrderStatus } from './types';

export interface OrderItem {
  id?: number;
  pedido: number; // order.id
  product: Product;
  qntd: number;
}

export interface Order {
  id?: number;
  usuario: number;
  endereco: Endereco;
  status: OrderStatus;
  observacoes: string;
}