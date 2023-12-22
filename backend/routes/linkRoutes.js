import { Router } from "express";
import { getUserLink, validateToken } from "../controllers/linkController.js";
const router = Router();

router.route("/user-link").get(getUserLink);
router.route("/validate-link").post(validateToken);

export default router;
