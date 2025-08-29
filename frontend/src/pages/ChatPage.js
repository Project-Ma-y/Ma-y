import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ChatPage.tsx
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import clsx from "clsx";
const ChatMessage = ({ sender, text, time, isSending = false, }) => (_jsxs("div", { className: clsx("flex items-end gap-2", {
        "justify-end": sender === "user",
        "justify-start": sender === "bot",
    }), children: [sender === "bot" && (_jsx("img", { src: "/assets/logo/logo.png", alt: "ma:y logo", className: "h-auto w-10 flex-shrink-0" })), _jsx("div", { className: clsx("rounded-2xl p-3", {
                "bg-orange-400 text-white": sender === "user",
                "bg-gray-200 text-gray-800": sender === "bot",
            }), children: isSending ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" }), _jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" }), _jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-white" })] })) : (_jsx("div", { className: "text-sm whitespace-pre-wrap", children: text })) }), _jsx("span", { className: clsx("text-xs text-gray-400", {
                "order-first": sender === "user",
                "order-last": sender === "bot",
            }), children: time })] }));
export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const botMessage = {
            id: 1,
            sender: "bot",
            text: "안녕하세요! ma:y 상담봇입니다.\n\n현재 실시간 상담 서비스는 개발 중입니다.\n\n더 나은 서비스 제공을 위해 노력하는 ma:y가 되겠습니다. 개선이 필요한 부분이 있다면 의견을 남겨주시면 서비스에 반영하도록 하겠습니다. 감사합니다.",
            time: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
        };
        setMessages([botMessage]);
    }, []);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === "")
            return;
        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: inputMessage,
            time: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            isSending: true,
        };
        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
        setTimeout(() => {
            setMessages((prev) => prev.map((msg) => msg.id === newMessage.id ? { ...msg, isSending: false } : msg));
        }, 2000);
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (_jsx(MainLayout, { headerProps: {
            title: "채팅",
            showBack: false,
        }, showNav: true, children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 pb-[80px]", children: [" ", _jsxs("div", { className: "space-y-4", children: [messages.map((message) => (_jsx(ChatMessage, { ...message }, message.id))), _jsx("div", { ref: messagesEndRef })] })] }), _jsx("div", { className: "fixed bottom-16 left-0 right-0 w-full max-w-[520px] mx-auto bg-white px-4 z-10", children: _jsxs("form", { onSubmit: handleSendMessage, className: "flex items-center gap-2 py-4", children: [_jsxs("div", { className: "flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }), _jsx("input", { type: "text", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), placeholder: "\uCC44\uD305\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694", className: "w-full bg-transparent px-2 py-1 outline-none placeholder:text-gray-400" })] }), _jsx("button", { type: "submit", className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400", "aria-label": "\uBCF4\uB0B4\uAE30", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 -rotate-45 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14 5l7 7m0 0l-7 7m7-7H3" }) }) })] }) })] }) }));
}
