import "./Title.scss";

export type TitleProps = {
  text: string;
};

export function Title({ text }: TitleProps) {
  return <div className="pageHeading">{text}</div>;
}
