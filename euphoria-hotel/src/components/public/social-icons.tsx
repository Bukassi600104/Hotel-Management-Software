import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export function FacebookIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 9V7.5c0-.83.67-1 1.5-1H16V4h-2.5C11 4 10 5 10 7.5V9H8v3h2v8h3.5v-8H16l.5-3h-3z" />
    </svg>
  );
}

export function InstagramIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.53 3H20.5l-6.5 7.43L21.5 21h-6.04l-4.74-6.2L5.3 21H2.32l6.95-7.95L2 3h6.18l4.28 5.66L17.53 3zm-1.06 16.2h1.65L7.6 4.7H5.83L16.47 19.2z" />
    </svg>
  );
}

export function YoutubeIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.77 2 12 2 12s0 3.23.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.42-4.81zM10 15.02V8.98L15.5 12 10 15.02z" />
    </svg>
  );
}

export function TiktokIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.7 4c.4 2 1.8 3.4 3.8 3.7v3.1c-1.4 0-2.7-.4-3.8-1.2v5.6c0 3.3-2.4 5.8-5.8 5.8A5.4 5.4 0 0 1 5.5 15.6c0-3.4 2.8-5.8 6.2-5.3v3.2c-1.5-.5-3 .5-3 2.1 0 1.2 1 2.2 2.2 2.2 1.4 0 2.4-.9 2.4-2.6V4h3.4z" />
    </svg>
  );
}
