import "./Title.scss";

export type TitleProps = {
  text: string;
  className?: string;
  title?: string;
};

export default function Title({ text, className, title }: TitleProps) {
  return (
    <div
      className={["pageHeading", className].filter(Boolean).join(" ")}
      title={title}
    >
      {text}
    </div>
  );
}
