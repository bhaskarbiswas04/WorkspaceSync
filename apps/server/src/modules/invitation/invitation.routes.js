import express from "express";

import authenticate from "../../middleware/authenticate.js";

import {
  getMyInvitationsController,
  acceptInvitationController,
} from "./invitation.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getMyInvitationsController);

router.post("/:token/accept", acceptInvitationController);

export default router;