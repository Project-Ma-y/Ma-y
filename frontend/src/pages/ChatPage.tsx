// src/pages/ChatPage.tsx
import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import clsx from "clsx";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
  isSending?: boolean; // 전송 중 상태
}

const ChatMessage = ({
  sender,
  text,
  time,
  isSending = false,
}: Pick<Message, "sender" | "text" | "time" | "isSending">) => (
  <div
    className={clsx(
      "flex items-end gap-2",
      {
        "justify-end": sender === "user",
        "justify-start": sender === "bot",
      }
    )}
  >
    {sender === "bot" && (
      <img
        src="/assets/logo/logo.png"
        alt="ma:y logo"
        className="h-auto w-10 flex-shrink-0"
      />
    )}
    <div
      className={clsx(
        "rounded-2xl p-3",
        {
          "bg-orange-400 text-white": sender === "user",
          "bg-gray-200 text-gray-800": sender === "bot",
        }
      )}
    >
      {isSending ? (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        </div>
      ) : (
        <div className="text-sm whitespace-pre-wrap">{text}</div>
      )}
    </div>
    <span
      className={clsx(
        "text-xs text-gray-400",
        {
          "order-first": sender === "user",
          "order-last": sender === "bot",
        }
      )}
    >
      {time}
    </span>
  </div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
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
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, isSending: false } : msg
        )
      );
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MainLayout
      headerProps={{
        title: "채팅",
        showBack: false,
      }}
      showNav={true}
    >
      <div className="flex flex-col h-full">
        {/*
          ✅ 채팅 메시지 영역: 하단 입력 폼이 fixed로 변경되었으므로, 메시지 목록에 충분한 패딩을 추가하여 입력 폼과 겹치지 않게 합니다.
        */}
        <div className="flex-1 overflow-y-auto p-4 pb-[80px]"> {/* ✅ 변경: pb-20 -> pb-[80px] */}
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} {...message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/*
          ✅ 입력 폼 영역: `fixed`로 변경하여 뷰포트에 고정합니다. `bottom-16`으로 설정하여 내비게이션 바 바로 위에 위치시킵니다.
          ✅ `max-w-[520px]`와 `mx-auto`를 추가하여 모바일 뷰에서도 중앙에 위치하게 합니다.
          ✅ 배경색(`bg-white`)을 추가하여 콘텐츠가 입력창 뒤로 비치지 않게 합니다.
        */}
        <div className="fixed bottom-16 left-0 right-0 w-full max-w-[520px] mx-auto bg-white px-4 z-10">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 py-4">
            <div className="flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="채팅을 입력해주세요"
                className="w-full bg-transparent px-2 py-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400"
              aria-label="보내기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 -rotate-45 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
