import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "../pages";

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="auth/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to={"/auth/login"} />} />
      <Route path="/*" element={<Navigate to={"/auth/login"} />} />
    </Routes>
  );
};
