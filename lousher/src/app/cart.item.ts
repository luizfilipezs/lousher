import { Product } from './product';

export interface CartItem {
  id?: number;
  usuario: number;
  produto: Product;
  qntd: number;
}