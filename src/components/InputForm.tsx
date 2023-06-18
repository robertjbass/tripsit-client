type InputFormProps = {
  sendMessage: (e: any) => void;
  isResponding: boolean;
  prompt: string;
  setPrompt: (str: string) => void;
};

const InputForm = ({
  sendMessage,
  isResponding,
  prompt,
  setPrompt,
}: InputFormProps) => {
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
      <button
        disabled={isResponding}
        type="submit"
        className={[
          "text-white font-bold py-2 px-4 rounded sm:col-span-1 md:col-span-1 h-12",
          isResponding
            ? "bg-gray-300"
            : "bg-blue-500 hover:bg-blue-700 cursor-not-allowed",
        ].join(" ")}
      >
        Send Message
      </button>
    </form>
  );
};

export default InputForm;
