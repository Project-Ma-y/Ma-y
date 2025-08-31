import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bookingsRouter from "./routes/bookingsRouter";
import authRouter from "./routes/authRouter";
import sessionsRouter from "./routes/sessionsRouter";
import usersRouter from "./routes/usersRouter";
import statsRouter from "./routes/statsRouter"
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


const allowedOrigins = new Set([
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://project-ma-y.github.io",
  "https://mayservice.netlify.app",
  "https://mayservice.co.kr",
  "https://www.mayservice.co.kr",
  "https://app.mayservice.co.kr",
  "https://testfforb--mayservice.netlify.app"
]);


const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // Origin 없는 경우(서버-서버, curl 등)도 허용
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  // ✅ allowedHeaders는 지정하지 말고 기본값 사용(요청 값을 미러링)
  methods: ["GET","HEAD","POST","PUT","PATCH","DELETE","OPTIONS"],
  optionsSuccessStatus: 204,
};

const app: Express = express();

// cors 최상단
app.use(cors(corsOptions));

// 2) 프리플라이트 전역 처리
app.options(/.*/, cors(corsOptions));

// 3) (선택) 보강 미들웨어 — 라우터 전에
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  next();
});


app.set("port", process.env.PORT || 3000); //  서버 포트
app.set("host", process.env.HOST || "127.0.0.1"); // 서버 아이피

app.use(express.json());
app.use(cookieParser());

app.use("/api/booking", bookingsRouter);
app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/stats", statsRouter);

//테스트용 정적파일
const testPath = path.join(__dirname, '../../test');
app.use('/test', express.static(testPath));

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});



// 6) 404 (CORS 유지)
app.use((req, res) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.status(404).json({ message: "Not Found" });
});

//7) 에러 핸들러 (CORS 유지)
app.use((err: any, req: Request, res: Response, _next: any) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  const code = typeof err.code === "number" ? err.code : 500;
  res.status(code).json({ message: err.message || "Server error" });
});


app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);


