import { Product } from './product';

export class CartProduct {
  id?: number;
  usuario?: number; // id usuário
  produto: Product;
  qntd: number;
}