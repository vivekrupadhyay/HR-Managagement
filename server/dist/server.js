"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const UserController_1 = require("./controllers/UserController");
const validateEnv_1 = require("./config/validateEnv");
validateEnv_1.default();
const app = new app_1.default([new UserController_1.default()]
//5000,
);
// const app = new App([new UserController(), new AuthController()]);
// app.listen();
