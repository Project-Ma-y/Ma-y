import { db } from "../utils/firebase";
import { BookingPayload } from "../interfaces/booking";
import { v4 as uuidv4 } from "uuid";
import { platform } from "os";

const BOOKINGS_COLLECTION = "bookings";
const collectionRef = db.collection(BOOKINGS_COLLECTION);

export async function createBookingService(payload: Partial<BookingPayload>) {
  try {
    const bookingId = uuidv4();
    const docRef = await collectionRef.doc(bookingId);

    await docRef.set({
      bookingId,
      ...payload
    });

    return { bookingId };
  } catch (error: any) {
    console.error("❌ 예약 생성 실패:", error);
    throw new Error(`예약 생성 중 오류 발생: ${error.message}`);
  }
}

export async function getAllBookingsService() {
  try {
    const snapshot = await collectionRef.get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    console.error("❌ 전체 예약 불러오기 실패:", error);
    throw new Error(`전체 예약 불러오기 중 오류 발생: ${error.message}`);
  }
}


export async function getBookingByIdService(bookingId: string) {
  try {
    const doc = await collectionRef.doc(bookingId).get();
    if (!doc.exists) return null;
    return doc.data(); 
  } catch (error: any) {
    console.error("❌ 예약 불러오기 실패:", error);
    throw new Error(`예약 불러오기 중 오류 발생: ${error.message}`);
  }
}

export async function getMyBookingsService(userId: string) {
  try {
    const snapshot = await collectionRef
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    console.error("❌ 내 예약 불러오기 실패:", error);
    throw new Error(`내 예약 불러오기 중 오류 발생: ${error.message}`);
  }
}
