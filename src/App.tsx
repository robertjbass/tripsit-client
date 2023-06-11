import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import useApi from "@/hooks/useApi";

type Message = {
  agent: "user" | "assistant";
  message: string;
};

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");

  const { apiUrl } = useContext(GlobalContext);
  const api = useApi();

  useEffect(() => {
    const source = new EventSource(apiUrl + "/connect");

    source.onmessage = (event) => {
      const eventData = event.data;

      if (event.data === "[DONE]") {
        setIsResponding(false);
        return;
      }

      setTimeout(() => {
        setMessages((prev) => {
          if (prev[prev.length - 1].agent === "user") {
            return [...prev, { agent: "assistant", message: eventData }];
          }

          const lastMessage = prev[prev.length - 1].message;
          const prevMinusLast = prev.slice(0, prev.length - 1);
          const newMessage: Message = {
            agent: "assistant",
            message: lastMessage + eventData,
          };
          return [...prevMinusLast, newMessage];
        });
      }, 0);
    };

    return () => source.close();
  }, []);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!prompt) return;

    setIsResponding(true);
    setMessages((prev) => [...prev, { agent: "user", message: prompt }]);
    setPrompt("");
    await api.post("/message", { message: prompt });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <section className="h-3/4 w-3/4">
        <div className="overflow-auto h-1/2 bg-white rounded-xl p-4 shadow-lg">
          {messages.map((message, i) => (
            <p
              key={i}
              className={[
                "text-lg mb-2",
                message.agent === "user" && "font-semibold",
              ].join(" ")}
            >
              {message.message}
            </p>
          ))}
        </div>

        <form onSubmit={sendMessage} className="mt-8 flex w-full">
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="mr-4 rounded flex-grow"
            type="text"
            value={prompt}
          />
          <button
            disabled={isResponding}
            type="submit"
            className={[
              "text-white font-bold py-2 px-4 rounded",
              isResponding
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-700 cursor-not-allowed",
            ].join(" ")}
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
