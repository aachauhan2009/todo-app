import { Status } from "../../constants";
import styles from './styles.module.css';

export const startAction = { value: Status.PROGRESS, label: "Start" };
export const completeAction = { value: Status.DONE, label: "Complete" };

export const statusMap = {
    [Status.NEW]: { label: "New", className: styles.new, nextAction: [startAction, completeAction] },
    [Status.PROGRESS]: { label: "Active", className: styles.active, nextAction: [completeAction] },
    [Status.DONE]: { label: "Complete", className: styles.completed, nextAction: [] },
};

export const statuses = [
    { value: "", label: "All" },
    { value: Status.NEW, label: "New" },
    { value: Status.PROGRESS, label: "Active" },
    { value: Status.DONE, label: "Completed" }
];


export type Todo = {
    id: number;
    title: string;
    description: string;
    status: Status;
};

