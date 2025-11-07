import express from "express";
import { getPlan } from "../controllers/planController.js";

const router = express.Router();

router.post('/plan',getPlan);

export default router;
