import express from "express";
import { createForm, deleteForm, getFormById, getForms } from "../controllers/formController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();


router.route("/").all(protect).get(getForms).post(createForm);
router.route("/:formId").all(protect).get(getFormById).delete(deleteForm);
// router.route("/:formId/responses").get().post();


export default router;