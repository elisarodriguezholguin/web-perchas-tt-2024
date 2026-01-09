import { useBaseLocalStorage } from "../../data";
import { JWTInfo } from "../interfaces";

export const useAuthStorage = () => {
  const { SaveData, GetData, RemoveData, CheckData } = useBaseLocalStorage();

  const SaveJWTInfo = async (user: JWTInfo) => await SaveData(user, "user");
  const GetJWTInfo = async (): Promise<JWTInfo> =>
    await GetData<JWTInfo>("user");
  const CheckJWTInfo = async (): Promise<boolean> => await CheckData("user");
  const DeleteJWTInfo = async () => await RemoveData(["user"]);

  return { SaveJWTInfo, GetJWTInfo, CheckJWTInfo, DeleteJWTInfo };
};
