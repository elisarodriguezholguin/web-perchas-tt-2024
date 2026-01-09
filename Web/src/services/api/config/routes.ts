const ServerUrl = {
  qa:
    process.env.NODE_ENV === "development"
      ? "http://anaquishpe-001-site1.etempurl.com"
      : "",
  produccion: "https://localhost:7266",
  local: "https://localhost:7266",
};

export const BASE_URL: string = ServerUrl.qa;
export const BASE_API: string = "/api";
//* Controllers
export const SECURITY_BASE_URL = `${BASE_API}/Security`;
export const CATALOGO_BASE_URL = `${BASE_API}/Catalogo`;
export const COTIZACION_BASE_URL = `${BASE_API}/Cotizacion`;

//* Endpoints
export const SECURITY_ENDPOINTS = {
  LOGIN: `${SECURITY_BASE_URL}/login`,
  REGISTER: `${SECURITY_BASE_URL}/register`,
  CHANGE_PASSWORD: `${SECURITY_BASE_URL}/changePassword`,
  FORGET_PASSWORD: `${SECURITY_BASE_URL}/forgetPassword`,
  UPDATE_USER_INFO: `${SECURITY_BASE_URL}/UpdateUserInfo`,
};

type enviromentType = "Producción" | "Desarrollo" | "Local";

export const checkEnviroment: enviromentType =
  BASE_URL === ServerUrl.local
    ? "Local"
    : BASE_URL === ServerUrl.qa
    ? "Desarrollo"
    : "Producción";
