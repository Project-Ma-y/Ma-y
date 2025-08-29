// src/layouts/MainLayout.tsx
import React, { useEffect } from 'react';
import Header from '@/components/header/Header';
import Navigation from '@/components/Navigation';
import { useUIStore } from '@/store/uiStore';
import clsx from 'clsx';

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

  // ✅ 전역 글자 확대 상태
  const large = useUIStore((s) => s.largeTextEnabled);

  // ✅ rem 기준을 키우기: html(font-size)을 직접 변경
  useEffect(() => {
    const html = document.documentElement;
    // 기본 16px → 확대시 18px (원하면 20px 등으로 조절)
    html.style.fontSize = large ? '18px' : '16px';

    // 필요시 정리 함수로 복원
    return () => {
      // 페이지 전환 시 다른 레이아웃이 있을 수 있어 그대로 두는게 자연스러우면 제거
      // html.style.fontSize = '16px';
    };
  }, [large]);

  return (
    <div className={clsx('bg-gray-100 w-full min-h-screen', className)}>
      <div
        className={clsx(
          'mx-auto flex flex-col relative w-full max-w-[520px] min-w-[390px] bg-white min-h-dvh'
        )}
      >
        {showHeader && <Header {...headerProps} />}

        <section
          className={clsx(
            'flex-1 min-h-0 flex flex-col gap-[clamp(24px,5vw,32px)] px-[clamp(12px,5vw,20px)] py-[clamp(24px,5vw,32px)] bg-white',
            showNav && 'pb-[80px]'
          )}
        >
          {children}
        </section>

        {showNav && <Navigation activePath={window.location.pathname} />}
      </div>
    </div>
  );
};

export default MainLayout;
