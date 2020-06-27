"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const messages_view_1 = require("./messages.view");
exports.appRoutes = [
    { path: '/', view: new messages_view_1.default() }
];
