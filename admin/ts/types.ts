import { Service } from 'http-service-ts';

// Constructors

/**
 * Function constructor
 */
export type Type<T> = { new (...args: any[]): T };

/**
 * Any `Type` that extends or implements `T`
 */
export type ExtendedType<T> = Type<any> & Type<T>;

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
 * Route object configuration
 */
export interface Route {
  path: string;
  view: ExtendedType<View<any>>
};