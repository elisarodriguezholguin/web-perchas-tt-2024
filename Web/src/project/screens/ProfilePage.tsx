import {
  Avatar,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import { useAuthStore } from "../../shared";
import { BasePage } from "../template";
import Swal from "sweetalert2";
import { usePatchUpdateUserInfoMutation } from "../../services";
import { useState } from "react";
import { useForm } from "../../hooks";

export const ProfilePage = () => {
  const theme = useTheme();
  const {
    jwtInfo: {
      firstName,
      expiracion,
      lastName,
      userName,
      direccion,
      cedula,
      telefono,
      rolName,
    },
    onUpdateUserInfo,
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fetchUpdateUserInfo, { isLoading }] = usePatchUpdateUserInfoMutation();

  const {
    //formState,
    onInputChange,
    firstName: formFirstName,
    lastName: formLastName,
    userName: formUserName,
    direccion: formDireccion,
    cedula: formCedula,
    telefono: formTelefono,
    firstNameValid,
    lastNameValid,
    userNameValid,
    direccionValid,
    cedulaValid,
    telefonoValid,
    isFormValid,
  } = useForm(
    {
      firstName,
      lastName,
      userName,
      direccion,
      cedula,
      telefono,
    },
    {
      firstName: [
        (value) => value.length >= 3,
        "El nombre debe tener al menos 3 caracteres",
      ],
      lastName: [
        (value) => value.length >= 3,
        "El apellido debe tener al menos 3 caracteres",
      ],
      userName: [
        (value) => value.length >= 3,
        "El nombre de usuario debe tener al menos 3 caracteres",
      ],
      direccion: [
        (value) => value.length >= 3,
        "La dirección debe tener al menos 3 caracteres",
      ],
      cedula: [
        (value) => /^\d+$/.test(value),
        "La cédula solo debe contener números",
      ],
      telefono: [
        (value) => /^\d+$/.test(value),
        "El teléfono solo debe contener números",
      ],
    }
  );

  const onPressUpdateUserInfo = async () => {
    await fetchUpdateUserInfo({
      jwtInfo: {
        token: "",
        expiracion,
        rolName,
        firstName: formFirstName,
        lastName: formLastName,
        userName: formUserName,
        direccion: formDireccion,
        cedula: formCedula,
        telefono: formTelefono,
      },
      username: userName,
    })
      .unwrap()
      .then((resp) => {
        onUpdateUserInfo(resp);
        Swal.fire("Éxito", "Datos actualizados correctamente", "success");
        setIsEditing(false);
      })
      .catch((e: any) => {
        Swal.fire("Error", `${JSON.stringify(e.data, null, 3)}`, "error");
      });
  };

  return (
    <BasePage>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.secondary.main,
            width: 100,
            height: 100,
            fontSize: 50,
          }}
        >
          {firstName.charAt(0)}
        </Avatar>
      </Box>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "800px",
          mt: 2,
        }}
        className="box-shadow animate__animated animate__fadeIn"
      >
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Nombre de Usuario"
                name="userName"
                value={formUserName}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!userNameValid}
                helperText={userNameValid}
                fullWidth
              />
              <TextField
                label="Cédula"
                name="cedula"
                value={formCedula}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!cedulaValid}
                helperText={cedulaValid}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Nombre"
                name="firstName"
                value={formFirstName}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!firstNameValid}
                helperText={firstNameValid}
                fullWidth
              />
              <TextField
                label="Apellido"
                name="lastName"
                value={formLastName}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!lastNameValid}
                helperText={lastNameValid}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Dirección"
                name="direccion"
                value={formDireccion}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!direccionValid}
                helperText={direccionValid}
                fullWidth
              />
              <TextField
                label="Número de Teléfono"
                name="telefono"
                value={formTelefono}
                onChange={onInputChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                error={!!telefonoValid}
                helperText={telefonoValid}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={
              isEditing ? onPressUpdateUserInfo : () => setIsEditing(true)
            }
            disabled={isLoading || (isEditing && !isFormValid)}
            sx={{ mt: 3 }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isEditing ? (
              "Actualizar Información"
            ) : (
              "Editar Información"
            )}
          </Button>
        </Box>
      </Paper>
    </BasePage>
  );
};
