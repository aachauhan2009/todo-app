import React from "react";
import { statusMap } from "./constants";
import styles from './styles.module.css';
import { Status } from "../../constants";

type Todo = {
    id: number;
    title: string;
    description: string;
    status: Status;
};

interface TodoItemProps {
    todo: Todo;
    updateStatus: (status: Status, todo: Todo) => void;
    deleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateStatus, deleteTodo }) => {
    return (
        <div key={todo.id} className={styles.todoItem}>
            <h2 className={styles.todoTitle}>{todo.title}</h2>
            <p className={styles.todoDescription}>{todo.description}</p>
            <div className={styles.todoFooter}>
                <span className={`${statusMap[todo.status].className} ${styles.todoStatus}`}>{statusMap[todo.status].label}</span>
                <div className={styles.todoActions}>
                    {statusMap[todo.status].nextAction.map((action) => (
                        <button key={action.value} className={styles.todoButton} onClick={() => updateStatus(action.value, todo)}>
                            {action.label}
                        </button>
                    ))}
                    <button className={styles.todoButton} onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default TodoItem;
