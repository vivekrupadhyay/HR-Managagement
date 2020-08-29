import * as bcrypt from "bcrypt";
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import userModel from "../entity/userModel";
import User from "../interfaces/user.interface";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private users = userModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, [checkJwt, checkRole(["admin"])], this.getAll);
    this.router.post(
      this.path,
      [checkJwt, checkRole(["admin"])],
      this.createUser
    );
    this.router.get(
      `${this.path}/:id`,
      [checkJwt, checkRole(["admin"])],
      this.getuserById
    );
    this.router.patch(
      `${this.path}/:id`,
      [checkJwt, checkRole(["admin"])],
      this.modifyUser
    );
    this.router.delete(
      `${this.path}/:id`,
      [checkJwt, checkRole(["admin"])],
      this.deleteUser
    );
  }

  private getAll = (request: express.Request, response: express.Response) => {
    this.users.find().then((users) => {
      response.send(users);
    });
  };
  private getuserById = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    this.users.findById(id).then((user) => {
      response.send(user);
    });
  };
  private createUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: User = request.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const isExist = this.users.findOne({
      email: request.body.email,
    });
    if (isExist) {
      response
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
      return;
    } else {
      const createUser = new this.users({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await createUser.save();
      response.send({
        status: 200,
        message: "Record saved successfully.",
        savedUser,
      });
    }
    // const createdUser = new this.users(userData);
    // createdUser.save().then((savedUser) => {
    //   response.send(savedUser);
    // });
  };
  private modifyUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const savedUser: User = request.body;
    this.users.findByIdAndUpdate(id, savedUser, { new: true }).then((user) => {
      response.send(user);
    });
  };
  private deleteUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    this.users.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        response.send(404);
      }
    });
  };
}
export default UserController;
