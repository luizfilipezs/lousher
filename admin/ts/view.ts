import { Service } from 'http-service-ts';

export default interface View<T> {
  items: T[];
  selectedItem: T;
  http: Service<T>;
  getItems(): void;
  orderItems(): void;
  renderList(): void;
}