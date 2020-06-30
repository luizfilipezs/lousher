import { Service } from 'http-service-ts';

// Constructors

/**
 * Class of `T` type
 */
export type ClassConstructor<T> = { new (...args: any[]): T };

/**
 * Any class that extends or implements `T`
 */
export type ChildClass<T> = ClassConstructor<any> & ClassConstructor<T>;

// View

/**
 * Properties and methods that must be implemented
 * in every single view, where `T` indicates the model
 * that will be handled by the view
 */
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

/**
 * Route object configutarion
 */
export interface Route {
  path: string;
  view: ClassConstructor<View<any>>
};