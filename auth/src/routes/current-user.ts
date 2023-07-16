import express, { Router } from "express";
import { currentUser } from "@sibidev/common";
const router: Router = express.Router();

router.get("/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
