import Users from "../models/Users.model.js";
import argon2 from "argon2";

const Login = async (req, res) => {
  const user = await Users.findOne({
    where: { email: req.body.email }
  })

  if (!req.body.email || !req.body.password) return res.status(400).json({ msg: "Please fill in all fields" })

  if (!user) return res.status(400).json({ msg: "Incorrect email or password" })

  const match = await argon2.verify(user.password, req.body.password)
  if (!match) return res.status(400).json({ msg: "Incorrect email or password" })

  req.session.userId = user.uuid
  const uuid = user.uuid
  const name = user.name
  const email = user.email
  const role = user.role
  res.status(200).json({ uuid, name, email, role })
}

const Me = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ msg: "Unauthenticated" })

  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role'],
    where: { uuid: req.session.userId }
  })
  if (!user) return res.status(404).json({ msg: "User not found" })

  res.status(200).json({ user })
}

const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Logout failed" })
  })
  res.status(200).json({ msg: "Logout success" })
}

export { Login, Logout, Me }