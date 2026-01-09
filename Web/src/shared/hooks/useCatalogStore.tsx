import { Catalog } from "../../project";
import {
  setComercialAreas,
  setGondolaItems,
  setTextureItems,
} from "../catalog";
import { useAppStore } from "./useAppStore";

export const useCatalogStore = () => {
  const {
    catalog: { gondolaItems, textureItems, comercialAreas },
    dispatch,
  } = useAppStore();

  const onSetCatalogs = async (catalogs: Catalog[]) => {
    dispatch(
      setTextureItems(
        catalogs.find((x) => x.nombreCatalogo === "TexturaPercha")?.items ?? []
      )
    );
    dispatch(
      setComercialAreas(
        catalogs.find((x) => x.nombreCatalogo === "AreaComercial")?.items ?? []
      )
    );
    dispatch(
      setGondolaItems(
        catalogs.find((x) => x.nombreCatalogo === "TipoPercha")?.items ?? []
      )
    );
  };

  return {
    gondolaItems,
    textureItems,
    onSetCatalogs,
    comercialAreas,
  };
};
