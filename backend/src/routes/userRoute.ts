import express, { Response } from "express";
import { login, register } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { ExtendRequest } from "../types/extendedRequest";

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    var { firstName, lastName, email, password } = req.body;
    var result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json(result.data);
  })
);

router.post(
  "/login",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    var { email, password } = req.body;
    var result = await login({ email, password });
    res.status(result.statusCode).send(result.data);
  })
);

export default router;
