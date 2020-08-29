import "dotenv/config";
import App from "./app";
import UserController from "./controllers/UserController";
import validateEnv from "./config/validateEnv";
import AuthController from "./controllers/AuthController";
import RoleController from "./controllers/RoleController";

validateEnv();

const app = new App([
  new UserController(),
  new AuthController(),
  new RoleController(),
]);
// app.listen();
