import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import InputForm from "@/components/InputForm";
import Messages from "@/components/Messages";
import useChat from "@/hooks/useChat";

const Chat = () => {
  const {
    isResponding,
    sendMessage,
    setPrompt,
    prompt,
    messages,
    allAudioHasPlayed,
  } = useChat();

  const { sessionId } = useContext(GlobalContext);

  if (!sessionId) return <div>loading...</div>;

  return (
    <section className="h-3/4 w-3/4 flex flex-col">
      <Messages messages={messages} />
      <InputForm
        allAudioHasPlayed={allAudioHasPlayed}
        sendMessage={sendMessage}
        isResponding={isResponding}
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </section>
  );
};

export default Chat;
