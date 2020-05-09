import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CartProduct } from './cart.product';
import { cartItems } from './test';
import { ToggleView } from './toggle.view';

@Injectable()
export class CartService extends ToggleView {

  private _items: CartProduct[] = [];
  public totalPrice = 0;

  private apiRoot = 'http://localhost:8000/api/';

  httpOptions = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
    super();
  }

  // AUTH

  setAuth(token: string) {
    this.httpOptions.headers.append('Authorization', 'JWT '.concat(token));
  }

  // GET/SET ITEMS

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
    this.totalPrice = 0;
    value.forEach(item => this.totalPrice += (item.produto.oferta ? item.produto.oferta.preco_oferta : item.produto.preco) * item.qntd);
  }

  // HTTP METHODS

  getItems() {
    of(cartItems).subscribe((items) => this.items = items);
  }

  addItem(id: number, quantity: number): Observable<CartProduct> {
    return;
    /*        method id  qntd
      api/cart/add/314134/1
    */
  }

  removeItem(id: number, quantity: number): void {
    this.http.delete(this.apiRoot.concat(`cart/${id}`), this.httpOptions)
      .subscribe(this.getItems);
  }
}
