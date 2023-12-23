import { Router } from "express";
import {
  getUserLink,
  validateToken,
  getProLink,
} from "../controllers/linkController.js";
const router = Router();

router.route("/user-link").get(getUserLink);
router.route("/pro-link").get(getProLink);
router.route("/validate-link").post(validateToken);

export default router;
