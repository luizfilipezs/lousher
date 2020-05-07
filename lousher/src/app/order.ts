import { Endereco } from './endereco';
import { Product } from './product';
import { OrderStatus } from './types';

interface OrderItem {
  product: Product;
  qntd: number;
};

export interface Order {
  id: number;
  description: string;
  address: Endereco;
  items: OrderItem[];
  status: OrderStatus;
};