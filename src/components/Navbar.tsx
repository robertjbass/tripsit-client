import { useState, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";
import { TbInfinity, TbInfinityOff } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogOut, FiSettings } from "react-icons/fi";
import useFirebase from "@/hooks/useFirebase";
import Settings from "./Settings";

const Navbar = () => {
  const {
    isMuted,
    setIsMuted,
    isInfinateConversation,
    setIsInfinateConversation,
    showSettings,
    setShowSettings,
  } = useContext(GlobalContext);
  const { signOut } = useFirebase();

  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu((menuState) => !menuState);
    if (showSettings) {
      setShowSettings(false);
    }
  };

  const handleShowSettings = () => {
    setShowMenu(false);
    setShowSettings(true);
  };

  const menuButtons = [
    {
      text: "Settings",
      action: handleShowSettings,
      icon: <FiSettings className="my-auto" />,
    },
  ];

  const handleCloseOverlays = () => {
    setShowMenu(false);
    setShowSettings(false);
  };

  return (
    <>
      {(showMenu || showSettings) && (
        <div
          id="backdrop"
          onClick={handleCloseOverlays}
          className="absolute top-0 left-0 h-full w-full bg-black/20"
        />
      )}

      <Settings />
      <nav className="absolute top-0 right-0 w-1/2 p-4 flex justify-end gap-4 z-10">
        <button
          onClick={() => setIsInfinateConversation(!isInfinateConversation)}
          className={[
            "text-2xl",
            !isInfinateConversation ? "text-red-500/80" : "hover:opacity-50",
          ].join(" ")}
        >
          {isInfinateConversation ? <TbInfinity /> : <TbInfinityOff />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={[
            "text-2xl",
            isMuted ? "text-red-500/80" : "hover:opacity-50",
          ].join(" ")}
        >
          {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
        </button>
        <button
          onClick={handleToggleMenu}
          className="text-2xl hover:opacity-50"
        >
          <GiHamburgerMenu />
        </button>
      </nav>

      <div
        id="sidebar"
        className={`fixed top-0 right-0 h-full transition-all duration-300 ease-in-out ${
          showMenu ? "w-64" : "w-0"
        } overflow-hidden bg-white  shadow-lg pt-4`}
      >
        <div className="py-4 mt-6 flex flex-col justify-between h-full pb-10">
          <div className="flex flex-col gap-4 overflow-y-auto shadow-inner bg-gray-50/10 p-4">
            {menuButtons.map((button) => (
              <button
                key={button.text}
                onClick={button.action}
                className="flex text-2xl hover:text-gray-500 transition-colors"
              >
                {button.icon}
                <span className="my-auto ml-2">{button.text}</span>
              </button>
            ))}
          </div>
          <button
            onClick={signOut}
            className="flex mt-4 px-4 text-2xl hover:text-gray-500 transition-colors"
          >
            <FiLogOut className="my-auto" />
            <span className="my-auto ml-2">Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
