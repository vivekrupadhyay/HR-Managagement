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
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
class App {
    constructor(controllers) {
        this.app = express();
        cors({ origin: "*" });
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    connectToTheDatabase() {
        const MONGO_URI = "mongodb+srv://virusDB:virus@1874@virus.iyst1.mongodb.net/virusDB?retryWrites=true&w=majority";
        const server = http.createServer(this.app);
        server.listen(process.env.PORT);
        server.on("listening", () => __awaiter(this, void 0, void 0, function* () {
            console.info(`Listening on port ${process.env.PORT}`);
            mongoose.connect(MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
            });
            mongoose.connection.on("open", () => {
                console.info("Connected to Mongo.");
            });
            mongoose.connection.on("error", (err) => {
                console.error(err);
            });
        }));
    }
}
exports.default = App;
