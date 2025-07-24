import {auth} from "../utils/firebase"

// 미들웨어: Firebase 토큰을 검증하는 함수
export const verifyFirebaseToken = async (req: any, res: any, next: any) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Authorization token missing');
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};