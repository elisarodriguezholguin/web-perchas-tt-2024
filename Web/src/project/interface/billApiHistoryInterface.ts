import { Item } from "../customer";

export interface BillApiHistory {
  idCotizacion: number;
  nameUser: string;
  nameRol: string;
  fechaCotizacion: string;
  areaTotal: number;
  nameAreaComercial: string;
  subtotal: number;
  iva: number;
  total: number;
  detalles: DetailHistory[];
  imageBase64: string;
}

export interface DetailHistory {
  idDetalleCotizacion: number;
  texturaPercha: Item;
  tipoPercha: Item;
  metros: number;
  divisiones: number;
}
