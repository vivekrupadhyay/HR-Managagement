import * as express from "express";
import Controller from "../interfaces/controller.interface";
import roleModel from "../entity/roleModel";
import Role from "../interfaces/role.interface";

class RoleController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private roles = roleModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.getRoleById);
    this.router.post(this.path, this.createRole);
    this.router.patch(`${this.path}/:id`, this.updateRole);
  }
  private getAll = async (
    request: express.Request,
    response: express.Response
  ) => {
    await this.roles.find().then((roles) => {
      response.send({
        status: 200,
        msg: "Get all roles successfully.",
        roles,
      });
    });
  };
  private getRoleById = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    await this.roles.findById(id).then((roles) => {
      response.send(roles);
    });
  };
  private createRole = async (
    request: express.Request,
    response: express.Response
  ) => {
    const roleData: Role = request.body;
    const createRole = new this.roles({
      ...roleData,
    });
    const savedRole = await createRole.save();
    response.send({
      status: 200,
      msg: "Role created successfully.",
      savedRole,
    });
  };
  private updateRole = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const roleData: Role = request.body;
    this.roles.findByIdAndUpdate(id, roleData, { new: true }).then((role) => {
      response.send({
        status: 200,
        msg: "Role updated successfully.",
        role,
      });
    });
  };
}
export default RoleController;
