import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bookingsRouter from "./routes/bookingsRouter";
import usersRouter from "./routes/authRouter";
import sessionsRouter from "./routes/sessionsRouter";
import { DecodedIdToken } from "firebase-admin/auth";
import cookieParser from "cookie-parser";
import { SessionPayload } from "./interfaces/session";
import { DocumentReference } from "firebase/firestore";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken; // Firebase 인증 토큰 타입
      sessionData?: SessionPayload;
      sessionRef?: DocumentReference;
    }
  }
}


const app: Express = express();

app.set("port", process.env.PORT || 3000); //  서버 포트
app.set("host", process.env.HOST || "127.0.0.1"); // 서버 아이피

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/booking", bookingsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});

app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);