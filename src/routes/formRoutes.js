import express from "express";
import { createForm, deleteForm, editForm, getFormById, getForms,getResponses,publishForm, submitResponse, unpublishForm } from "../controllers/formController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();


router.route("/").all(protect).get(getForms).post(createForm);
router.route("/:formId").all(protect).get(getFormById).delete(deleteForm).patch(editForm)
router.patch("/:formId/publish",protect,publishForm);
router.patch("/:formId/unpublish",protect,unpublishForm);
router.route("/:formId/responses").post(submitResponse).get(getResponses);


export default router;