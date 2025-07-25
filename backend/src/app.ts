import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser"
import bookingsRouter from "./routes/bookingsRouter"
import usersRouter from "./routes/authRouter"
dotenv.config();

const app: Express = express();

app.set("port", process.env.PORT || 3000); //  서버 포트
app.set("host", process.env.HOST || "127.0.0.1"); // 서버 아이피

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api/booking", bookingsRouter);
app.use("/api/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});

app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);