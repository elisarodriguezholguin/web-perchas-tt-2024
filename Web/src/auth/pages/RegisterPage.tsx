import {
  Button,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout, RegisterInfo } from "..";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "../../hooks";
import { usePostRegisterUserMutation } from "../../services";
import Swal from "sweetalert2";
import { useRef } from "react";

const isValidPassword = (value: string) => {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%^&*]/.test(value)
  );
};

const getPasswordErrorMessage = (value: string) => {
  if (!/[A-Z]/.test(value))
    return "La contraseña debe contener al menos una letra mayúscula";
  if (!/[a-z]/.test(value))
    return "La contraseña debe contener al menos una letra minúscula";
  if (!/\d/.test(value))
    return "La contraseña debe contener al menos un número";
  if (!/[!@#$%^&*]/.test(value))
    return "La contraseña debe contener al menos un símbolo";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  return null;
};

const isNumeric = (value: string) => /^\d+$/.test(value);

export const RegisterPage = () => {
  const {
    formState,
    firstName,
    lastName,
    email,
    direccion,
    telefono,
    cedula,
    password,
    onInputChange,
    isFormValid,
    firstNameValid,
    lastNameValid,
    emailValid,
    direccionValid,
    telefonoValid,
    cedulaValid,
    passwordValid,
  } = useForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      direccion: "",
      telefono: "",
      cedula: "",
      password: "",
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
      email: [(value) => value.includes("@"), "Ingrese un correo válido"],
      direccion: [
        (value) => value.length >= 3,
        "La dirección debe tener al menos 3 caracteres",
      ],
      telefono: [
        (value) => isNumeric(value),
        "Este campo solo debe contener números",
      ],
      cedula: [
        (value) => isNumeric(value),
        "Este campo solo debe contener números",
      ],
      password: [(value) => isValidPassword(value), "."],
    }
  );

  const linkRef = useRef<HTMLAnchorElement>(null);

  const [fetchRegisterUser, { isLoading }] = usePostRegisterUserMutation();

  const onPressRegister = async () => {
    await fetchRegisterUser({
      username: email,
      ...formState,
    } as RegisterInfo)
      .unwrap()
      .then(() => {
        Swal.fire(
          "Éxito",
          "El usuario se ha registrado correctamente",
          "success"
        );
        linkRef.current?.click();
      })
      .catch((e) => {
        Swal.fire("Error", `${JSON.stringify(e, null, 3)}`, "error");
      });
  };

  return (
    <AuthLayout title={"Crear cuenta"}>
      <form>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Nombres"
              type="text"
              placeholder="Nombres"
              fullWidth
              name="firstName"
              value={firstName}
              onChange={onInputChange}
              error={!!firstNameValid}
              helperText={firstNameValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Apellidos"
              type="text"
              placeholder="Apellidos"
              fullWidth
              name="lastName"
              value={lastName}
              onChange={onInputChange}
              error={!!lastNameValid}
              helperText={lastNameValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Correo"
              type="email"
              placeholder="user@email.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
              error={!!emailValid}
              helperText={emailValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Dirección"
              type="text"
              placeholder="Dirección"
              fullWidth
              name="direccion"
              value={direccion}
              onChange={onInputChange}
              error={!!direccionValid}
              helperText={direccionValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Teléfono"
              type="text"
              placeholder="Teléfono"
              fullWidth
              name="telefono"
              value={telefono}
              onChange={onInputChange}
              error={!!telefonoValid}
              helperText={telefonoValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Cédula"
              type="text"
              placeholder="Cédula"
              fullWidth
              name="cedula"
              value={cedula}
              onChange={onInputChange}
              error={!!cedulaValid}
              helperText={cedulaValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
              error={!!passwordValid}
              helperText={getPasswordErrorMessage(password)}
            />
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={onPressRegister}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Crear cuenta"}
              </Button>
            </Grid>
          </Grid>
          <Grid container direction={"row"} justifyContent={"end"}>
            <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
            <Link
              ref={linkRef}
              component={RouterLink}
              color={"inherit"}
              to={"/auth/login"}
            >
              Ingresar
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
