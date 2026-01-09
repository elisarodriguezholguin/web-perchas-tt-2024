import React, { useState } from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { Stage as StageRef } from "konva/lib/Stage";
import { Item, Rectangle } from "../interfaces"; // Ajusta la importación según sea necesario
import { usePostBillMutation } from "../../../services";
import { BillApi, Detalle } from "../../interface";
import { useAuthStore, useCatalogStore } from "../../../shared";
import autoTable from "jspdf-autotable";
import { CodigoBarraBase64 } from "../../../assets/CodigoBarraBase64";
import { FirmaBase64 } from "../../../assets/FirmaBase64";
import dayjs from "dayjs";

interface Props {
  areaComercial: Item;
  areaTotal: string;
  perchas: Rectangle[];
  onReset: () => void;
  stageRef: React.RefObject<StageRef>;
}

export const Quotation = ({
  areaComercial,
  areaTotal = "0",
  perchas = [],
  onReset,
  stageRef,
}: Props) => {
  const {
    jwtInfo: { firstName, lastName },
  } = useAuthStore();
  const { textureItems } = useCatalogStore();
  const [fetchPostBill, { isLoading }] = usePostBillMutation();
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const priceFactors: Record<string, number> = {
    Percha: 1,
    Gondola: 1.2,
    Rack: 1.4,
  };

  const calcularTotalesPorPercha = () => {
    return perchas.map((percha) => {
      const { gondola, size, lines } = percha;
      const { texture, type, meters } = gondola;
      const typeName = texture.nombre;
      const texturePrice =
        textureItems.find((item) => item.nombre === typeName)?.precio || 0;
      const priceFactor = priceFactors[type.nombre] || 1;
      const totalPorPercha = meters * texturePrice * lines.length * priceFactor;
      return {
        typeName,
        size,
        divisiones: lines.length,
        total: totalPorPercha,
        meters,
        gondola,
      };
    });
  };

  const detallesPorPercha = calcularTotalesPorPercha();
  const subTotal = detallesPorPercha.reduce(
    (sum, detalle) => sum + detalle.total,
    0
  );
  const iva = subTotal * 0.15;
  const total = subTotal + iva;

  const captureScreenshot = () => {
    if (stageRef.current) {
      console.log("Capturing screenshot...");
      const dataURL = stageRef.current.toDataURL();
      return dataURL;
    } else {
      return "";
    }
  };

  const onPressSendBill = async () => {
    const screenshot = captureScreenshot();
    console.log(screenshot);
    const detalles: Detalle[] = detallesPorPercha.map((detalle) => ({
      idTexturaPercha: detalle.gondola.texture.id,
      idTipoPercha: detalle.gondola.type.id,
      metros: detalle.meters,
      divisiones: detalle.divisiones,
    }));

    const bill: BillApi = {
      areaTotal: parseInt(areaTotal),
      idAreaComercial: areaComercial.id,
      subtotal: subTotal,
      iva: iva,
      total: total,
      detalles: detalles,
      imageBase64: screenshot,
    };

    await fetchPostBill(bill)
      .unwrap()
      .then(async () => {
        handleDownloadPDF();
      })
      .catch((e) => {
        Swal.fire("Error", `${JSON.stringify(e.data, null, 3)}`, "error");
      });
  };

  const handleDownloadPDF = async () => {
    setIsLoadingPDF(true);
    const screenshot = captureScreenshot();
    const doc = new jsPDF("portrait", "px", "a4", false);

    // Título de la cotización
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Cotización", 20, 20);

    // Espacio para el código de barras en el encabezado
    const barcodeImg = CodigoBarraBase64;
    const barcodeWidth = 150; // Ancho del código de barras
    const barcodeHeight = 50; // Altura ajustada para estirarlo verticalmente
    const barcodeMargin = 20; // Margen desde el borde derecho
    const barcodeX = doc.internal.pageSize.width - barcodeWidth - barcodeMargin; // Posición horizontal

    doc.addImage(barcodeImg, "PNG", barcodeX, 20, barcodeWidth, barcodeHeight);

    // Fecha y nombre del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 40);
    doc.text(`Cliente: ${firstName} ${lastName}`, 20, 55);

    // Imagen centrada
    if (screenshot) {
      const imgWidth = 300;
      const imgHeight = 200;
      const imgX = (doc.internal.pageSize.width - imgWidth) / 2; // Centrado horizontalmente
      doc.addImage(screenshot, "PNG", imgX, 70, imgWidth, imgHeight);
    }

    // Datos de la tabla
    const tableData = detallesPorPercha.map((detalle) => {
      const unitPrice = detalle.total / detalle.divisiones; // Calcular precio unitario
      return [
        detalle.typeName,
        `${detalle.meters.toFixed(2)}m²`,
        `${detalle.divisiones} divisiones`,
        `$${unitPrice.toFixed(2)}`,
        `$${detalle.total.toFixed(2)}`,
      ];
    });

    // Agregar Subtotal, IVA y Total al final de los datos de la tabla
    const subtotal = subTotal.toFixed(2);
    const ivaAmount = iva.toFixed(2);
    const totalAmount = total.toFixed(2);

    tableData.push(
      ["", "", "", "Subtotal", `$${subtotal}`],
      ["", "", "", "IVA (15%)", `$${ivaAmount}`],
      ["", "", "", "Total", `$${totalAmount}`]
    );

    // Dibujar la tabla usando autoTable
    const tableStartY = 290; // posición Y donde comienza la tabla
    autoTable(doc, {
      startY: tableStartY,
      head: [
        ["Producto", "Cantidad", "Divisiones", "Precio Unitario", "Total"],
      ],
      body: tableData,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Color verde
      },
    });

    // Calcular la posición Y final para el mensaje y la firma
    const messageY = doc.internal.pageSize.height - 120; // Ajusta este valor si es necesario
    const signatureY = messageY + 30; // Asegúrate de que haya suficiente espacio

    // Mensaje de persuasión
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(
      "¡Gracias por elegirnos! Estamos comprometidos en ofrecerle el mejor servicio.",
      20,
      messageY
    );
    doc.text(
      "No dude en contactarnos si tiene alguna pregunta o necesita más información.",
      20,
      messageY + 15
    );

    // Espacio para la firma
    const signatureImg = FirmaBase64;
    const signatureWidth = 100; // Ajusta el ancho según sea necesario
    const signatureHeight = 40; // Ajusta la altura según sea necesario
    const signatureX = 20;
    doc.addImage(
      signatureImg,
      "PNG",
      signatureX,
      signatureY,
      signatureWidth,
      signatureHeight
    );

    // Guardar el PDF
    doc.save("cotizacion.pdf");

    setIsLoadingPDF(false);
    Swal.fire({
      title: "Éxito",
      text: "La cotización ha sido realizada con éxito",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      onReset();
    });
  };

  const handleReset = async () => {
    onReset();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "white",
      }}
    >
      <Typography variant="h6">Cotizador</Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          width: "100%",
          mt: 2,
        }}
      >
        <Typography variant="subtitle1">
          Área Comercial: {areaComercial.nombre}
        </Typography>
        <Typography variant="subtitle1">Área Total: {areaTotal}m²</Typography>
        <Typography variant="subtitle1">Detalles por Percha:</Typography>
        <Box sx={{ pl: 2 }}>
          {detallesPorPercha.map((detalle, index) => (
            <Typography key={index} variant="body2">
              {index + 1}. {detalle.typeName} - {detalle.meters.toFixed(2)}m² -{" "}
              {detalle.divisiones} divisiones - Total: $
              {detalle.total.toFixed(2)}
            </Typography>
          ))}
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Subtotal: ${subTotal.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1">
          IVA (15%): ${iva.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1">Total: ${total.toFixed(2)}</Typography>
      </Box>
      {perchas.length > 0 && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              onClick={handleReset}
              variant="outlined"
              color="secondary"
              disabled={isLoadingPDF || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Reiniciar"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={onPressSendBill}
              variant="contained"
              color="primary"
              disabled={isLoadingPDF || isLoading}
            >
              {isLoadingPDF ? (
                <CircularProgress size={24} />
              ) : (
                "Realizar Cotización"
              )}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
