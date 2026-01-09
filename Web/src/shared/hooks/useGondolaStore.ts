import { Item, Rectangle } from "../../project";
import {
  setCustomComercialArea,
  setCustomGondolaRectangles,
  setPrefabricatedComercialArea,
  setPrefabricatedGondolaRectangles,
  setPrefabricatedGondolas,
} from "../gondola";
import { useAppStore } from "./useAppStore";
import { useCatalogStore } from "./useCatalogStore";

export const useGondolaStore = () => {
  const {
    gondola: {
      activeCustomGondola,
      activePrefabricatedGondola,
      prefabricatedGondolas,
    },
    dispatch,
  } = useAppStore();
  const { gondolaItems } = useCatalogStore();

  const onSetCustomComercialArea = (comercialArea: Item) =>
    dispatch(setCustomComercialArea(comercialArea));
  const onSetCustomGondolaRectangles = (rectangle: Rectangle) =>
    dispatch(setCustomGondolaRectangles(rectangle));
  const onSetPrefabricatedComercialArea = (comercialArea: Item) =>
    dispatch(setPrefabricatedComercialArea(comercialArea));
  const onSetPrefabricatedGondolaRectangles = (rectangle: Rectangle) =>
    dispatch(setPrefabricatedGondolaRectangles(rectangle));
  const onSetPrefabricatedGondolas = async () =>
    dispatch(
      setPrefabricatedGondolas([
        {
          idGondola: 1,
          name: "Percha de 2m con 3 divisiones",
          texture: {
            id: 0,
            nombre: "",
            url: "",
            precio: 25,
          },
          type: gondolaItems.find((item) =>
            item.nombre.toLowerCase().includes("percha")
          ) ?? {
            id: 0,
            nombre: "",
            url: "",
            factorPrecio: 0,
          },
          meters: 2,
          dividers: 3,
        },

        {
          idGondola: 2,
          name: "Gondola de 3m con 4 divisiones",
          texture: {
            id: 0,
            nombre: "",
            url: "",
            precio: 25,
          },
          type: gondolaItems.find((item) =>
            item.nombre.toLowerCase().includes("gondola")
          ) ?? {
            id: 0,
            nombre: "",
            url: "",
            factorPrecio: 0,
          },
          meters: 3,
          dividers: 4,
        },
        {
          idGondola: 3,
          name: "Rack de 5m con 2 divisiones",
          texture: {
            id: 0,
            nombre: "",
            url: "",
            precio: 25,
          },
          type: gondolaItems.find((item) =>
            item.nombre.toLowerCase().includes("rack")
          ) ?? {
            id: 0,
            nombre: "",
            url: "",
            factorPrecio: 0,
          },
          meters: 5,
          dividers: 2,
        },
      ])
    );

  return {
    activeCustomGondola,
    activePrefabricatedGondola,
    prefabricatedGondolas,
    onSetCustomComercialArea,
    onSetCustomGondolaRectangles,
    onSetPrefabricatedComercialArea,
    onSetPrefabricatedGondolaRectangles,
    onSetPrefabricatedGondolas,
  };
};
