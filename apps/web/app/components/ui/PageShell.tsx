import { ReactNode } from 'react';
import Footer from '../footer';
import { Navbar } from '../navbar';

type PageShellProps = {
  children: ReactNode;
  withFooter?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export function PageShell({ children, withFooter = true, className = '', fullWidth = false }: PageShellProps) {
  return (
    <main className={`min-h-screen overflow-x-hidden bg-canvas text-white ${className}`}>
      <Navbar />
      <div
        className={
          fullWidth
            ? 'pb-40 sm:pb-20'
            : 'mx-auto max-w-[1500px] px-4 pb-40 sm:px-8 sm:pb-20 lg:px-12'
        }
      >
        {children}
      </div>
      {withFooter ? <Footer /> : null}
    </main>
  );
}
