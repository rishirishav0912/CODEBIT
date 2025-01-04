import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (userid, password, userType) => {
        setIsLoading(true);
        setError(null);

        try {
            // Sending the login request
            const response = await fetch(`http://localhost:4000/login/${userType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, pass: password }),
            });

            const json = await response.json();

            // If the response is not OK, set the error state
            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                // Clear the error message after 5 seconds
                setTimeout(() => setError(null), 5000);
                return false; // Indicate failure
            }

            // If response is OK, save the user and dispatch the login action
            if (response.ok) {
                setIsLoading(false);
                setError(null);
                localStorage.setItem('user', JSON.stringify(json)); // Save user to localStorage

                // Dispatch the login action to update the context
                dispatch({ type: 'LOGIN', payload: json });

                return true; // Indicate success
            }
        } catch (error) {
            // Handle network or unexpected errors
            setIsLoading(false);
            setError('An error occurred. Please try again later.');
            setTimeout(() => setError(null), 5000);
            return false; // Indicate failure
        }
    };

    return { login, isLoading, error };
};

export default useLogin;
