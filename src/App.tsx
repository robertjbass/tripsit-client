import { useContext, useEffect } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";
import Login from "@/components/Login";
import Toast from "@/components/Toast";

const Layout = () => {
  const { user } = useContext(GlobalContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      {user ? (
        <>
          <Navbar />
          <Chat />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

const App = () => {
  const { setUserDevice } = useContext(GlobalContext);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isiOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isAndroid) {
      setUserDevice("android");
    } else if (isiOS) {
      setUserDevice("ios");
    } else {
      setUserDevice("desktop");
    }
  }, []);

  return (
    <>
      <Layout />
      <Toast />
    </>
  );
};

export default App;
