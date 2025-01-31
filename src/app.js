import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MONGODB_URI, PORT } from "./config.js";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js"; // Importar board.routes.js
import taskRoutes from "./routes/task.routes.js"; // Importar task.routes.js
import "./config/passport.js";
import i18n from "./config/i18n.js";

// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// Configuración ÚNICA de Handlebars (sin duplicados)
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: {
    eq: (a, b) => a === b, // Helper para comparaciones
    __: function () {
      return i18n.__.apply(this, arguments); // Helper para i18n
    },
  }
});

// config view engine
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(i18n.init); // Usar i18n como middleware

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("DB is connected"))
  .catch((err) => console.error(err));

// Configuración de sesiones
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.__ = res.__; // i18n disponible en vistas
  next();
});

// Rutas
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);
app.use(boardRoutes); // Usar board.routes.js
app.use(taskRoutes); // Usar task.routes.js

// Archivos estáticos
app.use(express.static(join(__dirname, "public")));

// Manejo de errores
app.use((req, res) => res.status(404).render("404"));
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.render("error", { error });
});

export default app;