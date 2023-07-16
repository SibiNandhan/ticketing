import express, { Request } from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@sibidev/common";
import cookieSession from "cookie-session";
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";

// if (!process.env.JWT_KEY) {
//   throw new Error("No secret key");
// }

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter)
app.all("*", async (req:Request,res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
