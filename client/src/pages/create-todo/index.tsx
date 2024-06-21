// src/components/CreateTodo.tsx
import { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import Input from '../../components/input';
import { useNavigate } from 'react-router-dom';


const CreateTodo: React.FC<{}> = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('/api/todo', {
        title,
        description,
      });
      setTitle('');
      setDescription('');
      navigate("/todo-list");
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        placeholder='Title'
        value={title}
        onChange={(value) => setTitle(value)}
      />

      <textarea
        placeholder='Description'
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.textarea}
      />
      <button type="submit" className={styles.button}>Create Todo</button>
    </form>
  );
};

export default CreateTodo;
