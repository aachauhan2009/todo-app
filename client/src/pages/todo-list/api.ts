import axios from "axios";
import { Status } from "../../constants";
import { Todo } from "./constants";

export const fetchTodos = async (params: { status: string, search: string }) => {
    const { data } = await axios.get("/api/todo/list", { params });
    return data;
};

export const updateTodoStatus = (status: Status, todo: Todo) =>
    axios.put(`/api/todo/${todo.id}`, { ...todo, status });

export const deleteTodo = (id: number) => axios.delete(`/api/todo/${id}`);
