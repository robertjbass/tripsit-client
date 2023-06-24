import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { GoChevronRight } from "react-icons/go";

const Settings = () => {
  const { showSettings, setShowSettings } = useContext(GlobalContext);

  return (
    <div
      id="settings"
      className={`fixed top-0 bottom-0 right-0 transition-all duration-500 ease-in-out bg-white shadow-lg border-l-2 border-gray-200 ${
        showSettings ? "w-full" : "w-0"
      } overflow-hidden`}
    >
      <div className="p-4 flex">
        <button
          className="text-2xl hover:text-gray-500 transition-colors flex z-50"
          onClick={() => setShowSettings(false)}
        >
          <GoChevronRight className="my-auto" />
          <span className="text-xl w-full my-auto ml-2">Settings</span>
        </button>
      </div>

      <section className="w-full flex flex-col justify-between h-full pb-20 overflow-y-auto">
        <div
          id="settings"
          className="h-full overflow-y-auto shadow-inner bg-gray-50/10 p-2 mb-4 pb-14 px-8"
        >
          <div id="prompt" className="flex flex-col h-1/2 my-2">
            <strong className="mb-2 text-lg">Prompt</strong>
            <textarea className="h-full border-2 rounded p-4 resize-none focus:outline-none focus:border-blue-400 transition-colors"></textarea>
          </div>
        </div>

        <div
          id="actions"
          className="flex absolute bottom-0 w-full h-20 bg-white shadow-inner justify-end items-center pr-8"
        >
          <button
            onClick={() => setShowSettings(false)}
            className="border-2 border-gray-300 rounded h-12 w-24 mx-2 hover:border-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button className="rounded h-12 w-24 mx-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
