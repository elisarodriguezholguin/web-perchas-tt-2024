export interface Item {
  id: number;
  nombre: string;
  url: string;
  factorPrecio?: number;
  precio?: number;
}

export type CatalogType = "AreaComercial" | "TipoPercha" | "TexturaPercha";

export interface Catalog {
  nombreCatalogo: CatalogType;
  items: Item[];
}
