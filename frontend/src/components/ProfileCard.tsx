// src/components/profile/ProfileCard.tsx
import React from "react";
import Card from "@/components/Card";

type Props = {
  name: string;                // ex) "name"
  roleText?: string;           // ex) "동행인"
  verified?: boolean;
  bio?: string;                // ex) "자기소개 작성"
  phone?: string;              // ex) "010-1111-2222"
  rating?: number;             // ex) 4.76
  ratingCount?: number;        // ex) 123
  badgeText?: string;          // ex) "May 선정 우수 동행인"
  avatarUrl?: string;          // 없으면 기본 회색 아바타
  onClick?: () => void;
  className?: string;
};

const ProfileCard: React.FC<Props> = ({
  name,
  roleText = "동행인",
  verified = true,
  bio = "자기소개 작성",
  phone = "010-1111-2222",
  rating = 4.76,
  ratingCount = 123,
  badgeText = "May 선정 우수 동행인",
  avatarUrl,
  onClick,
  className = "",
}) => {
  return (
    <Card
      onClick={onClick}
      className={`relative flex flex-col gap-2 p-4 hover:shadow-md ${className}`}
    >
      {/* 우측 화살표 */}
      <svg
        className="absolute right-4 top-4 h-5 w-5 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>

      <div className="flex items-start gap-3 pr-6">
        {/* 아바타 */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
            </svg>
          </span>
        )}

        <div className="min-w-0 flex-1">
          {/* 이름 + 배지 */}
          <div className="flex items-center gap-1">
            <div className="truncate text-[15px] font-extrabold">
              {name} {roleText}
            </div>
            {verified && (
              <svg
                className="h-4 w-4 text-[#2F6BFF]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
              </svg>
            )}
          </div>

          {/* 자기소개 */}
          <div className="mt-0.5 text-sm text-gray-400">{bio}</div>

          {/* 전화번호 */}
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.25 11.36 11.36 0 003.55.57 1 1 0 011 1v3.61a1 1 0 01-.91 1A19 19 0 013 5.91 1 1 0 014 5h3.61a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.25 1.01l-2.31 2.23z" />
            </svg>
            {phone}
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-2 h-px w-full bg-gray-200" />

      {/* 하단: 평점 + 배지 */}
      <div className="flex items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1 text-[var(--color-primary)]">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 15l-5.878 3.09L5.5 12 1 7.91l6.061-.88L10 2l2.939 5.03L19 7.91 14.5 12l1.378 6.09z" />
          </svg>
          {rating.toFixed(2)} ({ratingCount})
        </span>
        <span className="text-[var(--color-primary)]">{badgeText}</span>
      </div>
    </Card>
  );
};

export default ProfileCard;
