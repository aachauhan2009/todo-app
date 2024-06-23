import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Input from '../../components/input';
import Button from '../../components/button';
import { toast } from 'react-toastify';

type LoginFormInputs = {
  name: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormInputs) => axios.post("/api/auth/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"]
      });
      navigate('/');
    },
    onError: (err: AxiosError) => {
      toast.error(err?.response?.data as string || "Login Failed");
    }
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    mutate(data);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Login with your Username and Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            placeholder='Username'
            register={register}
            registerOptions={{ required: 'Username is required' }}
            name="name"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <Input
            type='password'
            placeholder='Password'
            register={register}
            registerOptions={{ required: 'Password is required' }}
            name="password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <Link to="/sign-up">
        <Button>
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default Login;
