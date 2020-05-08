import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order, OrderItem } from './order';
import { OrderStatus } from './types';

const httpOptions = {
  headers: new HttpHeaders({
    'Authotization': 'JWT'
  })
}

@Injectable()
export class OrderService {

  private root = {
    api: 'http://localhost:8000/api',
    orders: `${this.root.api}/pedidos`,
    orderItems: `${this.root.api}/itensPedidos`,
    order: (id: number) => `${this.root.orders}/${id}`,
    item: (id: number) => `${this.root.orderItems}/${id}`
  }

  constructor(private http: HttpClient) { }

  /* ORDER */

  get() {
    return this.http.get<Order[]>(this.root.orders, httpOptions);
  }

  getById(id: number) {
    return this.http.get<Order>(this.root.order(id), httpOptions);
  }

  post(order: Order) {
    return this.http.post<Order>(this.root.orders, httpOptions);
  }

  /* ORDER ITEM */

  getOrderItems() {
    return this.http.get<OrderItem[]>(this.root.orderItems, httpOptions);
  }

  postOrderItem() {
    return this.http.post<OrderItem>(this.root.orderItems, httpOptions)
  }

  /* FORMATING */

  formatOrders(orders: Order[], items: OrderItem[]): OrderInfo[] {
    let info: OrderInfo[] = [];

    for (const order of orders) {
      let description = '';

      // Format description with list of items and their quantities

      items.forEach(element => {
        // Item from current order
        if (element.pedido == order.id)
          description += `${element.product.nome} (${element.qntd} unidades), `;
      });

      // Remove last comma and white space

      if (description.endsWith(', '))
        description = description.substring(0, description.length - 2);

      // Format addres as string

      let { rua, numero, cep, cidade, uf, complemento } = order.endereco;
      complemento = complemento ? `(${complemento})` : '';

      const address = `${rua}, ${numero} ${complemento} ${cep} - ${cidade} / ${uf}`;

      // Insert order info into array that will be returned
      
      info.push({
        description,
        receiverName: order.endereco.nome_destinatario,
        receiverAddress: address,
        id: order.id,
        status: order.status
      })

    }

    return info;
  }

}

export interface OrderInfo {
  description: string;
  receiverName: string;
  receiverAddress: string;
  id: number;
  status: OrderStatus;
}
