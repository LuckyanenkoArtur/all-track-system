import type { Task } from "../../domain/others.ts";
import { Card } from "../../../../components/ui/card/Card.tsx";
import StatusBadge from "../badges/StatusBadge.tsx";

type StatusCardProps = {
  title: string;
  status: Task["status"];
};

export function StatusCard({ title, status }: StatusCardProps) {
  return (
    <Card>
      <Card.Title>{title}</Card.Title>
      <Card.Content>
        <StatusBadge status={status} />
      </Card.Content>
    </Card>
  );
}
