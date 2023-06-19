import { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { BsFillMicFill } from "react-icons/bs";

type InputFormProps = {
  sendMessage: (e: any) => void;
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
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    console.log(transcript);
    setPrompt(transcript);
  }, [transcript]);

  useEffect(() => {
    let finalTranscript = "";
    let speechRecognition = new SpeechRecognition();

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
      setTranscript(finalTranscript + interimTranscript);
    };

    speechRecognition.onerror = (event: any) => {
      console.log("Error occurred in recognition: " + event.error);
    };

    if (isListening) {
      finalTranscript = "";
      speechRecognition.start();
      console.log("Listening...");
    } else {
      speechRecognition.stop();
      console.log("Stopped Listening");
    }

    return () => {
      speechRecognition.stop();
    };
  }, [isListening]);

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
          disabled={isResponding}
          type="submit"
          className={[
            "text-white font-bold py-2 px-4 rounded h-12 w-full",
            isResponding
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-700 cursor-not-allowed",
          ].join(" ")}
        >
          <IoMdSend className="inline ml-2" />
        </button>
        <button
          disabled={isResponding}
          onClick={() => setIsListening((prevState) => !prevState)}
          type="button"
          className={[
            "text-white font-bold py-2 px-4 rounded h-12 w-full",
            isResponding
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-700 cursor-not-allowed",
          ].join(" ")}
        >
          <BsFillMicFill className="inline ml-2" />
        </button>
      </div>
    </form>
  );
};

export default InputForm;
