import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Paso1 } from "../../assets/Paso1";
import { Paso2 } from "../../assets/Paso2";
import { Paso3 } from "../../assets/Paso3";
import { Paso4 } from "../../assets/Paso4";
import { Paso5 } from "../../assets/Paso5";

interface Step {
  title: string;
  description: string;
  imageUrl: string;
}

const steps: Step[] = [
  {
    title: "Paso 1: Selección de Percha",
    description:
      "Comienza tu cotización eligiendo una percha prefabricada de nuestro catálogo. Selecciona el tamaño, tipo y divisiones que mejor se adapten a tus necesidades. ¡No olvides elegir una textura que complemente tu espacio comercial!",
    imageUrl: Paso1, // URL de ejemplo
  },
  {
    title: "Paso 2: Añadir al Lienzo",
    description:
      "Una vez que hayas configurado tu percha, haz clic en 'Agregar Percha' para verla aparecer en el lienzo. Aquí podrás comenzar a visualizar cómo se verá en tu área comercial.",
    imageUrl: Paso2, // URL de ejemplo
  },
  {
    title: "Paso 3: Visualización y Ajustes en 2D",
    description:
      "En el lienzo, observa cómo queda tu percha en un entorno 2D que simula tu espacio comercial. Puedes moverla para ajustar su posición o eliminarla si decides cambiar de opinión. ¡Explora y perfecciona tu configuración!",
    imageUrl: Paso3, // URL de ejemplo
  },
  {
    title: "Paso 4: Detalles y Cotización",
    description:
      "Consulta todos los detalles de tu configuración: tipo de percha, textura, tamaño, divisiones, precios individuales y el total. Cuando estés listo, puedes proceder a realizar la cotización final con un solo clic.",
    imageUrl: Paso4, // URL de ejemplo
  },
  {
    title: "Paso 5: Generación de PDF",
    description:
      "¡Listo! Revisa el PDF generado automáticamente con todos los detalles de tu cotización. Este documento incluye toda la información necesaria para tu cotización.",
    imageUrl: Paso5, // URL de ejemplo
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalWithSteps = ({ open, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState(0); // Estado para el paso actual

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: "90vw", // Ajusta el ancho máximo del modal al 90% del viewport
          maxHeight: "90vh", // Ajusta la altura máxima del modal al 90% del viewport
          borderRadius: "15px", // Bordes redondeados
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center">
          {steps[currentStep].title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography align="center" sx={{ mb: 2 }}>
          {steps[currentStep].description}
        </Typography>
        <Box
          component="img"
          src={steps[currentStep].imageUrl}
          alt={steps[currentStep].title}
          sx={{
            width: "70%", // Ocupa el 70% del ancho del modal
            height: "auto", // Mantiene la proporción de la imagen
            display: "block",
            margin: "0 auto", // Centra la imagen horizontalmente
            borderRadius: "8px", // Bordes redondeados para la imagen
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="contained"
        >
          Atrás
        </Button>
        <Typography variant="body2" align="center">
          {`${currentStep + 1} / ${steps.length}`}
        </Typography>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          variant="contained"
        >
          Siguiente
        </Button>
      </DialogActions>
    </Dialog>
  );
};
