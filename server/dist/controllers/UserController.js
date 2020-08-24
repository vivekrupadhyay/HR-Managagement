"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const express = require("express");
const userModel_1 = require("../entity/userModel");
class UserController {
    constructor() {
        this.path = "/users";
        this.router = express.Router();
        this.users = userModel_1.default;
        this.getAll = (request, response) => {
            this.users.find().then((users) => {
                response.send(users);
            });
        };
        this.getuserById = (request, response) => {
            const id = request.params.id;
            this.users.findById(id).then((post) => {
                response.send(post);
            });
        };
        this.createUser = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            const hashedPassword = yield bcrypt.hash(userData.password, 10);
            const createUser = new this.users(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            const savedPost = yield createUser.save();
            response.send(savedPost);
            // const createdUser = new this.users(userData);
            // createdUser.save().then((savedUser) => {
            //   response.send(savedUser);
            // });
        });
        this.modifyUser = (request, response) => {
            const id = request.params.id;
            const postData = request.body;
            this.users.findByIdAndUpdate(id, postData, { new: true }).then((user) => {
                response.send(user);
            });
        };
        this.deleteUser = (request, response) => {
            const id = request.params.id;
            this.users.findByIdAndDelete(id).then((successResponse) => {
                if (successResponse) {
                    response.send(200);
                }
                else {
                    response.send(404);
                }
            });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.post(this.path, this.createUser);
        this.router.get(`${this.path}/:id`, this.getuserById);
        this.router.patch(`${this.path}/:id`, this.modifyUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
    }
}
exports.default = UserController;
