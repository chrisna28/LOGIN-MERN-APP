import Users from "../models/Users.model.js";

const verifyUser = async (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ msg: "Unauthenticated" })

  const user = await Users.findOne({
    where: { uuid: req.session.userId }
  })
  if (!user) return res.status(404).json({ msg: "User not found" })
  req.userId = user.id
  req.role = user.role
  next()
}

const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: { uuid: req.session.userId }
  })
  if (!user) return res.status(404).json({ msg: "User not found" })
  if (user.role !== "admin") return res.status(403).json({ msg: "Access denied" })
  next()
}

export { verifyUser, adminOnly }