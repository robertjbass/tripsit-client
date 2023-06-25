import { useContext } from "react";
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
  return (
    <>
      <Layout />
      <Toast />
    </>
  );
};

export default App;
