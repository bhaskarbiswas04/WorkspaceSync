import express from "express";

import authenticate from "../../middleware/authenticate.js";

import { getCurrentUser } from "./user.controller.js";

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);

export default router;