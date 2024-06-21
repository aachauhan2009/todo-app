import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Link } from "react-router-dom";

type Todo = {
  title :string; 
  description :string;
}

const Home: React.FC = () => {
  const {logout } = useAuth();

  const [todolLst, setTodoList] = useState<Todo[]>([]);
  useEffect(() => {
    axios.get("/api/todo-list").then(data => {
      setTodoList(data.data);
    }).catch(err => console.error(err));
  }, []);
    return <div>
      <h1>Todo List</h1>
      <Link to="/create-todo" >Create Todo</Link>
      <div>
        {todolLst.map(todo => (<div>
          <h2>{todo.title}</h2>
          <div>{todo.description}</div>
          </div>))}
      </div>

      <button onClick={() => {
        logout();
      }} >Logout </button>
    </div>;
  };
  
  export default Home;
  