export interface RegisterPayload {
  role: 'guardian' | 'companion';
  agreements: {
    version: string;
    date: string;
  };
  email: string;
  password: string;
  pwVerify: string;
  name: string;
  phoneNumber: string;
  address: string;
  birthdate: string;
  registeredParents?: {
    name: string;
    phoneNumber: string;
    address: string;
    birthdate: string;
  }[];
}
