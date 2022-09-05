import { User } from "./user";

export interface Notice {
    _id: string;
    title: string;
    content: string;
    publisher: User;
    published_date: Date;
  }
  