import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
} from "../controllers/auth.controllers.js";

const router = Router();

// Rutas de autenticación
router.get("/signup", renderSignUpForm);
router.post("/signup", signup);
router.get("/signin", renderSigninForm);
router.post("/signin", signin);
router.get("/logout", logout);

// Rutas para restablecimiento de clave
router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", postForgotPassword);
router.get("/reset-password/:token", getResetPassword);
router.post("/reset-password/:token", postResetPassword);

export default router;
