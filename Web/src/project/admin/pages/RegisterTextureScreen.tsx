import { useState } from "react";
import { BasePage } from "../../template";
import { Box, TextField, Button, Grid, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { usePostCatalogMutation } from "../../../services";

export const RegisterTextureScreen = () => {
  const [fetchPostCatalog, { isLoading }] = usePostCatalogMutation();
  const [texture, setTexture] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verifiedImageUrl, setVerifiedImageUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyImage = async () => {
    try {
      const response = await fetch(imageUrl, { method: "HEAD" });

      if (!response.ok) {
        throw new Error("Imagen no compatible");
      }

      const img = new Image();
      img.onload = () => {
        setVerifiedImageUrl(imageUrl);
        setIsVerified(true);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Imagen cargada correctamente.",
        });
      };
      img.onerror = () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Imagen no compatible.",
        });
        setVerifiedImageUrl("");
        setIsVerified(false);
      };
      img.src = imageUrl;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe elegir otra URL. La imagen no permite conexiones desde cualquier página.",
      });
      setVerifiedImageUrl("");
      setIsVerified(false);
    }
  };

  const handleReset = () => {
    setTexture("");
    setPrice("");
    setImageUrl("");
    setVerifiedImageUrl("");
    setIsVerified(false);
  };

  const handleSubmit = async () => {
    if (texture.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La textura debe tener al menos 3 caracteres.",
      });
      return;
    }
    if (parseFloat(price) <= 1 || price.length < 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El precio debe ser mayor a 1.",
      });
      return;
    }
    if (!verifiedImageUrl) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe verificar la imagen antes de registrar.",
      });
      return;
    }
    await fetchPostCatalog({
      catalogo: "texturapercha",
      item: {
        id: 0,
        nombre: texture,
        url: verifiedImageUrl,
        precio: parseFloat(price),
      },
    })
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Textura ${texture} con precio ${price} registrada correctamente.`,
        }).then(() => {
          handleReset();
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${JSON.stringify(e, null, 3)}`,
        });
      });
  };

  return (
    <BasePage>
      <Grid container spacing={2} sx={{ mt: 5, width: "90%", maxWidth: 1000 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <TextField
              fullWidth
              label="Agregar Textura"
              value={texture}
              onChange={(e) => setTexture(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL de la Imagen"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isVerified}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyImage}
                  disabled={isVerified}
                >
                  Verificar Imagen
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleReset}
                >
                  Reiniciar
                </Button>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isVerified || isLoading || parseFloat(price) <= 0}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Registrar"}
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {verifiedImageUrl && (
            <img
              src={verifiedImageUrl}
              alt="Verificación de Imagen"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </Grid>
      </Grid>
    </BasePage>
  );
};
