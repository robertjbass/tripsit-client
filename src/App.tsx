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
  const [sentencesToRead, setSentencesToRead] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { apiUrl } = useContext(GlobalContext);
  const api = useApi();

  const say = async (str: string) => {
    setIsSpeaking(true);
    try {
      const { data } = await api.post("/synthesize", { sentence: str });
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        {
          type: "audio/mp3",
        }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        console.error("Audio playback failed");
        setIsSpeaking(false);
      };
      audio.play();
    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (
      currentSentence[currentSentence.length - 1] === "." ||
      currentSentence[currentSentence.length - 1] === "?"
    ) {
      setSentencesToRead((prev) => [...prev, currentSentence]);
      setCurrentSentence("");
    }
  }, [currentSentence]);

  const processSentenceQueue = () => {
    if (isSpeaking || sentencesToRead.length === 0) return;

    const nextSentence = sentencesToRead[0];
    say(nextSentence);
    setSentencesToRead((prev) => prev.slice(1));
  };

  useEffect(() => {
    processSentenceQueue();
  }, [isSpeaking, sentencesToRead]);

  useEffect(() => {
    const source = new EventSource(apiUrl + "/connect");

    source.onmessage = (event) => {
      const eventData = event.data;

      if (event.data === "[DONE]") {
        setIsResponding(false);
        return;
      }

      setCurrentSentence((prev) => {
        if (!prev) return eventData;

        return prev + eventData;
      });

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
