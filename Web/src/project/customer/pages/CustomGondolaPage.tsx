import { Button, Grid, TextField, Typography, Box } from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import { AddOutlined } from "@mui/icons-material";
import { useKonva } from "../hooks";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { Stage as StageRef } from "konva/lib/Stage";
import { BasePage } from "../../template";
import { CustomSelector } from "../../../components";
import {
  BackgroundImageKonva,
  DraggableRectangle,
  Quotation,
} from "../components";
import { Item } from "../interfaces";
import { useCatalogStore } from "../../../shared";

export const CustomGondolaPage = () => {
  const {
    isFirstRectangle,
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
    setTipoDePerchaSeleccionada,
    TipoDePerchaSeleccionada,
    setTotalArea,
    windowWidthRef,
    setPerchaSize,
    setBackgroundImage,
    setRectangles,
  } = useKonva();
  const [resetSelector, setresetSelector] = useState(false);

  const { gondolaItems, textureItems, comercialAreas } = useCatalogStore();

  useEffect(() => {
    gondolaItems.length > 0 && setTipoDePerchaSeleccionada(gondolaItems[0]);
  }, [gondolaItems]);

  const handleResetAll = () => {
    setresetSelector(!resetSelector);
    settexturaSeleccionada(undefined as unknown as Item);
    setAreaComercialSeleccionada(undefined as unknown as Item);
    // Llamar a todas las funciones de reinicio
  };

  const stageRef = useRef<StageRef>(null);

  const [totalAreaError, setTotalAreaError] = useState<string | null>(null);
  const [perchaSizeError, setPerchaSizeError] = useState<string | null>(null);

  const handleTotalAreaChange = (value: string) => {
    const numericValue = Number(value);
    if (value === "") {
      setTotalAreaError(null); // No mostrar error si el campo está vacío
      setTotalArea(value);
      return;
    }
    if (!isNaN(numericValue) && numericValue >= 1) {
      setTotalAreaError(null);
      setTotalArea(value);
    } else {
      setTotalAreaError("El valor debe ser mayor o igual a 1.");
    }
  };

  const handlePerchaSizeChange = (value: string) => {
    const numericValue = Number(value);
    if (value === "") {
      setPerchaSizeError(null); // No mostrar error si el campo está vacío
      setPerchaSize(value);
      return;
    }
    if (!isNaN(numericValue) && numericValue >= 1) {
      setPerchaSizeError(null);
      setPerchaSize(value);
    } else {
      setPerchaSizeError("El valor debe ser mayor o igual a 1.");
    }
  };

  const isAddButtonDisabled =
    totalAreaError !== null ||
    perchaSizeError !== null ||
    totalArea === "" ||
    perchaSize === "" ||
    Number(totalArea) < 1 ||
    Number(perchaSize) < 1;

  return (
    <>
      <BasePage>
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "white",
            padding: 1,
          }}
        >
          Crea tus perchas personalizadas
        </Typography>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            padding: 2,
            boxShadow: 3,
            maxWidth: "80%",
            mx: "auto",
            mb: 2,
          }}
          className="box-shadow animate__animated animate__fadeIn"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="number"
                value={totalArea}
                onChange={({ target: { value } }) =>
                  handleTotalAreaChange(value)
                }
                label="Ancho en metros de tu área comercial"
                placeholder="100"
                error={!!totalAreaError}
                helperText={totalAreaError}
                disabled={isFirstRectangle}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="number"
                value={perchaSize}
                onChange={({ target: { value } }) =>
                  handlePerchaSizeChange(value)
                }
                label="Ancho en metros de la percha"
                placeholder="2"
                error={!!perchaSizeError}
                helperText={perchaSizeError}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomSelector
                catalog={textureItems}
                propertyKey="nombre"
                onSelect={settexturaSeleccionada}
                label="Textura de la percha"
                reset={resetSelector}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomSelector
                catalog={comercialAreas}
                propertyKey="nombre"
                onSelect={setAreaComercialSeleccionada}
                label="Seleccionar Área comercial"
                reset={resetSelector}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomSelector
                catalog={gondolaItems}
                propertyKey="nombre"
                defaultValue={gondolaItems[0]}
                onSelect={setTipoDePerchaSeleccionada}
                label="Seleccionar Tipo de Percha"
                reset={resetSelector}
              />
            </Grid>
          </Grid>
          <Button
            onClick={() =>
              totalArea.length > 0 && perchaSize.length > 0
                ? addRectangle(
                    parseInt(totalArea),
                    parseInt(perchaSize),
                    1,
                    TipoDePerchaSeleccionada
                  )
                : Swal.fire(
                    "Aviso",
                    "Introduce los datos correctamente",
                    "warning"
                  )
            }
            variant="contained"
            sx={{ marginTop: 2 }}
            fullWidth
            disabled={isAddButtonDisabled}
          >
            <AddOutlined />
            Agregar Percha
          </Button>
        </Grid>
        <Grid
          container
          spacing={0}
          sx={{ flexGrow: 1, height: "100%", maxHeight: "calc(100vh - 150px)" }}
        >
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {areaComercialSeleccionada && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stage
                  className="box-shadow animate__animated animate__fadeIn"
                  ref={stageRef}
                  width={windowWidthRef.current}
                  height={window.innerHeight * 0.8}
                  style={{ maxHeight: "100%", width: "100%", height: "100%" }}
                >
                  <Layer>
                    {backgroundImage && (
                      <BackgroundImageKonva
                        url={areaComercialSeleccionada.url}
                        width={windowWidthRef.current}
                        height={window.innerHeight * 0.8}
                      />
                    )}
                    <Rect
                      x={0}
                      y={0}
                      width={windowWidthRef.current}
                      height={window.innerHeight * 0.8}
                      stroke="gray"
                      strokeWidth={2}
                    />
                    {rectangles.map((rect) => (
                      <DraggableRectangle
                        isCustom
                        key={rect.id}
                        {...rect}
                        stageWidth={windowWidthRef.current}
                        stageHeight={window.innerHeight * 0.8}
                        imgUrl={rect.gondola.texture.url}
                        onAddLine={addLine}
                        onRemoveLine={removeLine}
                        onDelete={() => deleteRectangle(rect.id)}
                      />
                    ))}
                  </Layer>
                </Stage>
              </Box>
            )}
          </Grid>
          {areaComercialSeleccionada && (
            <Grid
              item
              xs={4}
              sx={{ height: "100%" }}
              className="box-shadow animate__animated animate__fadeIn"
            >
              <Quotation
                areaComercial={areaComercialSeleccionada}
                areaTotal={totalArea}
                perchas={rectangles}
                onReset={() => {
                  setTotalArea("");
                  setPerchaSize("");
                  setAreaComercialSeleccionada(undefined as unknown as Item);
                  settexturaSeleccionada(undefined as unknown as Item);
                  setBackgroundImage(null);
                  setRectangles([]);
                  handleResetAll();
                }}
                stageRef={stageRef}
              />
            </Grid>
          )}
        </Grid>
      </BasePage>
    </>
  );
};
