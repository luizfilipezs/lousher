import { Service } from 'http-service-ts';

export type OrderParam = 'newer' | 'older' | 'unread';

export default interface View<T> {
  items: T[];
  http: Service<T>;
  getItems(): void;
  orderItems(): void;
  renderList(): void;
}