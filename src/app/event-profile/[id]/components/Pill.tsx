import { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  color?: string;
}

export function Pill({ children, color = "#f3f4f6" }: PillProps) {
  return (
    <span style={{
      display: "inline-block",
      background: color,
      color: "#374151",
      borderRadius: "9999px",
      padding: "0.25em 0.75em",
      fontSize: "0.95em",
      margin: "0 0.25em 0.25em 0",
      fontWeight: 500,
      border: "1px solid #e5e7eb"
    }}>{children}</span>
  );
} 