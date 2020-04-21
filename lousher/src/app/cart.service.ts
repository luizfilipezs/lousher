import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CartProduct } from './cart.product';
import { cartItems } from './test';
import { ToggleView } from './toggle.view';


@Injectable()
export class CartService extends ToggleView {

  private _items: Array<CartProduct> = [];
  public totalPrice = 0;

  constructor() {
    super();
  }

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
    this.totalPrice = 0;
    value.forEach(item => this.totalPrice += item.price * item.quantity);
  }

  getItems(): void {
    of(cartItems).subscribe((items) => this.items = items);
  }

  addItem(id: number, quantity: number): void {
    /*        method id  qntd
      api/cart/add/314134/1
    */
  }

  removeItem(id: number, quantity: number): void {
    /*         method   id  qntd
      api/cart/remove/314134/1
    */
  }
}
