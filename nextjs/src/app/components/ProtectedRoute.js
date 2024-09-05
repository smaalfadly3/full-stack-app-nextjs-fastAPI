"use client"
// This directive tells Next.js that this file should be rendered on the client-side.

import { useContext, useEffect } from "react";
// Importing `useContext` and `useEffect` from React:
// - `useContext` allows accessing the data and functions provided by a React context (in this case, authentication context).
// - `useEffect` runs a side effect (e.g., checking the user’s authentication status) when the component mounts or when dependencies change.

import { useRouter } from "next/navigation";
// `useRouter` from Next.js is used for programmatically navigating between routes.

import AuthContext from "../context/AuthContext";
// Importing the `AuthContext` to access authentication-related data, such as the current user status.

const ProtectedRoute = ({ children }) => {
    // `ProtectedRoute` is a component that wraps other components (passed as `children`) 
    // to ensure only authenticated users can access them.

    const { user } = useContext(AuthContext);
    // Destructuring `user` from the `AuthContext` to check if a user is logged in.

    const router = useRouter();
    // Get the router instance to enable programmatic navigation.

    useEffect(() => {
        // This hook runs after the component mounts or when the `user` or `router` changes.

        if (!user) {
            // If there is no authenticated user (i.e., `user` is `null`), redirect to the login page.
            router.push('/login');
            // Redirects to the login page if the user is not logged in.
        }
    }, [user, router]);
    // `user` and `router` are dependencies for the `useEffect` hook, meaning this effect will run whenever they change.

    return user ? children : null;
     // If the user is logged in, render the child components (the protected content).
    // If there is no user, render nothing (null), effectively preventing access to the protected content.

};

export default ProtectedRoute;
// Export the `ProtectedRoute` component so it can be used to protect specific routes or pages.

// Summary of Functionality:
// The ProtectedRoute component ensures that certain parts of your application (the children passed to this component) are only accessible to authenticated users.
// If the user is not logged in, it will redirect them to the login page.
// If the user is logged in, the protected content (child components) is rendered. If not, nothing is shown.