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
const userModel_1 = require("entity/userModel");
const jwt = require("jsonwebtoken");
class AuthController {
    constructor() {
        this.path = "/auth";
        this.router = express.Router();
        this.user = userModel_1.default;
        this.registration = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            console.log(userData);
            if (yield this.user.findOne({ email: userData.email })) {
                next(response.send({
                    code: 409,
                    msg: "Email already exists.",
                }));
            }
            else {
                const hashedPassword = yield bcrypt.hash(userData.password, 10);
                const user = yield this.user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                user.password = undefined;
                const tokenData = this.createToken(user);
                response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                response.send(user);
            }
        });
        this.loggingIn = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const logInData = request.body;
            const user = yield this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = yield bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                    response.send(user);
                }
                else {
                    next(response.send("Exception occure."));
                    //next(new WrongCredentialsException());
                }
            }
            else {
                next(response.send("Exception occure."));
            }
        });
        this.loggingOut = (request, response) => {
            response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
            response.send(200);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
exports.default = AuthController;
