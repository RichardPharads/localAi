// hooks/useChat.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useChat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // const intervalId = setInterval(fetchHistory, 20000);
    // return () => clearInterval(intervalId);
    fetchHistory()
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/history");
      setChatHistory(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessage("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { message });
      const cleanedResponse = res.data.response.replace(/<think>.*?<\/think>/g, '').trim();
      setChatHistory([{ user_message: message, bot_response: cleanedResponse, timestamp: new Date().toISOString() }, ...chatHistory]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const resetChat = async () => {
    try {
      await axios.delete("http://127.0.0.1:5000/reset");
      setChatHistory([]);
    } catch (error) {
      console.error("Error resetting chat:", error);
    }
  };

  return { message, setMessage, chatHistory, chatContainerRef, sendMessage, resetChat };
};

export default useChat;
