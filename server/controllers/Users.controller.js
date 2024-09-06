import { Op } from "sequelize";
import Users from "../models/Users.model.js";
import argon2 from "argon2";

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['uuid', 'name', 'email', 'role'],
    });
    if (!users) return res.status(404).json({ msg: "No users found" });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await Users.findOne({
      attributes: ['uuid', 'name', 'email', 'role'],
      where: { uuid: req.params.id }
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const createUser = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword || !role) return res.status(400).json({ msg: "Please fill in all fields" })

  const user = await Users.findOne({
    where: {
      [Op.or]: [{ email }, { name }]
    }
  })
  if (user) return res.status(400).json({ msg: "User already exists" })

  if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters" })

  const match = password === confirmPassword;
  if (!match) return res.status(400).json({ msg: "Passwords do not match" })

  const hashPassword = await argon2.hash(password)
  try {
    await Users.create({ name, email, password: hashPassword, role })
    res.status(201).json({ msg: "User created successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const updateUser = async (req, res) => {
  const user = await Users.findOne({ where: { uuid: req.params.id } })
  if (!user) return res.status(404).json({ msg: "User not found" })

  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ msg: "Please fill in all fields" })

  if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" })

  if (password.length < 6 || user.password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters" })

  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password
  }
  if (password !== "" || password !== null) {
    hashPassword = await argon2.hash(password)
  }


  try {
    await Users.update({ name, email, password: hashPassword, role }, { where: { uuid: req.params.id } })
    res.status(200).json({ msg: "User updated successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const deleteUser = async (req, res) => {
  const user = await Users.findOne({ where: { uuid: req.params.id } })
  if (!user) return res.status(404).json({ msg: "User not found" })

  try {
    await Users.destroy({ where: { uuid: req.params.id } })
    res.status(200).json({ msg: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser }