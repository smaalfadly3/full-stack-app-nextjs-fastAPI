import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css";
// Importing a global CSS file (`globals.css`) for custom styles that will apply throughout the application.

import { AuthProvider } from './context/AuthContext';
// Importing `AuthProvider` from the `AuthContext` to wrap the app and provide authentication context to all child components.

export default function RootLayout({ children }) {
  // Defining the `RootLayout` component which wraps around all the pages in the app.
  // `children` refers to the content (components) that will be rendered inside the layout.

  return (
    <AuthProvider>
    {/* Wrapping the app with `AuthProvider` to make the authentication data (user, login, logout) available across the app. */}

    <html lang="en">
      <body>
        {children}
        {/* Render the child components that are passed to the layout, typically pages and components inside the app. */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
      </body>
    </html>
    </AuthProvider>
  );
}
// Summary of Functionality:
// The RootLayout component is a wrapper that sets up the overall structure and styling of the app.
// It imports and applies Bootstrap's CSS and JavaScript for styling and functionality.
// It wraps the entire app with the AuthProvider component to ensure authentication state is accessible throughout the application.
// It renders any child components inside the <body> of the HTML structure.