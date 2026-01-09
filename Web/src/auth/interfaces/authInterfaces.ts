export type AuthStatusType = "checking" | "not-authenticated" | "authenticated";
export type AuthRoleType = "Administrador" | "Usuario";
export interface JWTInfo {
  token: string;
  expiracion: string;
  rolName: AuthRoleType;
  userName: string;
  firstName: string;
  lastName: string;
  direccion: string;
  cedula: string;
  telefono: string;
  visitedInstruction?: boolean;
}

export interface AuthInfo {
  jwtInfo: JWTInfo;
  status: AuthStatusType;
}

export interface LoginInfo {
  username: string;
  password: string;
}

export interface RegisterInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  direccion: string;
  telefono: string;
  cedula: string;
  password: string;
  idRol: string;
}
