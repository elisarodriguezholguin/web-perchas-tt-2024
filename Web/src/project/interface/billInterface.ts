import { Gondola, Item } from "../customer";

export interface Bill {
  idBill: number;
  comercialArea: Item;
  totalArea: number;
  details: Detail[];
  subtotal: number;
  iva: number;
  total: number;
}

export interface Detail {
  idDetail: number;
  gondola: Gondola;
  quantity: number;
  total: number;
}
