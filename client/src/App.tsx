import React, { PropsWithChildren } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import Home from './pages/home';
import TodoList from './pages/todo-list';
import CreateTodo from './pages/create-todo';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import PrivateRoute from './components/private-route';
import "./App.css";
import Header from './components/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Profile from './pages/profile';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const Layout: React.FC<PropsWithChildren> = (props) => {
  const location = useLocation();

  return <>
    <Header key={location.key} />
    <ToastContainer />
    {props.children}
  </>
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/todo-list" element={<PrivateRoute element={TodoList} />} />
              <Route path="/create-todo" element={<PrivateRoute element={CreateTodo} />} />
              <Route path="/profile" element={<PrivateRoute element={Profile} />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
