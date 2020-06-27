"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedRouteError = void 0;
class UndefinedRouteError extends Error {
    constructor() {
        super(`"${window.location.pathname}" is not defined in routes`);
        this.name = 'UndefinedRouteError';
    }
}
exports.UndefinedRouteError = UndefinedRouteError;
