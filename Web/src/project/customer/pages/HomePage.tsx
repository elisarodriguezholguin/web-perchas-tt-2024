import { useState, useEffect, useRef } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import { AddOutlined } from "@mui/icons-material";
import { useKonva } from "../hooks";
import Swal from "sweetalert2";
import { BasePage } from "../../template";
import { CustomSelector } from "../../../components";
import {
  BackgroundImageKonva,
  DraggableRectangle,
  Quotation,
} from "../components";
import { Item } from "../interfaces";
import { useCatalogStore, useGondolaStore } from "../../../shared";
import { useLazyGetCatalogsQuery } from "../../../services";
import { Stage as StageRef } from "konva/lib/Stage";

export const HomePage = () => {
  const {
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
    setTotalArea,
    windowWidthRef,
    setPerchaSize,
    setRectangles,
    perchaPrefabricadaSeleccionada,
    setPerchaPrefabricadaSeleccionada,
  } = useKonva();
  const stageRef = useRef<StageRef>(null);

  const [fetchCatalogs, { isLoading }] = useLazyGetCatalogsQuery();
  const { textureItems, comercialAreas, gondolaItems, onSetCatalogs } =
    useCatalogStore();
  const { prefabricatedGondolas, onSetPrefabricatedGondolas } =
    useGondolaStore();

  const [isRetry, setIsRetry] = useState(false);
  const [resetSelector, setResetSelector] = useState(false); // Añadido para manejar el reinicio de selectores

  useEffect(() => {
    if (comercialAreas.length > 0) {
      setAreaComercialSeleccionada(comercialAreas[0]);
    }
  }, [comercialAreas]);

  const OnReloadCatalog = async () => {
    try {
      const catalogs = await fetchCatalogs().unwrap();
      onSetCatalogs(catalogs);

      setIsRetry(false);
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: `${JSON.stringify(e.data, null, 3)}`,
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Reintentar",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsRetry(true);
        }
      });
    }
  };

  useEffect(() => {
    OnReloadCatalog();
  }, [isRetry]);

  useEffect(() => {
    setTotalArea("25");
  }, []);

  useEffect(() => {
    onSetPrefabricatedGondolas();
  }, [textureItems, gondolaItems]);

  const resetRefs = useRef<Array<() => void>>([]);
  const handleResetAll = () => {
    setResetSelector(!resetSelector); // Activar el reinicio de selectores
    // Llamar a todas las funciones de reinicio
    resetRefs.current.forEach(
      (resetFunction) => resetFunction && resetFunction()
    );
  };

  /*   const captureScreenshot = () => {
    if (stageRef.current) {
      console.log("Capturing screenshot...");
      const dataURL = stageRef.current.toDataURL();
      console.log(dataURL);
      return dataURL;
    } else {
      return "";
    }
  }; */

  return (
    <>
      {isLoading && (
        <Modal
          open={isLoading}
          aria-labelledby="loading-modal"
          aria-describedby="loading-data"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={80} />
        </Modal>
      )}
      <BasePage>
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "white",
            padding: 1,
          }}
        >
          Elige tus perchas prefabricadas
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
          <Grid container spacing={2} justifyContent="center">
            {/* Ancho en metros de tu área comercial (invisible) */}
            <input
              type="hidden"
              value={50}
              onChange={({ target: { value } }) => setTotalArea(value)}
            />
            {/* CustomSelector para perchas prefabricadas */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              display="flex"
              justifyContent="center"
            >
              <CustomSelector
                catalog={prefabricatedGondolas}
                propertyKey={"name"}
                onSelect={(value) => {
                  setPerchaPrefabricadaSeleccionada(value);
                  setPerchaSize(value.meters.toString());
                }}
                label={"Seleccionar Perchas Prefabricadas"}
                reset={resetSelector}
              />
            </Grid>
            {/* CustomSelector para texturas */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              display="flex"
              justifyContent="center"
            >
              <CustomSelector
                catalog={textureItems}
                propertyKey={"nombre"}
                onSelect={settexturaSeleccionada}
                label={"Textura de la percha"}
                reset={resetSelector}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              onClick={() => {
                if (totalArea.length > 0 && perchaSize.length > 0) {
                  addRectangle(
                    parseInt(totalArea),
                    parseInt(perchaSize),
                    perchaPrefabricadaSeleccionada.dividers,
                    perchaPrefabricadaSeleccionada.type
                  );
                } else {
                  Swal.fire(
                    "Aviso",
                    "Introduce los datos correctamente",
                    "warning"
                  );
                }
              }}
              variant="contained"
              sx={{ marginTop: 2 }}
            >
              <AddOutlined />
              Agregar Percha
            </Button>
          </Grid>
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
                ref={stageRef}
                className="box-shadow animate__animated animate__fadeIn"
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
                      key={rect.id}
                      {...rect}
                      onAddLine={addLine}
                      onRemoveLine={removeLine}
                      onDelete={() => deleteRectangle(rect.id)}
                      imgUrl={rect.gondola.texture.url}
                      stageWidth={windowWidthRef.current}
                      stageHeight={window.innerHeight * 0.8}
                    />
                  ))}
                </Layer>
              </Stage>
            </Box>
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
                  setPerchaSize("");
                  settexturaSeleccionada(undefined as unknown as Item);
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
