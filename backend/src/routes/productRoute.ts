import express, { Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../services/productService";
import { asyncHandler } from "../utils/asyncHandler";
import { ExtendRequest } from "../types/extendedRequest";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const response = await getAllProducts();
    res.status(response.statusCode).send(response.data);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const response = await getProductById(req.params.id);
    res.status(response.statusCode).send(response.data);
  })
);

router.post(
  "/",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    var { title, description, image, price, stock } = req.body;
    const result = await createProduct({
      title,
      description,
      image,
      price,
      stock,
    });
    res.status(result.statusCode).send(result.data);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const result = await updateProduct(req.params.id, req.body);
    res.status(result.statusCode).send({ message: result.data });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req: ExtendRequest, res: Response) => {
    const resutl = await deleteProduct(req.params.id);
    res.status(resutl.statusCode).send(resutl.data);
  })
);

export default router;
