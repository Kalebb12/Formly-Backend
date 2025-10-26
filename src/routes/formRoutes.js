import express from "express";
import { createForm, deleteForm, getFormById, getForms,publishForm, unpublishForm } from "../controllers/formController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();


router.route("/").all(protect).get(getForms).post(createForm);
router.route("/:formId").all(protect).get(getFormById).delete(deleteForm);
router.patch("/:formId/publish",protect,publishForm);
router.patch("/:formId/unpublish",protect,unpublishForm);

// router.route("/:formId/responses").get().post();


export default router;