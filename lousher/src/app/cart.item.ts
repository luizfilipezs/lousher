import { Product } from './product';

export class CartItem {
  id?: number;
  usuario: number;
  produto: Product; // Product when receiving from server and number when sending ID
  qntd: number;
};