export default function MopIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="13" />
      <path d="M6 13h12" />
      <path d="M7 13c0 2.2.6 4.4.9 6.6" />
      <path d="M9.7 13c.2 2.2.5 4.4.7 6.6" />
      <path d="M12 13v6.6" />
      <path d="M14.3 13c-.2 2.2-.5 4.4-.7 6.6" />
      <path d="M17 13c0 2.2-.6 4.4-.9 6.6" />
    </svg>
  );
}
