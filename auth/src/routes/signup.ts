import express, { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@sibidev/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

let JWT_KEY = process.env.JWT_KEY ? process.env.JWT_KEY : "sibi";

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password must be altest 4 charater"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    const user = await User.build({ email, password });
    await user.save();
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_KEY
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
