import type { SVGProps } from 'react';

export function PotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.5 7.5A5 5 0 0 1 10 6V4.5A2.5 2.5 0 0 1 12.5 2h0A2.5 2.5 0 0 1 15 4.5V6a5 5 0 0 1 2.5 1.5"/>
      <path d="M4.5 20.5A2.5 2.5 0 0 0 7 23h10a2.5 2.5 0 0 0 2.5-2.5V8a1 1 0 0 0-1-1H5.5a1 1 0 0 0-1 1v12.5z"/>
      <path d="M7.5 11h9"/>
    </svg>
  );
}
