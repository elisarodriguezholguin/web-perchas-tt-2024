import { JWTInfo, useAuthStorage } from "../../auth";
import { sleep } from "../../helpers";
import {
  checking,
  login,
  logout,
  setUpdateUserInfo,
  setVisitedInstruction,
} from "../auth";
import { useAppStore } from "./useAppStore";

export const useAuthStore = () => {
  const { SaveJWTInfo, GetJWTInfo, CheckJWTInfo, DeleteJWTInfo } =
    useAuthStorage();
  const {
    auth: { status, jwtInfo },
    dispatch,
  } = useAppStore();

  const onLogin = async (jwtInfo: JWTInfo) => {
    await SaveJWTInfo(jwtInfo).then(() => dispatch(login(jwtInfo)));
  };

  const onLogOut = async () =>
    await DeleteJWTInfo().then(() => dispatch(logout()));

  const onChecking = async () => {
    dispatch(checking());
    await sleep(2).then(
      async () =>
        await CheckJWTInfo().then(
          async (check) =>
            await GetJWTInfo().then((jwtInfo) =>
              check ? dispatch(login(jwtInfo)) : dispatch(logout())
            )
        )
    );
  };

  const onUpdateUserInfo = async (userInfo: JWTInfo) => {
    await SaveJWTInfo({
      ...jwtInfo,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      userName: userInfo.userName,
      direccion: userInfo.direccion,
      cedula: userInfo.cedula,
      telefono: userInfo.telefono,
    }).then(() => dispatch(setUpdateUserInfo(userInfo)));
  };

  const onSetVisitedInstruction = async () =>
    await SaveJWTInfo({ ...jwtInfo, visitedInstruction: true }).then(() =>
      dispatch(setVisitedInstruction())
    );

  return {
    status,
    jwtInfo,
    onLogin,
    onLogOut,
    onChecking,
    onUpdateUserInfo,
    onSetVisitedInstruction,
  };
};
