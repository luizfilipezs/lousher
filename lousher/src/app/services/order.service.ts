import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order, OrderItem } from '../order';
import { APIRoot } from '../api.root';

class ServiceRoot {
  orders = APIRoot.api.concat('pedidos/');
  orderItems = APIRoot.api.concat('itensPedidos/');
  order = (id: number) => this.orders + id;
  item = (id: number) => this.orderItems + id;
}

@Injectable()
export class OrderService {

  private root = new ServiceRoot();

  httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(private http: HttpClient) { }

  setAuth(token: string) {
    this.httpOptions.headers.append('Authorization', 'JWT '.concat(token));
  }

  /* ORDER */

  get() {
    return this.http.get<Order[]>(this.root.orders, this.httpOptions);
  }

  getById(id: number) {
    return this.http.get<Order>(this.root.order(id), this.httpOptions);
  }

  post(order: Order) {
    return this.http.post<Order>(this.root.orders, order, this.httpOptions);
  }

  /* ORDER ITEM */

  getOrderItems() {
    return this.http.get<OrderItem[]>(this.root.orderItems, this.httpOptions);
  }

  postOrderItem(orderItem: OrderItem) {
    return this.http.post<OrderItem>(this.root.orderItems, orderItem, this.httpOptions);
  }

  /* FORMATING */

  formatOrders(orders: Order[], items: OrderItem[]) {
    let info: OrderInfo[] = [];

    for (const order of orders) {
      let description = '';

      // Format description with list of items and their quantities

      items.forEach(element => {
        // Item from current order
        if (element.pedido == order.id)
          description += `${element.produto.nome} (${element.qntd} unidades), `;
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
      });

    }

    return info;
  }

}

export interface OrderInfo {
  description: string;
  receiverName: string;
  receiverAddress: string;
  id: number;
  status: string;
}
