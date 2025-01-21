import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Navbar from "../components/Navbar"

const Login = () => {
    const [userType, setUserType] = useState("student"); // Track user type (student or admin)
    const [userId, setUserId] = useState(""); // Store user ID or email
    const [password, setPassword] = useState(""); // Store password
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            // If there's a logged-in user, redirect to the homepage
            navigate("/");
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform the login action
        const success = await login(userId, password, userType);

        // If login is successful, navigate to the homepage
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen text-[#E5E5E5] bg-[#171717]">
            <Navbar />
            {/* Login Form Container */}
            <div className="p-6 rounded-lg border-2 border-[#333333] bg-[#262626] w-[35rem] mx-auto shadow-lg">
                <h2 className="text-4xl font-semibold mb-6 tracking-wider">Log In</h2>

                {/* Tabs */}
                <div className="flex space-x-6 mb-8 mt-[40px] font-semibold text-[18px]">
                    <button
                        className={`pb-1 ${userType === "student"
                            ? "border-b-[4px] border-[#34D399] text-[#34D399]"
                            : "hover:text-[#34D399] transition duration-200"
                        }`}
                        onClick={() => setUserType("student")}
                    >
                        Student
                    </button>
                    <button
                        className={`pb-1 ${userType === "admin"
                            ? "border-b-[4px] border-[#34D399] text-[#34D399]"
                            : "hover:text-[#34D399] transition duration-200"
                        }`}
                        onClick={() => setUserType("admin")}
                    >
                        Admin
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* User ID / Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">
                            {userType === "admin" ? "User ID" : "Email"}
                        </label>
                        <input
                            type={userType === "admin" ? "text" : "email"}
                            placeholder={userType === "admin" ? "Enter user ID" : "Enter email address"}
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            className="w-full mt-1 p-3 rounded bg-[#171717] border border-transparent text-white placeholder-[#393530] focus:border-[#0DB276] focus:outline-none"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 p-3 rounded bg-[#212830]s bg-[#171717] border border-transparent placeholder-[#393530] focus:border-[#0DB276] text-white focus:outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full text-[#34D399] bg-[#1D332D] hover:bg-[#1b2f29]  border-2 border-[#174337] py-3 rounded mt-4 font-semibold tracking-wide ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging In..." : "Log In"}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm mt-4">
                        {error}
                    </div>
                )}

                {/* Alternative Login Options */}
                {userType === "student" && (
                    <div>
                        {/* Divider and Text */}
                        <div className="mt-6 flex items-center">
                            <div className="w-full">
                                <hr className="border border-[#333333]" />
                            </div>
                            <div className="text-center text-sm font-medium tracking-wide text-gray-400 w-full">
                                Or sign up with
                            </div>
                            <div className="w-full">
                                <hr className="border border-[#333333]" />
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <a
                            href="/signup"
                            className="block text-center text-[#34D399] mt-6 font-semibold tracking-wide border border-[#174337] hover:bg-[#1D332D] py-3"
                        >
                            Sign Up
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
