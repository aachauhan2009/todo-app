// src/components/Login.js
import { useState } from 'react';
import Input from '../../components/input';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    axios.post("api/login", {
        name,
        password
    }).then(() => {
        login();
        navigate('/todo-list'); // Redirect to profile or any protected page
    })
  };

  

  return (
    <div>
      <h2>Login</h2>
      <Input value={name} placeholder='User Name' onChange={(val) => setName(val)} />
      <Input value={password} type='password' placeholder='Password' onChange={(val) => setPassword(val)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
