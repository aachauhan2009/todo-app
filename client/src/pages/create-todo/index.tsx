import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';
import Input from '../../components/input';
import Button from '../../components/button';
import { createTodo } from './api';

type CreateTodoFormInputs = {
  title: string;
  description: string;
};

const CreateTodo: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTodoFormInputs>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      toast.success('Todo created successfully!');
      navigate('/todo-list');
    },
    onError: () => {
      toast.error('Error creating todo');
    }
  });

  const onSubmit: SubmitHandler<CreateTodoFormInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.titleGroup}>
        <Input
          type="text"
          name='title'
          placeholder='Title'
          register={register}
          registerOptions={{ required: 'Title is required' }}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.descriptionGroup}>
        <textarea
          placeholder='Description'
          {...register('description', { required: 'Description is required' })}
          className={styles.description}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <Button type="submit" className={styles.button}>Create Todo</Button>
    </form>
  );
};

export default CreateTodo;
