"use client";
// This directive ensures the file is treated as a client-side component in Next.js.

import { useContext, useState } from "react";
// Importing necessary hooks from React:
// - `useContext` to access the authentication context.
// - `useState` to manage form input state (username, password).

import AuthContext from "../context/AuthContext"; // Importing `AuthContext` to access login functionality.

import axios from "axios"; // Importing Axios for making HTTP requests to the backend API.

const Login = () => {
    // Main functional component that renders the login and registration form.

    const { login } = useContext(AuthContext);
    // Extracting the `login` function from the `AuthContext` to use it for user login.

    const [username, setUsername] = useState('');     // State to hold the username input for the login form.
    const [password, setPassword] = useState('');     // State to hold the password input for the login form.

    const [registerUsername, setRegisterUsername] = useState(''); 
    // State to hold the username input for the registration form.

    const [registerPassword, setRegisterPassword] = useState('');
    // State to hold the password input for the registration form.

    const handleSubmit = (e) => {
        // Function to handle the login form submission.

        e.preventDefault();
        // Prevent the default form submission behavior (page refresh).

        login(username, password)
        // Call the `login` function from `AuthContext` with the entered username and password.
    };

    const handleRegister = async (e) => {
      // Function to handle the registration form submission.
  
      e.preventDefault();
        // Prevent the default form submission behavior.
      try {
        const response = await axios.post('http://localhost:8000/auth', {
        // Send a POST request to the backend registration API to create a new user.
          username: registerUsername,
          password: registerPassword,
        });
        login(registerUsername, registerPassword);
        // Automatically log in the user after successful registration.
      } catch(error) {
        console.error('Failed to register user:', error);
    }
  }

    return (
        <div className="container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
          {/* Login form. Calls `handleSubmit` when submitted. */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>

      <h2 className='mt-5'>Register</h2>
      <form onSubmit={handleRegister}>
            {/* Registration form. Calls `handleRegister` when submitted. */}
        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="registerUsername"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
        {/* Input field for username. Updates `username` state on change. */}

        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
            {/* Input field for password. Updates `password` state on change. */}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
        </div>
      );

};

export default Login;
// Export the `Login` component so it can be used in other parts of the app.
