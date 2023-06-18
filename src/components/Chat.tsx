import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import InputForm from "@/components/InputForm";
import Messages from "@/components/Messages";
import useChat from "@/hooks/useChat";

const Chat = () => {
  const { messages, isResponding, sendMessage, setPrompt, prompt } = useChat();
  const { sessionId } = useContext(GlobalContext);

  if (!sessionId) return <div>loading...</div>;

  return (
    <section className="h-3/4 w-3/4 flex flex-col">
      <Messages messages={messages} />
      <InputForm
        sendMessage={sendMessage}
        isResponding={isResponding}
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </section>
  );
};

export default Chat;
