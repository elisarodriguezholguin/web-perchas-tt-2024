import { Bill } from "../../interface";

export interface BillHistory extends Bill {
  username: string;
  fullName: string;
}
