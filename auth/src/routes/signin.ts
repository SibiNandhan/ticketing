import express, { Request, Router, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@sibidev/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router: Router = express.Router();
const JWT_KEY = process.env.JWT_KEY ? process.env.JWT_KEY : "sibi";

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credential");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credential");
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      JWT_KEY
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
