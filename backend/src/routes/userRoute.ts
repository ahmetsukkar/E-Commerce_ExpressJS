import express, { Response } from "express";
import { getMyOrders, login, register } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { ExtendRequest } from "../types/extendedRequest";
import validateJWT from "../middlewares/validateJWT";

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
    res.status(result.statusCode).json(result.data);
  })
);

router.get(
  "/my-orders",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const response = await getMyOrders({ userId });
    res.status(response.statusCode).send(response.data);
  })
);

export default router;
