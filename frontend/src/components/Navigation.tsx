// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";
// 아이콘 SVG는 직접 구현하거나 별도 컴포넌트로 분리하여 사용합니다.
// lucide-react에서 제공하지 않는 아이콘 형태이므로, 직접 SVG를 삽입합니다.

interface NavigationProps {
  activePath: string;
}

// 아이콘 컴포넌트들
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L4 9v12h5v-7h6v7h5V9z"/>
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5a6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    <circle cx="9.5" cy="9.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 16L18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="7" r="4"/>
    <path d="M12 14c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/>
  </svg>
);


export default function Navigation({ activePath }: NavigationProps) {
  const navItems = [
    { label: "홈", path: "/", icon: <HomeIcon active={activePath === "/"} /> },
    { label: "예약", path: "/my-reservation", icon: <SearchIcon active={activePath === "/my-reservation"} /> },
    { label: "채팅", path: "/chat", icon: <ChatIcon active={activePath === "/chat"} /> },
    { label: "내 정보", path: "/profile", icon: <UserIcon active={activePath === "/profile"} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 w-full max-w-[520px] mx-auto bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
