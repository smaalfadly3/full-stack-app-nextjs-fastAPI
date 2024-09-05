"use client"
// In Next.js, this directive ensures that this file is treated as a client component.

import { createContext, useState } from "react";
// Importing functions from React: 
// - `createContext` is used to create a context for managing state that can be shared across components.
// - `useState` allows managing state within a functional component.

import axios from "axios";
// Axios is imported for making HTTP requests.

import { useRouter } from "next/navigation";
// `useRouter` is a hook from Next.js used to programmatically navigate between pages.

const AuthContext = createContext();
// `AuthContext` is created to hold authentication-related data (like user info) and actions (like login/logout), 
// making it available to other components.

export const AuthProvider = ({ children }) => {
    // The `AuthProvider` component wraps around other components (passed as `children`) 
    // and provides them access to the authentication context.

    const [user, setUser] = useState(null);
    // State to store the currently authenticated user's data. Initially set to `null` (no user logged in).

    const router = useRouter();
    // Router instance for navigating between different routes/pages.

    const login = async (username, password) => {
        // `login` is an asynchronous function that handles user login by sending a request to the backend.

        try {
            const formData = new FormData();
            // Create a new `FormData` object to send user credentials as form data.

            formData.append('username', username);  // Append the `username` field to the form data.
            formData.append('password', password);  // Append the `password` field to the form data.

            const response = await axios.post('http://localhost:8000/auth/token', formData, {
                // Send a POST request to the authentication endpoint to retrieve a token.
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                // Specify that the request is in the form URL encoded format.
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            // Set the default authorization header for all subsequent Axios requests 
            // with the token received from the server.

            localStorage.setItem('token', response.data.access_token);
            // Store the access token in the browser's local storage for persistent authentication.

            setUser(response.data);
            // Set the user's data (from the response) in the state.

            router.push('/');
            // Navigate the user to the homepage after successful login.

        } catch (error) {
            console.log('Login Failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        // Clear the user state (indicating no user is logged in).

        delete axios.defaults.headers.common['Authorization'];
        // Remove the authorization header to prevent further authenticated requests.

        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            /* Provide the `user`, `login`, and `logout` values to all components inside `AuthProvider` */
            {children}
            /* Render any child components that `AuthProvider` wraps */

        </AuthContext.Provider>
    );
};

export default AuthContext;
// Export the `AuthContext` so it can be imported and used by other components.