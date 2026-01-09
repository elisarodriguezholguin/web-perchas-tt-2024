export interface BillApi {
  areaTotal: number;
  idAreaComercial: number;
  subtotal: number;
  iva: number;
  total: number;
  detalles: Detalle[];
  imageBase64: string;
}

export interface Detalle {
  idTexturaPercha: number;
  idTipoPercha: number;
  metros: number;
  divisiones: number;
}
