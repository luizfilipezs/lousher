import { Service } from 'http-service-ts';

// Constructors

export type ClassConstructor<T> = { new (...args: any[]): T };
export type ChildClass<T> = ClassConstructor<any> & ClassConstructor<T>;

// View

export interface View<T> {
  items: T[];
  selectedItem: T;
  http: Service<T>;
  DOM: { [key: string]: HTMLElement };
  addListeners(): void;
  getItems(): void;
  orderItems(): void;
  renderList(): void;
};

// Routing

interface Route {
  path: string;
  view: ClassConstructor<View<any>>
}

export type Routes = Route[];