import { Product } from './product';

export class CartItem {
  id?: number;
  usuario_id: number;
  product: Product | number; // Product when receiving from server and number when sending ID
  qntd: number;
};