"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class PostNotFoundException extends HttpException_1.default {
    constructor(id) {
        super(404, `Post with id ${id} not found`);
    }
}
exports.default = PostNotFoundException;
