import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "..";

export const useAppStore = () => {
  //*Auth
  const auth = useSelector((store: RootState) => store.auth);
  //*Bill
  const bill = useSelector((store: RootState) => store.bill);
  //*Catalog
  const catalog = useSelector((store: RootState) => store.catalog);
  //*Gondola
  const gondola = useSelector((store: RootState) => store.gondola);
  const dispatch = useDispatch<AppDispatch>();
  return { auth, bill, catalog, gondola, dispatch };
};
