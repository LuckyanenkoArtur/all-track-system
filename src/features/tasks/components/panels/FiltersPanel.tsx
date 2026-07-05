import { Panel } from "../../../../components/ui/panel/Panel";
import { useTranslation } from "../../../../i18n";

interface FiltersPanelProps {
    open: boolean;
}

export function FiltersPanel({ }: FiltersPanelProps) {
    const { t } = useTranslation();
    const open = true;

    return (
        <Panel open={open}>
            <Panel.Header>
                <Panel.Title>{t.tasks.filters}</Panel.Title>
                <Panel.Desciption>{t.tasks.details.panelSubtitle}</Panel.Desciption>
            </Panel.Header>
            <Panel.Content>
                <div>FiltersPanel</div>
            </Panel.Content>
        </Panel>
    )
}