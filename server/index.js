import express from "express";
import session from "express-session";
import cors from "cors";
import db from "./config/Database.js";
import UsersRoutes from "./routes/Users.routes.js"
import ProductsRoutes from "./routes/Products.routes.js";
import AuthRoutes from "./routes/Auth.routes.js"
import SequelizeStore from "connect-session-sequelize";
import "dotenv/config";

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db
});


// (async () => {
//   await db.sync();
// })();

try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto'
  }
})
);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UsersRoutes);
app.use("/products", ProductsRoutes);
app.use("/auth", AuthRoutes);

// store.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});