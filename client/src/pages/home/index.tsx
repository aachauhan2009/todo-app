import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import styles from "./styles.module.css";
import Button from "../../components/button";


const Home: React.FC = () => {
  const auth = useAuth()

  return <>
    <h1 className={styles.heading1}>Your Ultimate <br /> Task Management Tool</h1>
    <h2 className={styles.heading2}>Effortlessly track, organize, and complete your tasks with our intuitive tool. <br /> Boost your productivity and stay on top of your goals every day.</h2>
    <Link to={auth.isAuthenticated ? "/todo-list" : "login"}><Button className={styles.button}>Get Started</Button></Link>
  </>;
};

export default Home;
