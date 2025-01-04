import { useState } from 'react';
const useSignup = () => {

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const signup = async (email, collegeRollNumber,password, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        if (password !== confirmPassword) {
            setIsLoading(false);
            setError('Password not matched with Confirm Password');
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
        const response = await fetch('http://localhost:4000/registerstudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roll:collegeRollNumber,email ,pass :password})
        })
        
        const json = await response.json();
        if (!response.ok) {
            setIsLoading(false);
            setSuccess(null);
            setError(json.message || 'An error occurred');
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (response.ok) {
            setIsLoading(false);
            setError(null);
            setSuccess(json.message);
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    
    }
    return ({ signup, isLoading, error, success });
}

export default useSignup