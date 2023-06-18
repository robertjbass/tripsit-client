import { useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import InputForm from "@/components/InputForm";
import Messages from "@/components/Messages";
import useChat from "@/hooks/useChat";
import { v4 } from "uuid";

const Chat = () => {
  const { sessionId, setSessionId } = useContext(GlobalContext);
  const { messages, isResponding, sendMessage, setPrompt, prompt } = useChat();

  useEffect(() => {
    if (sessionId) return;
    const uuid = v4();
    setSessionId(uuid);
  }, []);

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
