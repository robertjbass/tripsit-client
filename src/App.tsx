import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";
import Chat from "@/components/Chat";

const App = () => {
  const { isMuted, setIsMuted } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <nav className="absolute top-0 p-4 flex justify-end w-full">
        <button onClick={() => setIsMuted(!isMuted)} className="text-2xl">
          {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
        </button>
      </nav>
      <Chat />
    </div>
  );
};

export default App;
