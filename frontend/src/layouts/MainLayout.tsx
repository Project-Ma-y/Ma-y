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
  /** 이 페이지에서만 폭 제한을 해제하고 전체 폭으로 사용 */
  fullWidth?: boolean;
  /** 섹션 패딩/간격을 페이지별로 제어하고 싶을 때 */
  contentClassName?: string;
}

const MainLayout = ({
  children,
  headerProps,
  className = '',
  showNav = true,
  fullWidth = false,
  contentClassName = '',
}: MainLayoutProps) => {
  const showHeader = headerProps?.showHeader ?? true;

  // ✅ 전역 글자 확대 상태
  const large = useUIStore((s) => s.largeTextEnabled);

  // ✅ rem 기준을 키우기: html(font-size)을 직접 변경
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = large ? '18px' : '16px';
    return () => {};
  }, [large]);

  return (
    <div className={clsx('bg-gray-100 w-full min-h-screen', className)}>
      <div
        className={clsx(
          'mx-auto flex flex-col relative w-full bg-white min-h-dvh',
          fullWidth ? 'max-w-none min-w-0' : 'max-w-[520px] min-w-[390px]',
        )}
      >
        {showHeader && (
          <Header
            {...headerProps}
            fullWidth={fullWidth} // ✅ 헤더에도 폭 정보 전달
          />
        )}

        <section
          className={clsx(
            // 기본 섹션 여백
            'flex-1 min-h-0 flex flex-col gap-[clamp(24px,5vw,32px)] px-[clamp(12px,5vw,20px)] py-[clamp(24px,5vw,32px)] bg-white',
            showNav && 'pb-[80px]',
            contentClassName, // ✅ 페이지별로 덮어쓰기 가능
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
