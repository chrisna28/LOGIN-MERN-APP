import { Op } from "sequelize";
import Products from "../models/Product.model.js";
import Users from "../models/Users.model.js";

const getAllProducts = async (req, res) => {
  try {
    if (req.role !== "admin") {
      const productsByUser = await Products.findAll({
        attributes: ['uuid', 'name', 'price'],
        where: {
          userId: req.userId,
        }
      })
      return res.status(200).json({ productsByUser });
    }

    const products = await Products.findAll({
      attributes: ['uuid', 'name', 'price', 'userId'],
      include: {
        model: Users,
        attributes: ['name', 'email']
      }
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const getProductById = async (req, res) => {
  try {
    if (req.role !== "admin") {
      const productsByUser = await Products.findOne({
        attributes: ['uuid', 'name', 'price'],
        where: {
          [Op.and]: [{ userId: req.userId }, { uuid: req.params.id }]
        }
      })
      if (!productsByUser) return res.status(404).json({ msg: "Product not found" });
      return res.status(200).json({ productsByUser });
    }
    const product = await Products.findOne({
      attributes: ['uuid', 'name', 'price'],
      where: { uuid: req.params.id },
      include: {
        model: Users,
        attributes: ['name', 'email']
      }
    })
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const createProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ msg: "Please fill in all fields" })

  try {
    await Products.create({ name, price, userId: req.userId })
    res.status(201).json({ msg: "Product created successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const updateProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ msg: "Please fill in all fields" })
  try {
    if (req.role !== "admin") {
      Products.update({ name, price }, {
        attributes: ['uuid', 'name', 'price'],
        where: { [Op.and]: [{ userId: req.userId }, { uuid: req.params.id }] }
      })
      return res.status(200).json({ msg: "Product updated successfully" })
    }

    await Products.update({ name, price }, {
      attributes: ['uuid', 'name', 'price'],
      where: { uuid: req.params.id },
      include: {
        model: Users,
        attributes: ['name', 'email']
      },
    })
    res.status(200).json({ msg: "Product updated successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      const product = await Products.destroy({
        where: { [Op.and]: [{ userId: req.userId }, { uuid: req.params.id }] }
      })
      if (!product) return res.status(404).json({ msg: "Product not found" });
      return res.status(200).json({ msg: "Product deleted successfully" })
    }

    const product = await Products.destroy({
      where: { uuid: req.params.id }
    })
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product deleted successfully" })
  } catch (error) {

  }
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }