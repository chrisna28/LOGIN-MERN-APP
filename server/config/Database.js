import { Sequelize } from "sequelize";

const db = new Sequelize('auth_mern', 'root', 'm4h3ndr4',
  {
    host: 'localhost',
    dialect: 'mysql',
  }
)

export default db