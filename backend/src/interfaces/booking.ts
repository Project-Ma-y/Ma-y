import { fstore } from "../utils/firebase";

export interface BookingPayload {
  userId: string;
  companionId?: string;
  guardianId?: string;
  date: string; // YYYY-MM-DD-HH-mm
  place: string;
  userType: 'guardian' | 'companion';
  status: 'pending' | 'completed' | 'cancelled';
  
  price: number;         // 총 금액 (단위: 원)
  isPaid: boolean;       // 결제 여부
  paymentMethod?: 'card' | 'cash' | 'transfer'; // 결제 방식 (선택)
  paidAt?: string;       // 결제 일시 (선택)
}
;