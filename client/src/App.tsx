// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import Home from './pages/home';
import TodoList from './pages/todo-list';
import CreateTodo from './pages/create-todo';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import UserProfile from './pages/user-profile';
import PrivateRoute from './components/private-route';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/todo-list" element={<PrivateRoute element={TodoList} />} />
          <Route path="/create-todo" element={<PrivateRoute element={CreateTodo} />} />
          <Route path="/profile" element={<PrivateRoute element={UserProfile} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
