import { Router } from "express";
import { renderIndex, renderAbout } from "../controllers/index.controller.js";
import Note from "../models/Note.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const notes = await Note.find({ user: req.user._id }).lean();
    res.render("index", { notes });
  } else {
    res.render("index");
  }
});

router.get("/lang/:lang", (req, res) => {
  res.cookie('lang', req.params.lang);
  res.redirect('back');
});

export default router;
