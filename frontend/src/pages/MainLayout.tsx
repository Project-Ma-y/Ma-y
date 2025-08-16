import React from 'react';
import Header from '@/components/header/header';

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: Record<string, any>;
  className?: string;
  contentBg?: string;
  showFab?: boolean;
}

const MainLayout = ({
  children,
  headerProps,
  className = '',
  contentBg = 'bg-white',
}: MainLayoutProps) => {
  return (
    <div className={`bg-gray-100 w-full ${className}`}>
      <div
        className={`
          mx-auto flex flex-col relative shadow-md
          w-full max-w-[520px] min-w-[390px] h-screen
          bg-white
        `}
      >
        <Header {...headerProps} />

        <section
          className={`flex-1 flex flex-col gap-[clamp(24px,5vw,32px)] overflow-y-scroll px-[clamp(12px,5vw,20px)] py-[clamp(24px,5vw,32px)] ${contentBg}`}
        >
          {children}
        </section>


        <footer className="sticky bottom-[clamp(16px,4vw,24px)] mb-[clamp(16px,4vw,24px)] z-10 bg-white h-[clamp(64px,12vw,80px)]">
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
