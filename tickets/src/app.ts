import express, { Request } from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@sibidev/common";
import cookieSession from "cookie-session";
import { CreateTicketRouter } from "./routes/new";
import { showRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use("/api/tickets", indexTicketRouter);
app.use("/api/tickets", CreateTicketRouter);
app.use("/api/tickets", showRouter);
app.use("/api/tickets", updateTicketRouter);
app.all("*", async (req:Request,res) => {
  console.log('PATH',req.path);
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
