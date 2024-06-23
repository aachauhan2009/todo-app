// src/components/Header.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useAuth } from "../../context/auth";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">MyLogo</Link>
            </div>
            <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
                {isAuthenticated ? <>
                    <Link className={styles.headerItem} to="/todo-list">Todo List</Link>
                    <Link className={styles.headerItem} to="/create-todo">Create Todo</Link>
                    <Link className={styles.headerItem} to="/profile">Profile</Link>
                    <a className={styles.headerItem} href="#" onClick={e => {
                        e.preventDefault();
                        logout();
                        navigate("/")
                    }}>Logout</a>
                </> : <>
                    <Link className={styles.headerItem} to="/login">Login</Link>
                    <Link className={styles.headerItem} to="/sign-up">Sign Up</Link>
                </>}

            </nav>
            <div className={styles.hamburger} onClick={toggleMobileMenu}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </div>
        </header>
    );
};

export default Header;
