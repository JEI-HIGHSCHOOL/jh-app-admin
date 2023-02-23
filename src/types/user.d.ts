export interface User {
  _id: string;
  id: string;
  name: string;
  password: string;
  flags: number;
}

export interface Student {
  _id: string;
  phone: string;
  name: string;
  password?: string;
  department: string;
  grade: string;
  class: string;
  number: string;
  isVerified: boolean;
}

export enum UserFlags {
  general = 0 << 0,
  student = 1 << 1,
  freshman = 1 << 2,
  teacher = 1 << 3,
  admin = 1 << 5,
}
