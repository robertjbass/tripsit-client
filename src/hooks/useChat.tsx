import { Message } from "@/context/types";
import useApi from "@/hooks/useApi";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

const useChat = () => {
  const api = useApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");
  const [sentencesToRead, setSentencesToRead] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { apiUrl, isMuted } = useContext(GlobalContext);

  //* Connect to the SSE endpoint and listen for messages
  //? Format and update message state as they stream in
  useEffect(() => {
    const source = new EventSource(apiUrl + "/connect");

    source.onmessage = (event) => {
      const eventData = event.data;

      if (event.data === "[DONE]") {
        setIsResponding(false);
        return;
      }

      //? Trigger a effect to add sentence to the tts queue
      setCurrentSentence((prev) => {
        if (!prev) return eventData;
        return prev + eventData;
      });

      //? setTimout prevents message from being added to messages before the current sentence updates
      setTimeout(() => {
        setMessages((prev) => {
          //? Add new user message object to the array
          if (prev[prev.length - 1].agent === "user") {
            return [...prev, { agent: "assistant", message: eventData }];
          }

          //? Update streaming response message object with new data
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

  //* If muted while speaking, prevent the next sentence from being read
  useEffect(() => {
    if (!isMuted) return;
    setSentencesToRead([]);
    setCurrentSentence("");
  }, [isMuted]);

  //* Add a sentence to the list of sentences to read
  useEffect(() => {
    if (
      currentSentence[currentSentence.length - 1] === "." ||
      currentSentence[currentSentence.length - 1] === "?"
    ) {
      setSentencesToRead((prev) => [...prev, currentSentence]);
      setCurrentSentence("");
    }
  }, [currentSentence]);

  //* Process the tts queue when the speaking state changes
  useEffect(() => {
    processTtsQueue();
  }, [isSpeaking, sentencesToRead]);

  // const convertTextToAudio = async (text: string) => {};

  //? Send a sentence to the backend for processing and play mp3 response
  const say = async (str: string) => {
    if (isMuted) return;
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

  //* Prompt the backend to generate a new response
  //? SSE endpoint will stream the response back
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!prompt) return;

    setIsResponding(true);
    setMessages((prev) => [...prev, { agent: "user", message: prompt }]);
    setPrompt("");
    await api.post("/message", { message: prompt });
  };

  const processTtsQueue = () => {
    if (isSpeaking || sentencesToRead.length === 0) return;

    const nextSentence = sentencesToRead[0];
    say(nextSentence);
    setSentencesToRead((prev) => prev.slice(1));
  };

  return {
    messages,
    isResponding,
    sendMessage,
    setPrompt,
    prompt,
  };
};

export default useChat;
