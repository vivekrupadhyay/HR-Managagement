import * as bcrypt from "bcrypt";
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import userModel from "../entity/userModel";
import User from "../interfaces/user.interface";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private users = userModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, this.getuserById);
    this.router.patch(`${this.path}/:id`, this.modifyUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
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
    this.users.findById(id).then((post) => {
      response.send(post);
    });
  };
  private createUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: User = request.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUser = new this.users({
      ...userData,
      password: hashedPassword,
    });
    const savedPost = await createUser.save();
    response.send(savedPost);
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
    const postData: User = request.body;
    this.users.findByIdAndUpdate(id, postData, { new: true }).then((user) => {
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
