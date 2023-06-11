import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const App = () => {
  const { user, setUser, apiUrl } = useContext(GlobalContext);
  return (
    <>
      <div className="text-xl">API URL: {apiUrl}</div>
      {user && <div className="text-3xl">{JSON.stringify(user, null, 2)}</div>}
      <button
        className="border-2 px-2 py-1 rounded-full"
        onClick={() => setUser({ name: "Bob", age: 32 })}
      >
        Set Bob
      </button>
    </>
  );
};

export default App;
