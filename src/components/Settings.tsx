import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { GoChevronDown } from "react-icons/go";

const Settings = () => {
  const { showSettings, setShowSettings } = useContext(GlobalContext);

  return (
    <>
      {showSettings && (
        <div
          id="backdrop"
          onClick={() => setShowSettings(false)}
          className="fixed top-0 left-0 h-full w-full bg-black/20"
        />
      )}

      <div
        id="settings"
        className={`fixed bottom-0 right-0 left-0 transition-all duration-300 ease-in-out ${
          showSettings ? "h-full pt-8 " : "h-0"
        } overflow-hidden bg-white shadow-lg `}
      >
        <div className="p-4 flex">
          <button
            className="text-2xl hover:opacity-50 flex"
            onClick={() => setShowSettings(false)}
          >
            <GoChevronDown className="my-auto" />
            <span className="text-xl w-full my-auto ml-2">Settings</span>
          </button>
        </div>

        <section className="w-full flex flex-col justify-between h-full pb-20 overflow-y-auto">
          <div
            id="settings"
            className="h-full overflow-y-auto shadow-inner bg-gray-50/10 p-2 mb-4 pb-14"
          >
            {/* add more settings like this, the overflow will handle the scrolling */}
            <div id="prompt" className="flex flex-col h-1/2 my-2">
              <strong className="mb-2">Prompt</strong>
              <textarea className="h-full border-2 rounded p-4 resize-none"></textarea>
            </div>
          </div>

          <div
            id="actions"
            className="flex absolute bottom-0 w-full h-20 bg-white shadow-inner justify-end"
          >
            <button
              onClick={() => setShowSettings(false)}
              className="border-2 rounded h-12 w-24 my-auto mx-2"
            >
              Cancel
            </button>
            <button className="border-2 rounded h-12 w-24 my-auto mx-2">
              Save
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Settings;
