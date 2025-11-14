import express from "express";
import {
  createForm,
  deleteForm,
  editForm,
  getFormById,
  getForms,
  getResponses,
  publishForm,
  submitResponse,
  unpublishForm,
  getAnalytics,
} from "../controllers/formController.js";
import { protect } from "../middleware/protect.js";
import { restrictAccess } from "../middleware/restrictAccess.js";
import { checkFormLimit } from "../middleware/checkPlanLimit.js";

const router = express.Router();
router.route("/").all(protect).get(getForms).post(checkFormLimit, createForm);

router
  .route("/:formId")
  .all(protect)
  .get(getFormById)
  .delete(deleteForm)
  .patch(editForm);

router.patch("/:formId/publish", protect, publishForm);
router.patch("/:formId/unpublish", protect, unpublishForm);

router
  .route("/:formId/responses")
  .post(submitResponse)
  .get(protect, getResponses);

router.route("/:formId/analytics").get(protect,restrictAccess, getAnalytics);

export default router;