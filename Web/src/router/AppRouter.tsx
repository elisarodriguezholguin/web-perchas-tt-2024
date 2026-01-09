import { useEffect, useMemo } from "react";
import { AuthRouter } from "../auth";
import { useAuthStore } from "../shared";
import { LoadingScreen } from "../theme";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../data";
import { AdminRouter, ProjectRouter } from "../project";

export const AppRouter = () => {
  const { SaveLastPath } = useLocalStorage();
  const { pathname, search } = useLocation();
  useMemo(
    async () => await SaveLastPath(pathname + search),
    [pathname, search, SaveLastPath]
  );

  const {
    status,
    jwtInfo: { token, rolName },
    onChecking,
  } = useAuthStore();
  useEffect(() => {
    onChecking();
  }, []);

  if (status === "checking") return <LoadingScreen />;

  return (
    <>
      {status === "not-authenticated" && token.length === 0 ? (
        <AuthRouter />
      ) : rolName === "Administrador" ? (
        <AdminRouter />
      ) : (
        <ProjectRouter />
      )}
    </>
  );
};
