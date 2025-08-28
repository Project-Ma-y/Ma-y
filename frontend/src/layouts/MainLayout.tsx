// src/layouts/MainLayout.tsx
import React from 'react';
import Header from '@/components/header/Header';
import Navigation from '@/components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: Record<string, any>;
  className?: string;
  showNav?: boolean;
}

const MainLayout = ({
  children,
  headerProps,
  className = '',
  showNav = true,
}: MainLayoutProps) => {
  const showHeader = headerProps?.showHeader ?? true;

  return (
    <div className={`bg-gray-100 w-full min-h-screen ${className}`}>
      <div
        className={`
          mx-auto flex flex-col relative
          w-full max-w-[520px] min-w-[390px]
          bg-white
          min-h-dvh   /* ✅ 또는 min-h-screen */
        `}
      >
        {showHeader && <Header {...headerProps} />}

        <section
          className={`
            flex-1 min-h-0  /* ✅ 부모 높이 안에서 유연하게 늘고/스크롤 됨 */
            flex flex-col gap-[clamp(24px,5vw,32px)]
            px-[clamp(12px,5vw,20px)] py-[clamp(24px,5vw,32px)]
            bg-white
            ${showNav ? 'pb-[80px]' : ''}
          `}
        >
          {children}
        </section>

        {showNav && <Navigation activePath={window.location.pathname} />}
      </div>
    </div>
  );
};

export default MainLayout;
