import type { Message } from "@/context/types";

const Message = ({ message }: { message: Message }) => {
  return (
    <p
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
