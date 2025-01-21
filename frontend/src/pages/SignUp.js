import React, { useState } from "react";
import useSignup from '../hooks/useSignup';
import Navbar from "../components/Navbar"

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: "",
        rollNumber: "",
        password: "",
        confirmPassword: "",
    });
  

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const { signup, isLoading, error, success } = useSignup();
    const handleSubmit = async (e) => {
        e.preventDefault();
      
            // Clear any previous error
            await signup(formData.email,formData.rollNumber,formData.password,formData.confirmPassword);
            

            

            // Clear form fields
            setFormData({
                email: "",
                rollNumber: "",
                password: "",
                confirmPassword: "",
            });
       
    };
    return (
        <div className="flex w-full min-h-screen bg-[#171717] text-[#E5E5E5]">
            <Navbar />
            {/* Signup Form */}
            <div className="p-6 rounded-lg border-2 border-[#333333] bg-[#262626] w-[35rem] mx-auto mt-14">
                <h2 className="text-4xl font-semibold mb-6 tracking-wider">Sign Up</h2>

                {/* Tabs */}
                <div className="flex space-x-6 mb-8 mt-[30px] font-semibold text-[18px]">
                    <button className="border-b-[4px] border-[#34D399] text-[#34D399]  pb-1">
                        Student
                    </button>
                   
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">
                            Email
                        </label>
                        <input type="email" placeholder="Enter email address" name="email" value={formData.email}
                            onChange={handleInputChange} className="w-full mt-1 p-3 rounded bg-[#171717] border border-transparent text-white placeholder-[#393530] focus:border-[#0DB276] focus:outline-none" />
                    </div>

                    {/* Roll Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">
                            Roll Number
                        </label>
                        <input type="text" placeholder="Enter roll number" name="rollNumber" value={formData.rollNumber}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 rounded bg-[#171717] border border-transparent text-white placeholder-[#393530] focus:border-[#0DB276] focus:outline-none" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">
                            Password
                        </label>
                        <input type="password" placeholder="Enter password" name="password" value={formData.password}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 rounded bg-[#171717] border border-transparent text-white  placeholder-[#393530] focus:border-[#0DB276] focus:outline-none" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400">
                            Confirm Password
                        </label>
                        <input type="password" placeholder="Confirm password" name="confirmPassword"
                            value={formData.confirmPassword} onChange={handleInputChange}
                            className="w-full mt-1 p-3 rounded bg-[#171717] border border-transparent text-white  placeholder-[#393530] focus:border-[#0DB276] focus:outline-none" />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}

                    <button
                        className="w-full text-[#34D399] bg-[#1D332D] hover:bg-[#1b2f29] border-2 border-[#174337] py-3 rounded mt-4 font-semibold tracking-wide">
                        Sign Up
                    </button>
                </form>

                {/* Alternative Signup Options */}
                <div className="mt-6 flex items-center">
                    <div className="w-full">
                        <hr className="border border-[#333333]" />
                    </div>
                    <div className="text-center text-sm font-medium tracking-wide text-gray-400 w-full">
                        Or log in with
                    </div>
                    <div className="w-full">
                        <hr className="border border-[#333333]" />
                    </div>
                </div>

                {/* Login Link */}
                <a href="/login"
                    className="block text-center text-[#34D399] mt-6 font-semibold tracking-wide border border-[#174337] hover:bg-[#1D332D] py-3">
                    Log In
                </a>
            </div>
        </div>
    );
};

export default SignUp;