import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string;
  const validToken = token.split("Bearer ")[1];
  let jwtPayload;
  try {
    jwtPayload = jwt.verify(validToken, process.env.JWT_SECRET) as any;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }

  const { _id } = jwtPayload;
  const newToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.setHeader("token", newToken);

  next();
};
