import type { Message } from "@/context/types";

const Message = ({ message, key }: { message: Message; key: number }) => {
  return (
    <p
      key={key}
      className={[
        "text-lg mb-2",
        message.agent === "user" && "font-semibold",
      ].join(" ")}
    >
      {message.message}
    </p>
  );
};

const Messages = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="overflow-auto flex-grow bg-white rounded p-4">
      {messages.map((msg, i) => (
        <Message message={msg} key={i} />
      ))}
    </div>
  );
};

export default Messages;
