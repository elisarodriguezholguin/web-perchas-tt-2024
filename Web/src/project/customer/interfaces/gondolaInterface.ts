import { Item } from "./catalogInterface";

export interface Gondola {
  idGondola: number;
  texture: Item;
  type: Item;
  meters: number;
  dividers: number;
}

export interface PrefabricatedGondola extends Gondola {
  name: string;
}
