import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Item, PrefabricatedGondola, Rectangle } from "../interfaces";

export const useKonva = () => {
  const [isFirstRectangle, setIsFirstRectangle] = useState(false);
  const [texturaSeleccionada, settexturaSeleccionada] = useState<Item>(
    undefined as unknown as Item
  );
  const [TipoDePerchaSeleccionada, setTipoDePerchaSeleccionada] =
    useState<Item>(undefined as unknown as Item);
  const [areaComercialSeleccionada, setAreaComercialSeleccionada] =
    useState<Item>(undefined as unknown as Item);

  const [perchaPrefabricadaSeleccionada, setPerchaPrefabricadaSeleccionada] =
    useState<PrefabricatedGondola>(
      undefined as unknown as PrefabricatedGondola
    );

  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [totalArea, setTotalArea] = useState<string>("");
  const [perchaSize, setPerchaSize] = useState<string>("");
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const windowWidthRef = useRef<number>(window.innerWidth * 0.6);

  const addRectangle = (
    totalArea: number,
    perchaSize: number,
    divider: number = 1,
    tipoDePercha: Item
  ) => {
    if ((areaComercialSeleccionada?.id ?? 0) === 0) {
      Swal.fire("Aviso", "Seleccione un área comercial", "warning");
      return;
    }
    if ((texturaSeleccionada?.id ?? 0) === 0) {
      Swal.fire("Aviso", "Seleccione una textura", "warning");
      return;
    }
    if (totalArea <= 0 || perchaSize <= 0 || perchaSize >= totalArea) {
      Swal.fire(
        "Aviso",
        "Las medidas no son válidas, La percha debe ser menor al área total",
        "warning"
      );
      return;
    }
    setIsFirstRectangle(true);
    const rectSize =
      ((perchaSize * (windowWidthRef.current / totalArea)) / 10) * 0.925;

    // Ajustar la distancia entre líneas basado en tipoDePercha
    const lineSpacingFactor = tipoDePercha.factorPrecio ?? 0; // Espacio doble comparado con Percha
    let lineColor;

    switch (tipoDePercha.nombre) {
      case "Gondola":
        lineColor = "yellow";
        break;
      case "Rack":
        lineColor = "blue";
        break;
      case "Percha":
      default:
        lineColor = "red";
    }

    const initialLines = Array.from(
      { length: divider },
      (_, i) => (i + 1) / ((i + 2) * lineSpacingFactor)
    );

    const newRectangle: Rectangle = {
      id: rectangles.length + 1,
      x: 50,
      y: 50,
      lines: initialLines,
      size: rectSize,
      lineColor,
      lineSpacingFactor,
      gondola: {
        idGondola: rectangles.length + 1,
        texture: {
          ...texturaSeleccionada,
        },
        type: tipoDePercha,
        meters: perchaSize,
        dividers: divider,
      },
    };

    setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  };

  const addLine = (id: number) => {
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) =>
        rect.id === id
          ? {
              ...rect,
              lines: [
                ...rect.lines,
                (rect.lines.length + 1) / (rect.lines.length + 2),
              ],
            }
          : rect
      )
    );
  };

  const removeLine = (id: number) => {
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) =>
        rect.id === id && rect.lines.length > 1
          ? { ...rect, lines: rect.lines.slice(0, -1) }
          : rect
      )
    );
  };

  const deleteRectangle = (id: number) => {
    setRectangles((prevRectangles) =>
      prevRectangles.filter((rect) => rect.id !== id)
    );
  };

  useEffect(() => {
    if (rectangles.length === 0) setIsFirstRectangle(false);
  }, [rectangles]);

  useEffect(() => {
    if (areaComercialSeleccionada) {
      const loadImage = () => {
        const img = new Image();
        img.src = areaComercialSeleccionada.url;
        img.onload = () => {
          setBackgroundImage(img);
        };
      };
      loadImage();
    }
  }, [areaComercialSeleccionada]);
  return {
    isFirstRectangle,
    texturaSeleccionada,
    areaComercialSeleccionada,
    rectangles,
    totalArea,
    perchaSize,
    backgroundImage,
    addRectangle,
    addLine,
    removeLine,
    deleteRectangle,
    settexturaSeleccionada,
    setAreaComercialSeleccionada,
    TipoDePerchaSeleccionada,
    setTipoDePerchaSeleccionada,
    setRectangles,
    setTotalArea,
    setPerchaSize,
    setBackgroundImage,
    windowWidthRef,
    perchaPrefabricadaSeleccionada,
    setPerchaPrefabricadaSeleccionada,
  };
};
