import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: `Hi! I'm your AI assistant. How can I help you with "${problem?.title || 'this problem'}"?`}]}
    ]);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
    const newMessages = [
        ...messages,
        { role: "user", parts: [{ text: data.message }] },
    ];

    setMessages(newMessages);
    reset();

    try {
        const response = await axiosClient.post("/ai/chat", {
        messages: newMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
        });

        setMessages((prev) => [
        ...prev,
        {
            role: "model",
            parts: [{ text: response.data.message }],
        },
        ]);
    } catch (error) {
        console.error("API Error:", error);
        setMessages((prev) => [
        ...prev,
        {
            role: "model",
            parts: [{ text: "Error from AI Chatbot" }],
        },
        ]);
    }
    };

    return (
        <div className="flex flex-col h-full min-h-[450px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border ${
                            msg.role === "user" 
                                ? "bg-[#ffd700] text-black font-medium border-[#ffd700]" 
                                : "bg-[#181614] text-[#f0f0f0] border-[#382e1e]"
                        }`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-3 bg-[#181614] border-t border-[#382e1e]"
            >
                <div className="flex items-center gap-2">
                    <input 
                        placeholder="Ask about time complexity, edge cases, hints..." 
                        className="input input-sm bg-[#0c0b0a] border border-[#382e1e] focus:border-[#ffd700] focus:outline-none rounded-lg flex-1 text-[#f0f0f0] text-xs placeholder:text-[#a09a8e]/60" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-sm rounded-lg bg-[#ffd700] hover:bg-[#e6c200] text-black border-none transition-all duration-200"
                        disabled={errors.message}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;