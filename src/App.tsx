import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import useApi from "@/hooks/useApi";

const App = () => {
  const [sentences, setSentences] = useState("");
  const [message, setMessage] = useState("");

  const { apiUrl } = useContext(GlobalContext);
  const api = useApi();

  useEffect(() => {
    const source = new EventSource(apiUrl + "/connect");

    source.onmessage = (event) => {
      const eventData = event.data;
      setSentences((prev) => [...prev, eventData].join(""));
    };

    return () => {
      source.close();
    };
  }, []);

  const sendMessage = async () => {
    await api.post("/message", { message });
    setSentences((prev) => [...prev, message].join(""));
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <section className="h-3/4 w-3/4">
        <div className="overflow-auto h-1/2 bg-white rounded-xl p-4 shadow-lg">
          <p className="text-lg mb-2">{sentences}</p>
        </div>

        <div className="mt-8 flex w-full">
          <input
            onChange={(e) => setMessage(e.target.value)}
            className="mr-4 rounded flex-grow"
            type="text"
            value={message}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
