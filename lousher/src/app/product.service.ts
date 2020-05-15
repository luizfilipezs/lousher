import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';

@Injectable()
export class ProductService {

  private apiRoot = 'http://localhost:8000/api/produtos';

  constructor(private http: HttpClient) { }

  /**
   * Returns all available items from server
   */
  get() {
    return this.http.get<Product[]>(this.apiRoot);
  }

  /**
   * Returns specific item from server, by its ID
   * @param {number} id ID of item that will be returned as Observable
   */
  getById(id: number) {
    return this.http.get<Product>(`${this.apiRoot}/${id}`);
  }

  /**
   * Returns all available offers from server
   */
  getOffers() {
    return this.http.get<Product[]>(this.apiRoot.concat('/ofertas'));
  }

  /**
   * Returns all available products of a specific type (e.g. merlot, cabernet_suavignon)
   * @param {string} type Wine type of products that must be returned
   */
  getByType(type: string) {
    return this.http.get<Product[]>(this.apiRoot + `/tipo/${type}`);
  }

}
