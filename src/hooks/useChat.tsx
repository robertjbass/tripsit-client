import useApi from "@/hooks/useApi";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { v4 } from "uuid";
import type { Message } from "@/context/types";
import { general } from "@/context/options";

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");
  const [sentencesToRead, setSentencesToRead] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [allAudioHasPlayed, setAllAudioHasPlayed] = useState<boolean>(false);
  const {
    apiUrl,
    isMuted,
    sessionId,
    setSessionId,
    systemMessage,
    setSystemMessage,
  } = useContext(GlobalContext);

  const api = useApi();

  //* Create a session ID if one does not exist
  useEffect(() => {
    if (sessionId) return;

    const uuid = v4();
    setSessionId(uuid);
  }, []);

  useEffect(() => {
    setSystemMessage(general);
  }, []);

  useEffect(() => {
    if (
      isResponding ||
      isSpeaking ||
      sentencesToRead.length > 0 ||
      currentSentence.length > 0
    ) {
      setAllAudioHasPlayed(false);
    } else {
      setAllAudioHasPlayed(true);
    }
  }, [isResponding, isSpeaking, sentencesToRead, currentSentence]);

  useEffect(() => {
    if (!systemMessage) return;

    api.post("/set-prompt", { sessionId, systemMessage });
  }, [systemMessage, sessionId]);

  //* Connect to the SSE endpoint and listen for messages
  //? Format and update message state as they stream in
  useEffect(() => {
    if (!sessionId) return;

    const source = new EventSource(apiUrl + `/connect?session_id=${sessionId}`);

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
  }, [sessionId]);

  //* If muted while speaking, prevent the next sentence from being read
  useEffect(() => {
    if (!isMuted) return;

    setSentencesToRead([]);
    setCurrentSentence("");
  }, [isMuted]);

  //* Add a sentence to the list of sentences to read
  useEffect(() => {
    const secondLastCharIsNotNumber = isNaN(
      Number(currentSentence[currentSentence.length - 2])
    );

    const endsWithPeriod =
      currentSentence.endsWith(".") && secondLastCharIsNotNumber;

    const endsWithQuestionMark = currentSentence.endsWith("?");

    if (endsWithQuestionMark || endsWithPeriod) {
      setSentencesToRead((prev) => [...prev, currentSentence]);
      setCurrentSentence("");
    }
  }, [currentSentence]);

  //* Process the tts queue when the speaking state changes
  useEffect(() => {
    processTtsQueue();
  }, [isSpeaking, sentencesToRead]);

  //? Send a sentence to the backend for processing and play mp3 response
  const convertTextToAudioUrl = async (
    text: string
  ): Promise<{ audioUrl: string | null }> => {
    try {
      const { data } = await api.post("/synthesize", { sentence: text });
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        {
          type: "audio/mp3",
        }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      return { audioUrl };
    } catch (error) {
      console.error(error);
      return { audioUrl: null };
    }
  };

  //? Generate an audio url from string and play it
  const say = async (str: string) => {
    if (isMuted) return;
    setIsSpeaking(true);

    const { audioUrl } = await convertTextToAudioUrl(str);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setIsSpeaking(false);
    };
    audio.onerror = () => {
      console.error("Audio playback failed");
      setIsSpeaking(false);
    };
    audio.play();
  };

  //* Prompt the backend to generate a new response with SSE
  const sendMessage = async (e?: any) => {
    if (e) e.preventDefault();
    if (!prompt) return;

    setIsResponding(true);
    setMessages((prev) => [...prev, { agent: "user", message: prompt }]);
    setPrompt("");
    await api.post("/message", { message: prompt });
  };

  const processTtsQueue = async () => {
    if (isSpeaking || sentencesToRead.length === 0) return;

    const nextSentence = sentencesToRead[0];
    setSentencesToRead((prev) => prev.slice(1));
    await say(nextSentence);
  };

  return {
    messages,
    isResponding,
    sendMessage,
    setPrompt,
    prompt,
    isSpeaking: !allAudioHasPlayed && isSpeaking,
    allAudioHasPlayed,
  };
};

export default useChat;
