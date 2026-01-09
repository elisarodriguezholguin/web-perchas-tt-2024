import { Button, CircularProgress, Grid, Link, TextField } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout, LoginInfo } from "../../auth";
import { useForm } from "../../hooks";
import { useAuthStore } from "../../shared";
import { usePostLogInMutation } from "../../services";
import Swal from "sweetalert2";
import Lottie from "react-lottie";

import GondolaAnimationLottie from "../../assets/GondolaAnimation.json";
import { BasePage } from "../../project";

let user = "";
let pass = "";

if (process.env.NODE_ENV === "development") {
  user = "user1@email.com";
  pass = "Abc123*+";
}

export const LoginPage = () => {
  const [fetchLogin, { isLoading }] = usePostLogInMutation();
  const { onLogin } = useAuthStore();
  const {
    formState,
    username,
    password,
    onInputChange,
    isFormValid,
    usernameValid,
    passwordValid,
  } = useForm(
    {
      username: user,
      password: pass,
    },
    {
      username: [(value) => value.includes("@"), "Ingrese un correo válido"],
      password: [
        (value) => value.length >= 6,
        "El password debe tener más de 6 caracteres.",
      ],
    }
  );

  const onPressLogin = async () => {
    await fetchLogin(formState as LoginInfo)
      .unwrap()
      .then(async (jwtInfo) => {
        await onLogin(jwtInfo);
      })
      .catch((e) => {
        Swal.fire("Error", `${JSON.stringify(e.data, null, 3)}`, "error");
      });
  };

  return (
    <BasePage>
      <AuthLayout
        title={"Sistema de cotización de perchas "}
        subtitle="Iniciar Sesión"
      >
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: GondolaAnimationLottie,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={window.innerHeight * 0.3}
          width={window.innerHeight * 0.3}
        />
        <form>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Correo"
                type="email"
                placeholder="correo@correo.com"
                fullWidth
                name="username"
                value={username}
                onChange={onInputChange}
                error={!!usernameValid}
                helperText={usernameValid}
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
                helperText={passwordValid}
              />
            </Grid>
            <Grid
              container
              justifyContent={"center"}
              spacing={2}
              sx={{ mb: 2, mt: 1 }}
            >
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onPressLogin}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </Grid>
            </Grid>
            <Grid container direction={"row"} justifyContent={"end"}>
              <Link
                component={RouterLink}
                color={"inherit"}
                to={"/auth/register"}
              >
                Crear una cuenta
              </Link>
            </Grid>
          </Grid>
        </form>
      </AuthLayout>
    </BasePage>
  );
};
