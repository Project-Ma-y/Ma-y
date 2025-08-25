export interface RegisterPayload {
  isDeleted: boolean;
  customerType: 'family' | 'senior'; //가족/시니어
  agreements: {
    version: string;
    date: string;
  };
  email: string; //이메일
  password: string; //비밀번호
  pwVerify: string;
  name: string; //이름
  phone: string; //전화번호
  gender: string; //성별
  address: string; //주소
  birthdate: string; //생년월일 ISO 8601
  registeredParents?: {
    name: string;
    phoneNumber: string;
    address: string;
    birthdate: string;
  }[];
}
