import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/Users.controller.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.route("/")
  .get(verifyUser, adminOnly, getAllUsers)
  .post(verifyUser, adminOnly, createUser);

router.route("/:id")
  .get(verifyUser, adminOnly, getUserById)
  .patch(verifyUser, adminOnly, updateUser)
  .delete(verifyUser, adminOnly, deleteUser);

export default router