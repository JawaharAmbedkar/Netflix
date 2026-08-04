import { ReactNode } from 'react';
import Link from 'next/link';

type AuthPageShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  label?: string;
};

export function AuthPageShell({
  children,
  title,
  subtitle,
  label = 'Welcome',
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-white">
      <img
        src="/background/backgroundImage2.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        style={{ filter: 'blur(2px) brightness(0.45) saturate(1.1)' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,9,8,0.88)_0%,rgba(10,9,8,0.72)_45%,rgba(10,9,8,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,169,98,0.12),transparent_50%)]" />

      <Link href="/" className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8">
        <img src="/png/series/netflix.png" alt="Netflix" className="h-8 w-auto sm:h-9" />
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
        <div className="w-full max-w-md animate-fade-up rounded-4xl border border-white/[0.1] bg-canvas-elevated/80 p-8 shadow-card backdrop-blur-2xl sm:p-10">
          <p className="section-label">{label}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-2 text-sm leading-relaxed text-warm-400">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  'w-full rounded-2xl border border-white/[0.1] bg-white/[0.06] px-4 py-3.5 text-white placeholder:text-warm-500 transition focus:border-gold/35 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-gold/25 disabled:opacity-50';

export const authPrimaryButtonClass =
  'w-full rounded-2xl border border-gold/30 bg-gold/15 px-4 py-3.5 text-sm font-semibold text-white shadow-glass backdrop-blur-md transition hover:border-gold/50 hover:bg-gold/25 disabled:cursor-not-allowed disabled:opacity-50';

export const authDividerClass = 'my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-warm-500';

export function AuthDivider() {
  return (
    <div className={authDividerClass}>
      <span className="h-px flex-1 bg-white/[0.08]" />
      <span>or</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  );
}

export const authGoogleButtonClass =
  'flex w-full items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.06] p-1.5 pr-4 transition hover:border-white/20 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50';

export const authLinkClass = 'font-medium text-gold-light transition hover:text-gold';
