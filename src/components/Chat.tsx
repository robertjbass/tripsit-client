import InputForm from "@/components/InputForm";
import Messages from "@/components/Messages";
import useChat from "@/hooks/useChat";

const Chat = ({ isMuted }: { isMuted: boolean }) => {
  const { messages, isResponding, sendMessage, setPrompt, prompt } =
    useChat(isMuted);

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
