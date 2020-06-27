"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exceptions {
}
exports.default = Exceptions;
Exceptions.UndefinedRoute = new Error(`Route not defined: "${window.location.pathname}"`);
