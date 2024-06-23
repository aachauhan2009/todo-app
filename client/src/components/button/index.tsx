
import styles from './styles.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button {...props} className={`${props.className} ${styles.button}`}>
            {children}
        </button>
    );
};

export default Button;

