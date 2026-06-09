export function MessageBubble({ hasMessages, size = 22 }: { hasMessages: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M4,2 H20 Q24,2 24,6 V14 Q24,18 20,18 H10 L5,22 L6,18 H4 Q0,18 0,14 V6 Q0,2 4,2 Z"
        fill={hasMessages ? "#e24b4a" : "none"}
        stroke={hasMessages ? "none" : "#c8d2d4"}
        strokeWidth={hasMessages ? 0 : 1.5}
      />
      <circle cx="8" cy="10" r="2" fill={hasMessages ? "#ffffff" : "#c8d2d4"} />
      <circle cx="12" cy="10" r="2" fill={hasMessages ? "#ffffff" : "#c8d2d4"} />
      <circle cx="16" cy="10" r="2" fill={hasMessages ? "#ffffff" : "#c8d2d4"} />
    </svg>
  );
}
