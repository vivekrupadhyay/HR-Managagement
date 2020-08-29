import { Request, Response, NextFunction } from "express";
import userModel from "../entity/userModel";
import User from "../interfaces/user.interface";

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let user: User;
    try {
      const id = res.locals.jwtPayload._id;
      const userRepository = userModel.findById(id);
      user = await userRepository;
    } catch (e) {
      res.status(401).send();
    }
    // if (roles.indexOf(user.role) > -1) next();
    if (roles.indexOf(user.role) === 0) next();
    else res.status(401).send();
  };
};
