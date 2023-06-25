import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { GoChevronRight } from "react-icons/go";
import { tripsitter, boundries, general } from "@/context/options";
import useToast from "@/hooks/useToast";

const Settings = () => {
  const [systemMessageInput, setSystemMessageInput] = useState<string>("");
  const { showSettings, setShowSettings, systemMessage, setSystemMessage } =
    useContext(GlobalContext);
  const { toast } = useToast();

  const canSave =
    systemMessageInput !== systemMessage && systemMessageInput.length > 0;

  useEffect(() => {
    setSystemMessageInput(systemMessage);
  }, [systemMessage]);

  const handleSaveSystemMessage = () => {
    if (!canSave) return;

    toast("Updated Prompt");

    setSystemMessage(systemMessageInput);
    setShowSettings(false);
  };

  return (
    <div
      id="settings"
      className={`fixed top-0 bottom-0 right-0 transition-all duration-500 ease-in-out bg-white shadow-lg border-l-2 border-gray-200 ${
        showSettings ? "w-full" : "w-0"
      } overflow-hidden`}
    >
      <div
        className={`p-4 flex transition-opacity duration-500 ease-in-out ${
          showSettings ? "opacity-100" : "opacity-0"
        }`}
      >
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
            <textarea
              value={systemMessageInput}
              onChange={(e) => setSystemMessageInput(e.target.value)}
              className="h-full border-2 rounded p-4 resize-none focus:outline-none focus:border-blue-400 transition-colors"
            ></textarea>
          </div>

          <div id="presets" className="flex gap-4">
            <button
              className="rounded h-12 w-24 text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={() => setSystemMessageInput(general)}
            >
              General
            </button>
            <button
              className="rounded h-12 w-24 text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={() => setSystemMessageInput(tripsitter)}
            >
              Tripsitter
            </button>
            <button
              className="rounded h-12 w-24 text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={() => setSystemMessageInput(boundries)}
            >
              Boundries
            </button>
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
          <button
            disabled={!canSave}
            onClick={handleSaveSystemMessage}
            className={`rounded h-12 w-24 mx-2 text-white transition-colors ${
              canSave
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
