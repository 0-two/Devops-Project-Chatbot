import React from 'react';
import axios from 'axios';
import { useState, useRef, useEffect} from 'react';
import { FaUserCircle } from 'react-icons/fa';

function Bot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading,setLoading] = useState(false);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});},[messages])

    const handleSendMessage = async () => {
      const trimmedInput = input.trim();

      if(!trimmedInput || loading) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        { text: trimmedInput, sender: 'user' }
      ]);

      setInput("");
      setLoading(true);
        try{
            const res = await axios.post("/api/bot/v1/message",{
          text: trimmedInput
            })
            if(res.status===200){
          setMessages((currentMessages) => [
            ...currentMessages,
            { text: res.data.botResponse, sender: 'bot'}
          ])
            }
            console.log(res.data);
        }
        catch(error){
          console.log("Error sending message:", error);
        }
        setLoading(false);
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') handleSendMessage()
    }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4e9d8] text-[#111111]">
      <header className="fixed left-0 top-0 z-20 w-full border-b-4 border-[#111111] bg-[#ffde59]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-[#111111] bg-[#7ee787] shadow-[4px_4px_0_#111111]">
              <span className="text-lg font-black">B</span>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wide">BotX</h1>
              <p className="text-sm font-semibold">Neobrutal chat</p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center border-4 border-[#111111] bg-[#ff8a5b] shadow-[4px_4px_0_#111111]">
            <FaUserCircle size={24} className="text-[#111111]" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 pt-28">
        <div className="mx-auto flex w-full max-w-4xl flex-col space-y-3 px-4">
          {messages.length === 0 ? (
            <div className="mt-10 border-4 border-[#111111] bg-[#ffffff] p-8 text-center shadow-[8px_8px_0_#111111]">
              <p className="text-lg font-black uppercase">
                👋 Hi, I'm <span className="text-[#2f7d32]">BotX</span>
              </p>
              <p className="mt-2 text-sm font-semibold text-[#444444]">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] border-4 border-[#111111] px-4 py-3 font-semibold shadow-[5px_5px_0_#111111] ${
                    msg.sender === "user"
                      ? "self-end bg-[#7ee787]"
                      : "self-start bg-[#ffffff]"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="self-start border-4 border-[#111111] bg-[#ffd166] px-4 py-3 font-semibold shadow-[5px_5px_0_#111111]">
                  BotX is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 z-20 w-full border-t-4 border-[#111111] bg-[#f4e9d8]">
        <div className="mx-auto flex max-w-4xl justify-center px-4 py-3">
          <div className="flex w-full items-center border-4 border-[#111111] bg-[#ffffff] px-3 py-2 shadow-[6px_6px_0_#111111]">
            <input
              type="text"
              className="flex-1 bg-transparent px-2 text-base font-semibold text-[#111111] outline-none placeholder:text-[#6b7280]"
              placeholder="Ask BotX..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="ml-2 border-4 border-[#111111] bg-[#ff5d8f] px-4 py-2 font-black uppercase text-[#111111] shadow-[3px_3px_0_#111111] transition-transform hover:-translate-y-0.5"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Bot