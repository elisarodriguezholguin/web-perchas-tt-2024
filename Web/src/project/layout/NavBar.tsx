import {
  MenuOutlined,
  LogoutOutlined,
  History,
  Person,
  AppRegistration,
  Tune,
  AddShoppingCart,
  InfoRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../shared";
import { useState } from "react";
import { ModalWithSteps } from "./ModalWithSteps";

export const NavBar = () => {
  const {
    jwtInfo: { firstName, lastName, rolName, visitedInstruction },
    onSetVisitedInstruction,
    onLogOut,
  } = useAuthStore();
  const [isVisible, setIsVisible] = useState(!visitedInstruction);

  const navigate = useNavigate();

  const onPressLogOut = onLogOut;

  // Opciones comunes para todos los usuarios
  const commonOptions = [
    { label: "Perfil", path: "/profile", icon: <Person /> },
  ];

  // Opciones específicas para usuarios no administradores
  const userOptions = [
    {
      label: "Perchas Prefabricadas",
      path: "/home",
      icon: <AddShoppingCart />,
    },
    {
      label: "Perchas Personalizadas",
      path: "/custom",
      icon: <Tune />,
    },
    { label: "Historial", path: "/history", icon: <History /> },
  ];

  // Opciones específicas para administradores
  const adminOptions = [
    { label: "Historial", path: "/billHistory", icon: <History /> },
    {
      label: "Registrar Nueva textura",
      path: "/registerTexture",
      icon: <AppRegistration />,
    },
  ];

  // Combina las opciones según el rol
  const options =
    rolName === "Administrador"
      ? [...adminOptions, ...commonOptions]
      : [...userOptions, ...commonOptions];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuOutlined />
          </IconButton>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Left Side: Avatar and Options */}
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "background.paper",
                    p: 1,
                    borderRadius: 1,
                    color: "primary.main",
                    mr: 2,
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: "primary.main", color: "white", mr: 1 }}
                  >
                    {firstName.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" noWrap component="div">
                    {`${firstName} ${lastName}`}
                  </Typography>
                </Box>
                {options.map((option) => (
                  <Button
                    key={option.label}
                    startIcon={option.icon}
                    variant="text"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      ml: 2,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    onClick={() => navigate(option.path)}
                  >
                    {option.label}
                  </Button>
                ))}
                {rolName === "Usuario" && (
                  <Button
                    startIcon={<InfoRounded />}
                    variant="text"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      ml: 2,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    onClick={() => setIsVisible(true)}
                  >
                    Instrucciones
                  </Button>
                )}
              </Box>
            </Grid>
            {/* Right Side: Logout Button */}
            <Grid item>
              <Button color="inherit" onClick={onPressLogOut}>
                <LogoutOutlined /> Cerrar Sesion
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <ModalWithSteps
        open={isVisible}
        onClose={() => {
          onSetVisitedInstruction();
          setIsVisible(false);
        }}
      />
    </>
  );
};
