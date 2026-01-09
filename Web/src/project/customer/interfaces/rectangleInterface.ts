import { Gondola } from "./gondolaInterface";

export interface Rectangle {
  id: number;
  x: number;
  y: number;
  lines: number[];
  size: number;
  lineColor: string;
  lineSpacingFactor: number;
  gondola: Gondola;
}
