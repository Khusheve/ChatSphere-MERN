import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useAiAssistant = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();

  const askAi = async (prompt) => {
    setLoading(true);
    try {
      // Send the entire conversation as chat history for Cohere
      const history = messages.map((msg) => ({
        role: msg.senderId === "chatbot" ? "CHATBOT" : "USER",
        message: msg.message,
      }));
      // Smart context: If prompt is about replying as user, prepend perspective instruction
      const replyKeywords = ["reply", "respond", "answer", "what should I", "say as me", "how would I"]; // Expand as needed
      const lowerPrompt = prompt.toLowerCase();
      const shouldReplyAsUser = replyKeywords.some(kw => lowerPrompt.includes(kw));
      const perspective = shouldReplyAsUser
        ? "Reply as if you are me, the user in this chat. "
        : "";
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: perspective + prompt, history }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Add the AI reply as a new message from the chatbot
      setMessages([
        ...messages,
        {
          _id: `ai_${Date.now()}`,
          senderId: "chatbot",
          message: data.reply,
          isAi: true,
        },
      ]);
      return data.reply;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { askAi, loading };
};

export default useAiAssistant;
