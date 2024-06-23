import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../../components/input';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Button from '../../components/button';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { showErrorToast } from '../../toast';

type SignUpFormInputs = {
  name: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormInputs>();


  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignUpFormInputs) => axios.post("/api/auth/sign-up", { name: data.name, password: data.password }),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err: AxiosError) => {
      showErrorToast(err)
    }
  });
  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    mutate(data);
  };

  const password = watch('password');

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            name='name'
            placeholder='Username'
            register={register}
            registerOptions={{
              required: 'Username is required',
            }}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <Input
            register={register}
            name="password"
            type='password'
            placeholder='Password'
            registerOptions={{ required: 'Password is required' }}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div>
          <Input
            type='password'
            register={register}
            name="confirmPassword"
            placeholder='Confirm Password'
            registerOptions={{
              required: 'Confirm password is required',
              validate: value => value === password || 'Passwords do not match'
            }}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </div>
        <Button disabled={isPending} type='submit'>{isPending ? "Loading..." : "Sign Up"}</Button>
      </form>
      <Link to="/login">
        <Button>
          Login
        </Button>
      </Link>
    </div>
  );
};

export default SignUp;
