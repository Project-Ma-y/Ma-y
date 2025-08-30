export interface RegisterPayload {
  isDeleted: boolean;
  hasSignup: boolean;
  customerType: 'family' | 'senior'; //가족/시니어
  agreements?: {
    version?: string;
    date?: string;
  };
  id: string; //아이디*
  password: string; //비밀번호
  pwVerify: string;
  name: string; //이름*
  phone: string; //전화번호*
  gender: string; //성별*
  address?: string; //주소
  birthdate?: string; //생년월일 ISO 8601*
  registeredFamily?: Array<{
    memberId: string;
    //uid?: string;                 // 가족 사용자 uid 참조
    name?: string;               // 가족 이름*
    phone?: string;
    gender?: string;
    birthdate?: string;
    relation?: string;           // 'daughter' 등*
    linkedAt?: string;           // ISO, 옵션
  }>;
}
