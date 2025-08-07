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
import path from "path";

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


const allowedOrigins = [
  "http://127.0.0.1:3000",
];

const app: Express = express();

app.set("port", process.env.PORT || 3000); //  서버 포트
app.set("host", process.env.HOST || "127.0.0.1"); // 서버 아이피

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ 허용
      } else {
        callback(new Error("Not allowed by CORS")); // ❌ 차단
      }
    },
    credentials: true
  })
);
app.use("/api/booking", bookingsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

//테스트용 정적파일
const testPath = path.join(__dirname, '../../test');
app.use('/test', express.static(testPath));

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});

app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);