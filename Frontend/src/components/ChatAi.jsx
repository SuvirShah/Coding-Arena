import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

// Error bubbles are for the user only: drop them, and merge consecutive same-role turns
// (a failed question leaves two user messages in a row), before sending the history to the model.
const toModelHistory = (messages) =>
    messages
        .filter((m) => !m.isError)
        .reduce((acc, m) => {
            const last = acc[acc.length - 1];
            if (last && last.role === m.role) {
                last.parts = [{ text: `${last.parts[0].text}\n${m.parts[0].text}` }];
            } else {
                acc.push({ role: m.role, parts: [{ text: m.parts[0].text }] });
            }
            return acc;
        }, []);

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: `Hi! I'm your AI assistant. How can I help you with "${problem?.title || 'this problem'}"?`}]}
    ]);
    const [isThinking, setIsThinking] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const onSubmit = async (data) => {
        // One question at a time: protects the AI quota and keeps the conversation in order
        if (isThinking) return;

        const newMessages = [
            ...messages,
            { role: "user", parts: [{ text: data.message }] },
        ];

        setMessages(newMessages);
        reset();
        setIsThinking(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: toModelHistory(newMessages),
                title: problem?.title,
                description: problem?.description,
                testCases: problem?.visibleTestCases,
                startCode: problem?.startCode,
            });

            setMessages((prev) => [
                ...prev,
                { role: "model", parts: [{ text: response.data.message }] },
            ]);
        } catch (error) {
            console.error("API Error:", error);
            const text =
                error.response?.data?.message ||
                (error.response?.status === 401
                    ? "Your session expired. Please log in again."
                    : "Couldn't reach the AI assistant. Check your connection and try again.");
            setMessages((prev) => [
                ...prev,
                { role: "model", isError: true, parts: [{ text }] },
            ]);
        } finally {
            setIsThinking(false);
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
                                : msg.isError
                                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                                    : "bg-[#181614] text-[#f0f0f0] border-[#382e1e]"
                        }`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="chat chat-start" role="status" aria-label="AI is thinking">
                        <div className="chat-bubble p-3.5 rounded-xl border bg-[#181614] border-[#382e1e] flex items-center">
                            <span className="loading loading-dots loading-sm text-[#ffd700]"></span>
                        </div>
                    </div>
                )}
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
                        aria-label="Send message"
                        className="btn btn-sm rounded-lg bg-[#ffd700] hover:bg-[#e6c200] text-black border-none transition-all duration-200"
                        disabled={errors.message || isThinking}
                    >
                        {isThinking
                            ? <span className="loading loading-spinner loading-xs"></span>
                            : <Send size={15} />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;