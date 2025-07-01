export interface RegisterPayload {
  role: 'guardian' | 'companion';
  agreements: {
    version: string;
    date: string;
  };
  email: string;
  password: string;
  pwVerify: string;
  nickname: string;
  phoneNumber: string;
  address: string;
  birthdate: string;
  registeredParents?: {
    nickname: string;
    phoneNumber: string;
    address: string;
    birthdate: string;
  }[];
}
