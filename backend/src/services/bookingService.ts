import { db } from "../utils/firebase";
import { BookingPayload } from "../interfaces/booking";
import { v4 as uuidv4 } from "uuid";
import { platform } from "os";

const BOOKINGS_COLLECTION = "bookings";

export async function createBookingService(payload: BookingPayload) {
  const bookingId = uuidv4();
  const docRef = db.collection(BOOKINGS_COLLECTION).doc(bookingId);

  await docRef.set({
    id: bookingId,
    userId: payload.userId,
    companionId: payload.companionId,
    guardianId: payload.guardianId,
    date: payload.date,
    time: payload.time,
    place: payload.place,
    userType: payload.userType,
    status: payload.status,

    price: payload.price,
    isPaid: payload.isPaid,
    paymentMethod: payload.paymentMethod,
    paidAt: payload.paidAt,
    createdAt: new Date().toISOString(),
  });

  return { id: bookingId };
}

export async function getAllBookingsService() {
  const snapshot = await db.collection(BOOKINGS_COLLECTION).get();
  return snapshot.docs.map((doc: any) => doc.data());
}

export async function getBookingByIdService(id: string) {
  const doc = await db.collection(BOOKINGS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function getMyBookingsService(userId: string) {
  const snapshot = await db
    .collection(BOOKINGS_COLLECTION)
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc: any) => doc.data());
}
