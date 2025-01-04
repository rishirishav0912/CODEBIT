import { useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';

const Emailverify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const { id, token } = useParams();
    
    useEffect(() => {
        if (validUrl) return;
        const verifyEmailUrl = async () => {
            try {
                const url = `http://localhost:4000/users/${id}/verify/${token}`;
                console.log("Fetching URL:", url);
                const response = await fetch(url, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setValidUrl(true);
                } else {
                    console.error('Failed to verify email');
                    setValidUrl(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [id, token]);

    return (
        <Fragment>
            {validUrl ? (
                <div className="w-screen h-screen flex flex-col items-center justify-center">
                    <img src="/path/to/success-image.png" alt="Email Verified Successfully" className="w-32 h-32 mb-6" />
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        Email Verified Successfully
                    </h1>
                    <Link to="/login">
                        <button className="bg-green-500 text-white py-3 px-6 rounded-full font-semibold text-sm hover:bg-green-600">
                            Login
                        </button>
                    </Link>
                </div>
            ) : (
                <h1 className="text-3xl font-bold text-red-600 text-center mt-16">
                    404 Not Found
                </h1>
            )}
        </Fragment>
    );
};

export default Emailverify;
