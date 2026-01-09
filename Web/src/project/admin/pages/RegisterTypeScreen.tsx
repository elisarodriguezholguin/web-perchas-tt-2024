import { useState } from "react";
import { BasePage } from "../../template";
import { TextField, Button, Box } from "@mui/material";
import Swal from "sweetalert2";

export const RegisterTypeScreen = () => {
  const [name, setName] = useState("");
  const [priceFactor, setPriceFactor] = useState("");
  const [minDivisions, setMinDivisions] = useState("");
  const [minWidth, setMinWidth] = useState("");

  const validateInputs = () => {
    if (name.length < 3) {
      Swal.fire("Error", "El nombre debe tener al menos 3 caracteres", "error");
      return false;
    }
    if (Number(priceFactor) < 1) {
      Swal.fire(
        "Error",
        "El factor de precio debe ser mayor o igual a 1",
        "error"
      );
      return false;
    }
    if (Number(minDivisions) < 1) {
      Swal.fire(
        "Error",
        "El mínimo de divisiones debe ser mayor o igual a 1",
        "error"
      );
      return false;
    }
    if (Number(minWidth) < 1) {
      Swal.fire(
        "Error",
        "El mínimo de ancho debe ser mayor o igual a 1",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      // Procesar el formulario
      Swal.fire("Success", "Datos enviados correctamente", "success");

      // Resetear los campos del formulario
      setName("");
      setPriceFactor("");
      setMinDivisions("");
      setMinWidth("");
    }
  };

  return (
    <BasePage>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          label="Nombre de tipo de percha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Factor de precio"
          value={priceFactor}
          onChange={(e) => setPriceFactor(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Mínimo de divisiones"
          value={minDivisions}
          onChange={(e) => setMinDivisions(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="number"
          label="Mínimo de ancho"
          value={minWidth}
          onChange={(e) => setMinWidth(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Enviar
        </Button>
      </Box>
    </BasePage>
  );
};
