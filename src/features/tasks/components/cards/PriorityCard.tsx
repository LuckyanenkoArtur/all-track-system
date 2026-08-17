import type { Task } from "../../domain/others.ts";
import { Card } from "../../../../components/ui/card/Card.tsx";
import PriorityBadge from "../badges/PriorityBadge.tsx";

type PriorityCardProps = {
  title: string;
  priority: Task["priority"];
};

export function PriorityCard({ title, priority }: PriorityCardProps) {
  return (
    <Card>
      <Card.Title>{title}</Card.Title>
      <Card.Content>
        <PriorityBadge priority={priority} />
      </Card.Content>
    </Card>
  );
}
