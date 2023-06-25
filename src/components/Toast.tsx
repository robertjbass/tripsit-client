import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const Toast = () => {
  const { toastMessage } = useContext(GlobalContext);

  const [messageToShow, setMessageToShow] = useState<string>("");

  useEffect(() => {
    if (!toastMessage) return;

    setMessageToShow(toastMessage);
  }, [toastMessage]);

  return (
    <div
      className={`fixed  w-full flex items-center justify-center transition-all duration-500 ease-in-out transform ${
        !!toastMessage
          ? "translate-y-0 opacity-100 bottom-10"
          : "translate-y-full opacity-0 -bottom-10"
      }`}
    >
      <div className="bg-blue-500 mx-auto p-4 rounded-md text-white text-center w-1/3 flex shadow-md">
        <span className="m-auto">{messageToShow}</span>
      </div>
    </div>
  );
};

export default Toast;
