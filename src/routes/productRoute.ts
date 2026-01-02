import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../services/productService";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.status(200).send(products);
});

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  res.status(200).send(product);
});

router.post("/", async (req, res) => {
  var { title, description, image, price, stock } = req.body;
  const result = await createProduct({ title, description, image, price, stock });
  res.status(result.statusCode).send(result.data);
});

router.put("/:id", async (req, res) => {
  const result = await updateProduct(req.params.id, req.body);
  res.status(result.statusCode).send({ message: result.data });
});

router.delete("/:id", async (req, res) => {
  const resutl = await deleteProduct(req.params.id);
  res.status(resutl.statusCode).send(resutl.data);
});

export default router;
