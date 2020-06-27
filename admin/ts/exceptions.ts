export class UndefinedRouteError extends Error {
  name = 'UndefinedRouteError';
  
  constructor() {
    super(`"${window.location.pathname}" is not defined in routes`);
  }
}