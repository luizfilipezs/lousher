import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToggleView } from './toggle.view';
import { CartItem } from './cart.item';
import { Product } from './product';
import { finalize } from 'rxjs/operators';

@Injectable()
export class CartService extends ToggleView {

  private _items: CartItem[] = [];
  public totalPrice = 0;

  private apiRoot = 'http://localhost:8000/api/carrinho/';

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

    // Define total price of cart
    value.forEach(item =>
      this.totalPrice += (item.produto.oferta ? item.produto.oferta.preco_oferta : item.produto.preco) * item.qntd);
  }

  /**
   * Get updated list of items in user cart from server and set
   * it in the `items` property
   */
  getItems() {
    return this.http.get<CartItem[]>(this.apiRoot, this.httpOptions)
      .subscribe((items) => this.items = items);
  }

  /**
   * Set quantity of a product in cart and toggle cart component when
   * server respond with success or error
   * @param productId ID of product that will be added or removed
   * @param quantity New quantity of product in cart
   */
  setItem(productId: number, quantity: number) {
    const url = `produto/${productId}/qntd/${quantity}/`;

    this.http.post(this.apiRoot.concat(url), this.httpOptions)
      .pipe(
        finalize(() => this.toggleView())
      )
      .subscribe((success) => this.getItems());
  }
  
}
