import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).send("Authorization header was not provided");
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || '', async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid or expired token");
      return;
    }

    if(!payload){
      res.status(403).send("Invalid token payload");
      return;
    }

    const user = await userModel.findOne({ email: (payload as any).email });
    if (!user) {
      res.status(403).send("User associated with token not found");
      return;
    }

    req.user = user;
    next();
  });

};

export default validateJWT;
