/**
 * Error throwed when current route is not defined in
 * app routes
 */
export class UndefinedRouteError extends Error {
  name = 'UndefinedRouteError';
  
  constructor() {
    super(`"${window.location.pathname}" is not defined in routes`);
  }
}