

import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

   // Check for authentication status on component mount
  // useEffect(() => {
  //   const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
  //   if (storedIsAuthenticated === 'true') {
  //     setIsAuthenticated(true);
  //   }
  // }, []);


  const login = async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Handle unauthorized access
        if (response.status === 401) {
          setErrorMessage('Unauthorized access');
        } else {
          throw new Error('Failed to login');
        }
      } else {
        // Successful authentication, parse response body
        const responseData = await response.json();
        if (responseData.success) {
          setEmail(responseData.email); // Set the authenticated user
          //setIsAuthenticated(true); // Set authentication status to true
          sessionStorage.setItem("email",responseData.email);
          sessionStorage.setItem("isAuthenticated", "true");
          setErrorMessage(''); // Clear any previous error message
        } else {
          setErrorMessage(responseData.message); // Set error message from response
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Failed to login');
    }
  };

  const getUserData = async () => {

    try{
          const email = sessionStorage.getItem('email');

          console.log(email);

          const body = JSON.stringify({ email: email });


          const response = await fetch('http://localhost:4000/api/users/userData',
          
          {

            method: 'POST',

            credentials: 'include',

            headers: {

              'Content-Type': 'application/json'

            },

            body: body

          }
          
          );

          if (!response.ok) {

            throw new Error('Failed to fetch user data');

          }

          const responseData = await response.json();

          
          sessionStorage.setItem("user",JSON.stringify(responseData.user));
          return responseData.user;

      }

      catch (error) {

        console.error('Error when fetching user data:', error);

      }


  }

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      const responseData = await response.json();

      if (responseData.success) {
        //setUser(null);
        setIsAuthenticated(false);
        sessionStorage.setItem("isAuthenticated", "false");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("email");

        
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, errorMessage, login, logout, getUserData }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
