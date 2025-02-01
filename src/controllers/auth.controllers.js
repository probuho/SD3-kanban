import User from "../models/User.js";
import passport from "passport";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, securityQuestion, securityAnswer } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }

  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
      securityQuestion,
      securityAnswer,
    });
  }

  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The Email is already in use.");
    return res.redirect("/auth/signup");
  }

  const newUser = new User({ name, email, password, securityQuestion, securityAnswer });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "You are registered.");
  res.redirect("/auth/signin");
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/auth/signin",
  failureFlash: true,
});

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/auth/signin");
  });
};

export const getForgotPassword = (req, res) => {
  res.render("auth/forgot-password");
};

export const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error_msg", "No se encontró una cuenta con ese correo electrónico.");
    return res.redirect("/forgot-password");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Restablecimiento de Clave",
    text: `Recibiste este correo porque tú (o alguien más) solicitó restablecer la clave de tu cuenta.\n\n
           Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
           http://${req.headers.host}/reset-password/${token}\n\n
           Si no solicitaste esto, ignora este correo y tu clave permanecerá sin cambios.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error al enviar el correo:", err);
      req.flash("error_msg", "Hubo un problema al enviar el correo de restablecimiento.");
      return res.redirect("/forgot-password");
    }
    req.flash("success_msg", "Se envió un correo con las instrucciones para restablecer tu clave.");
    res.redirect("/login");
  });
};

export const getResetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error_msg", "El token de restablecimiento es inválido o ha expirado.");
    return res.redirect("/forgot-password");
  }

  res.render("auth/reset-password", { token: req.params.token });
};

export const postResetPassword = async (req, res) => {
  const { password, confirmPassword, securityAnswer } = req.body;

  if (password !== confirmPassword) {
    req.flash("error_msg", "Las claves no coinciden.");
    return res.redirect("back");
  }

  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error_msg", "El token de restablecimiento es inválido o ha expirado.");
    return res.redirect("/forgot-password");
  }

  if (user.securityAnswer !== securityAnswer) {
    req.flash("error_msg", "La respuesta a la pregunta de seguridad es incorrecta.");
    return res.redirect("back");
  }

  user.password = await user.encryptPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.flash("success_msg", "Tu clave ha sido restablecida exitosamente.");
  res.redirect("/login");
};
