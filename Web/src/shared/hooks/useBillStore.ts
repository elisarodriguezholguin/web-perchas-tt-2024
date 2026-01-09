import { BillApiHistory } from "../../project";
import { setBillsHistory } from "../bill";
import { useAppStore } from "./useAppStore";

export const useBillStore = () => {
  const {
    bill: { billsHistory },
    dispatch,
  } = useAppStore();

  const onSetBillsHistory = (bills: BillApiHistory[]) => {
    dispatch(setBillsHistory(bills));
  };

  return { billsHistory, onSetBillsHistory };
};
