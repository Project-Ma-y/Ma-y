import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
const admin = require("firebase-admin");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const credential = await admin.auth().createUser({
  })} catch (err) {
  };

}