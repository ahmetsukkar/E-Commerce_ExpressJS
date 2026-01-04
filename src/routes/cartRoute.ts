import express, { Response } from "express";
import {
  addItemToCart,
  checkout,
  clearCart,
  deleteItemInCart,
  getActiveCartForUser,
  updateItemInCart,
} from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/extendedRequest";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get(
  "/",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  })
);

router.post(
  "/items",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  })
);

router.put(
  "/items",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  })
);

router.delete(
  "/items/:id",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const productId = req.params.id;
    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).send(response.data);
  })
);

router.delete(
  "/",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const response = await clearCart({ userId });
    res.status(response.statusCode).send(response.data);
  })
);

router.post(
  "/checkout",
  validateJWT,
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.statusCode).send(response.data);
  })
);

export default router;
