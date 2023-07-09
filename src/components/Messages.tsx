import { useEffect, useRef } from "react";
import type { Message } from "@/context/types";

const MessageComponent = ({ message }: { message: Message }) => {
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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="overflow-auto flex-grow bg-white rounded p-4">
      {messages.map((msg, i) => (
        <MessageComponent message={msg} key={i} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
