import useChat from "../hooks/useChat";
import { useRef } from "react";

const Chat = () => {
  const { message, setMessage, chatHistory, chatContainerRef, sendMessage, resetChat } = useChat();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <h1 className="m-auto text-center w-3xl text-2xl my-20">
        AI Chat is an AI chatbot that writes text. You can use it to write stories, messages, or programming code. You can use the AI chatbot as a virtual tutor in almost any subject.
      </h1>

      <div className="bg-[#0B021E] py-2 px-10 w-6xl m-auto rounded-xl">
        <div ref={chatContainerRef} className="border-violet-950 p-4 flex flex-col-reverse h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 scroll-smooth">
          {chatHistory.map((chat, index) => (
            <div key={index} className="mb-2 flex flex-col">
              <div className="self-end">
                <p className="bg-[#1A024A] w-fit max-w-2xl px-4 py-2 rounded-md my-4">
                  {chat.user_message}
                </p>
              </div>
              <div className="self-start bg-[#1C1133] w-fit px-4 py-2 my-4 rounded-md max-w-2xl">
                <p>{chat.bot_response}</p>
              </div>
              <p className="text-sm text-gray-500">{new Date(chat.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex py-4">
          <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <textarea
              ref={inputRef}
              className="px-6 w-full bg-violet-950 text-white rounded-full resize-none min-h-[40px] max-h-[200px] overflow-y-auto p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
              Send
            </button>
            <button type="button" onClick={resetChat} className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition">
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
