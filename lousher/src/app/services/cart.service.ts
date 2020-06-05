import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToggleView } from '../toggle.view';
import { CartItem } from '../cart.item';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable()
export class CartService extends ToggleView {

  private _items: CartItem[] = [];
  public totalPrice = 0;

  /**
   * Observe changes made in cart list
   */
  private changes = new Subject<CartItem[]>();
  public changes$ = this.changes.asObservable();

  private apiRoot = 'http://localhost:8000/api/carrinho/';

  /**
   * Provide headers for all requests
   */
  httpOptions = {
    headers: new HttpHeaders()
  }

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Set authorization header
   * @param token JWT Token
   */
  setAuth(token: string) {
    this.httpOptions.headers.append('Authorization', 'JWT '.concat(token));
  }

  
  /**
   * `items` getter
   */
  get items() {
    return this._items;
  }

  /**
   * `items` setter. Update total price of cart
   */
  set items(value) {
    this._items = value;
    this.totalPrice = 0;

    // Define total price of cart
    value.forEach(item =>
      this.totalPrice += (item.produto.oferta ? item.produto.preco_oferta : item.produto.preco) * item.qntd);
  }

  /**
   * Clear `items` when logging out
   */
  clearLocal() {
    this.items = [];
  }

  /**
   * Get updated list of items in user cart from server and set
   * it in the `items` property
   */
  getItems() {
    this.http.get<CartItem[]>(this.apiRoot, this.httpOptions)
      .subscribe((items) => {
        this.items = items;
        this.changes.next(items);
      });
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
        finalize(() => {
          if (!this.toggleVal) this.toggleView();
        })
      )
      .subscribe((success) => this.getItems());
  }

  /**
   * If product is in cart return its `ItemCart`.
   * Else return not found error.
   * @param productId ID of product that will be checked
   */
  checkItem(productId: number) {
    const url = this.apiRoot + 'produto/' + productId + '/';
    return this.http.get<CartItem>(url, this.httpOptions);
  }
  
}
