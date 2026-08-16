import { FiUser } from "react-icons/fi";

import Badge from "../../../../components/ui/badge/Badge.tsx";

import styles from "./AuthorBadge.module.scss";

type AuthorBadgeProps = {
  text: string;
};

export default function AuthorBadge({ text }: AuthorBadgeProps) {
  return (
    <Badge variant="neutral" className={styles.chip}>
      <Badge.Icon>
        <FiUser size={13} aria-hidden />
      </Badge.Icon>
      <Badge.Label>{text}</Badge.Label>
    </Badge>
  );
}
