import express, { Router } from "express";

const router: Router = express.Router();

router.post("/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
