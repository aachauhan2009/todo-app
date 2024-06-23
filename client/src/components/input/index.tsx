import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.css';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions,
}
const Input: React.FC<InputProps> = ({ register, name = "", registerOptions, ...props }) => {
  return (
    <input
      {...props}
      {...register(name, registerOptions)}
      className={`${styles.input} ${props.className}`}
    />
  );
};

export const BaseInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input
      {...props}
      className={`${styles.input} ${props.className}`}
    />
  );
};

export default Input;
