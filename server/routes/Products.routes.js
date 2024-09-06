import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/Products.controller.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.route("/")
  .get(verifyUser, getAllProducts)
  .post(verifyUser, createProduct);

router.route("/:id")
  .get(verifyUser, getProductById)
  .patch(verifyUser, updateProduct)
  .delete(verifyUser, deleteProduct);

export default router