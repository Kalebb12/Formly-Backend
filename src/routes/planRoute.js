import express from "express";
import { getPlan } from "../controllers/planController.js";

const router = express.Router();

router.get('/',getPlan);

export default router;