import { Router } from "express";
import { renderBoard } from "../controllers/board.controller.js";

const router = Router();

router.get("/board", renderBoard);

export default router;