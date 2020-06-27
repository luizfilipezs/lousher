export default class Exceptions {
  public static UndefinedRoute = new Error(`Route not defined: "${window.location.pathname}"`);
}