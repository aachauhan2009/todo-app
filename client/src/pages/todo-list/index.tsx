import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import styles from './styles.module.css';
import { fetchTodos, updateTodoStatus, deleteTodo } from "./api";
import { Status } from "../../constants";
import TodoItem from "./todo-item";
import SearchInput from "./search-input";
import StatusTabs from "./status-tab";
import { Todo } from "./constants";

const TodoList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const queryClient = useQueryClient();
  const { data: todoList, error } = useQuery<Todo[]>({
    queryKey: ['todoList', selectedStatus, debounceSearch],
    queryFn: () => fetchTodos({ status: selectedStatus, search: debounceSearch }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, todo }: { status: Status, todo: Todo }) =>
      updateTodoStatus(status, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
    },
    onError: () => {
      toast.error("Error updating todo status");
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
    },
    onError: () => {
      toast.error("Error deleting todo");
    },
  });

  const updateStatus = (status: Status, todo: Todo) => {
    updateStatusMutation.mutate({ status, todo });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  useEffect(() => {
    if (error) {
      toast.error("Error Loading Todo List");
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <ToastContainer />
      <main className={styles.main}>
        <SearchInput search={search} setSearch={setSearch} />
        <StatusTabs selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
        <div className={styles.todoList}>
          {todoList?.length ? todoList?.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateStatus={updateStatus}
              deleteTodo={handleDeleteTodo}
            />
          )) : <div className={styles.notFound}> No Todo found </div>}
        </div>
      </main>
    </div>
  );
};

export default TodoList;
