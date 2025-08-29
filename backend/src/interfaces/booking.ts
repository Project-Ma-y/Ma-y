import { fstore } from "../utils/firebase";

export interface BookingPayload {
  isDeleted: boolean;
  userId: string;
  //familyId?: string;
  startBookingTime: string; // 예약일 ISO 8601
  endBookingTime: string; // 예약시간 ISO 8601
  departureAddress: string; // 출발지
  destinationAddress: string; //도착지
  roundTrip: boolean; //왕복이면 true
  assistanceType: 'guide' | 'admin' | 'shopping' | 'other'; //도움 유형
  additionalRequests?: string; //추가 요청
  userType: 'family' | 'senior';
  status: 'pending' | 'completed' | 'cancelled'; //상태
  
  price: number;         // 총 금액 (단위: 원)
  isPaid: boolean;       // 결제 여부
  paymentMethod?: 'card' | 'cash' | 'transfer'; // 결제 방식 (선택)
  paidAt?: string;       // 결제 일시 (선택) ISO 8601
}
;