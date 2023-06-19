import { useState, useEffect, useContext } from "react";
import { IoMdSend } from "react-icons/io";
import { BsFillMicFill, BsFillStopCircleFill } from "react-icons/bs";
import { GlobalContext } from "@/context/GlobalContext";

type InputFormProps = {
  sendMessage: (e?: any) => void;
  isResponding: boolean;
  prompt: string;
  setPrompt: (str: string) => void;
};

interface ISpeechRecognitionWindow extends Window {
  // @ts-ignore
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
  mozSpeechRecognition: typeof SpeechRecognition;
  msSpeechRecognition: typeof SpeechRecognition;
}

const {
  // @ts-ignore
  SpeechRecognition = window.SpeechRecognition ||
    // @ts-ignore
    window.webkitSpeechRecognition ||
    // @ts-ignore
    window.mozSpeechRecognition ||
    // @ts-ignore
    window.msSpeechRecognition,
} = window as unknown as ISpeechRecognitionWindow;

const InputForm = ({
  sendMessage,
  isResponding,
  prompt,
  setPrompt,
}: InputFormProps) => {
  const { isInfinateConversation } = useContext(GlobalContext);
  const [isListening, setIsListening] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  //* If done listening and prompt exists, send message
  useEffect(() => {
    if (isListening) return;
    if (prompt.length > 0) sendMessage();
  }, [isListening]);

  //* Handle continuous conversation
  useEffect(() => {
    if (isResponding || !userHasInteracted) return;

    if (isInfinateConversation) handleListening();
  }, [isResponding]);

  const handleListening = () => {
    setUserHasInteracted(true);
    if (isListening) setIsListening(false);

    setIsListening((prev) => !prev);
    let finalTranscript = "";
    let speechRecognition = new SpeechRecognition();

    try {
      speechRecognition.onstart = () => {
        console.log("Speech recognition service has started");
      };

      speechRecognition.onresult = (event: any) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        setPrompt(finalTranscript + interimTranscript);
      };

      speechRecognition.onerror = (event: any) => {
        console.log("Error occurred in recognition: " + event.error);
      };

      speechRecognition.onend = () => {
        speechRecognition.stop();
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      finalTranscript = "";
      speechRecognition.start();
      console.log("Listening...");
    } catch (error) {
      speechRecognition.stop();
      console.error(error);
      setIsListening(false);
    }
  };

  const sendButtonDisabled = isResponding || isListening || prompt.length === 0;
  const recordButtonDisabled = isResponding || prompt.length > 0;

  return (
    <form
      onSubmit={sendMessage}
      className="mt-4 grid grid-flow-row md:grid-cols-3 sm:grid-cols-1 gap-4 transition-all"
    >
      <input
        onChange={(e) => setPrompt(e.target.value)}
        className="rounded px-4 sm:col-span-1 md:col-span-2 h-12 w-full"
        type="text"
        value={prompt}
      />
      <div className="sm:col-span-1 md:col-span-1 flex gap-4">
        <button
          disabled={sendButtonDisabled}
          type="submit"
          className={[
            "text-white font-bold py-2 px-4 rounded h-12 w-full",
            sendButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700",
          ].join(" ")}
        >
          <IoMdSend className="inline ml-2" />
        </button>
        <button
          disabled={recordButtonDisabled}
          onClick={handleListening}
          type="button"
          className={[
            "text-white font-bold py-2 px-4 rounded h-12 w-full",
            isResponding
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700",
          ].join(" ")}
        >
          {!isListening ? (
            <BsFillMicFill className="inline ml-2" />
          ) : (
            <BsFillStopCircleFill className="inline ml-2 animate-pulse" />
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
