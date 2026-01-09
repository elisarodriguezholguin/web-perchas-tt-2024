import { useBaseLocalStorage } from "./useBaseLocalStorage";

export const useLocalStorage = () => {
  const { SaveData, GetData } = useBaseLocalStorage();
  //#region LastPath
  const SaveLastPath = async (path: string) => await SaveData(path, "lastPath");
  const GetLastPath = async (): Promise<string> =>
    await GetData<string>("lastPath").then((path) =>
      (path ?? "").length === 0 ? "/" : path
    );
  //#endregion

  return { SaveLastPath, GetLastPath };
};
