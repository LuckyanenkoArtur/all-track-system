import type {Task} from "../../domain/task";
import {Tabulator} from "../../../../components/ui/tabulator/Tabulator.tsx";
import {useTranslation} from "../../../../i18n";

import {AiOutlineDashboard} from "react-icons/ai";
import {LuListTodo} from "react-icons/lu";
import {FaComments} from "react-icons/fa6";
import {IoDocuments} from "react-icons/io5";
import {MdOutlineHistory} from "react-icons/md";

interface TaskDetailsTabulatorProps {
    task: Task;
}

export default function TaskDetailsTabulator({task}: TaskDetailsTabulatorProps){
    const { t } = useTranslation();
    const labels = t.tasks.details;

    const tabs = [
        {
            id: "overview",
            label: labels.tabs.overview,
            icon: <AiOutlineDashboard size={15} aria-hidden />,
        },
        {
            id: "steps",
            label: labels.tabs.steps,
            icon: <LuListTodo size={15} aria-hidden />,
        },
        {
            id: "comments",
            label: labels.tabs.comments,
            icon: <FaComments size={15} aria-hidden />,
        },
        {
            id: "documents",
            label: labels.tabs.documents,
            icon: <IoDocuments size={15} aria-hidden />,
        },
        {
            id: "history",
            label: labels.tabs.history,
            icon: <MdOutlineHistory size={15} aria-hidden />,
        },
    ];

    const defaultTab = tabs[0].id;

    const panels = [
        {
            value: "taskList",
            content: (
                <div>Hell</div>
            ),
        },
        {
            value: "cards",
            content: (
                <div>Card</div>
            ),
        },
        {
            value: "analytics",
            content: (
                <div>Anal</div>
            ),
        },
    ];


    return (
        <Tabulator defaultValue={defaultTab}>
            <Tabulator.Tabs>
                {tabs.map((tab) => (
                    <Tabulator.Tab key={tab.id} value={tab.id}>
                        {tab.icon}
                        {tab.label}
                    </Tabulator.Tab>
                ))}
            </Tabulator.Tabs>

            <Tabulator.Panels>
                {panels.map((panel) => (
                    <Tabulator.Panel value={panel.value}>{panel.content}</Tabulator.Panel>
                ))}
            </Tabulator.Panels>
        </Tabulator>
    )
}