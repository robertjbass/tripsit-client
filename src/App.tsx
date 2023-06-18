import { useState } from "react";
import Chat from "@/components/Chat";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";

const App = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <nav className="absolute top-0 p-4 flex justify-end w-full">
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="text-2xl"
        >
          {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
        </button>
      </nav>
      <Chat isMuted={isMuted} />
    </div>
  );
};

export default App;
