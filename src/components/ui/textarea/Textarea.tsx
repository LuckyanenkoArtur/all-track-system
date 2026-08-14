import type { ComponentPropsWithoutRef } from "react";

import styles from "./Textarea.module.scss";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export function Textarea({
  className = "",
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`${styles.textarea} ${className}`.trim()}
      rows={rows}
      {...props}
    />
  );
}
