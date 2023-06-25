import { useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const useToast = () => {
  const { toastMessage, setToastMessage } = useContext(GlobalContext);

  useEffect(() => {
    if (!toastMessage) return;

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }, [toastMessage]);

  const toast = (message: string) => {
    setToastMessage(message);
  };

  return { toast, toastMessage };
};

export default useToast;
