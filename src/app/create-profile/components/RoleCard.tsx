import { theme } from "@/styles/theme";
import Image from "next/image";
import styles from "../styles.module.css";

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export const RoleCard = ({
  title,
  description,
  icon,
  onClick,
}: RoleCardProps) => (
  <button
    onClick={onClick}
    className={styles.roleCard}
    style={{
      flex: 1,
      maxWidth: "400px",
      aspectRatio: "1",
      backgroundColor: theme.colors.background.white,
      border: `2px solid ${theme.colors.primary.coral}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.lg,
    }}
  >
    <Image src={icon} alt={`${title} Icon`} width={80} height={80} />
    <h2
      style={{
        fontSize: theme.typography.fontSize.header,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
      }}
    >
      {title}
    </h2>
    <p
      style={{
        fontSize: theme.typography.fontSize.body,
        color: theme.colors.text.secondary,
        textAlign: "center",
      }}
    >
      {description}
    </p>
  </button>
);
