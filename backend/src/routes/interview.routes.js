import { Router } from "express";
import { interview } from "../controllers/interview.controller.js";

const router = Router();

router.route("/").post(interview);

export default router;