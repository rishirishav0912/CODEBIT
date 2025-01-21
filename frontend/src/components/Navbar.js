import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useLogout();
  const { user } = useAuthContext(); // Get user from context

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the corresponding path
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col bg-[#161A1E]s bg-[#262626] justify-start px-8s lg:px-16s xl:px-20s w-[15vw] h-[100vh] sticky top-0 left-0">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-[15vh] w-full border-b-2 border-b-[#333333]">
        <span className="font-black text-[5vh] lg:text-[4vh]s text-[#0DB276] pt-10s">Code</span>
        <img
          src="images/logo.webp"
          alt="logo"
          className="h-[5vh] lg:h-[5vh]s w-[5vw] lg:w-[4vw]s"
        />
      </div>



      {/* Navigation Links */}
      <div className="flex flex-col text-lg lg:text-xl font-semibold text-[#0DB276] w-full text-left h-full gap-5 mt-10 pl-6">
        {/* Events Link */}
        <div
          onClick={() => handleNavigation('/')}
          className={`px-2 border-l-[4px] ${location.pathname === "/" ? "border-[#23d18b]" : "border-transparent"} hover:cursor-pointer transition duration-200 text-[#D4D4D4] hover:text-[#23d18b] hover:bg-[#1D332D] py-2 rounded-md`}
        >
          Events
        </div>

        {/* Contest Link */}
        <div
          onClick={() => handleNavigation('/contest')}
          className={`px-2 border-l-[4px] ${location.pathname === "/contest" ? "border-[#23d18b]" : "border-transparent"} hover:cursor-pointer transition duration-200 text-[#D4D4D4] hover:text-[#23d18b] hover:bg-[#1D332D] py-2 rounded-md`}
        >
          Contest
        </div>

        {/* Hackathons Link */}
        <div
          onClick={() => handleNavigation('/hackathon')}
          className={`px-2 border-l-[4px] ${location.pathname === "/hackathon" ? "border-[#23d18b]" : "border-transparent"} hover:cursor-pointer transition duration-200 text-[#D4D4D4] hover:text-[#23d18b] hover:bg-[#1D332D] py-2 rounded-lg`}
        >
          Hackathons
        </div>

        {/* Login / Logout Button */}
        {!user ? (
          <button
            onClick={() => handleNavigation('/login')}
            className="border-2 border-[#174337]  hover:bg-[#1D332D] text-[#34D399] px-5 lg:px-7 py-1 rounded-lg transition duration-200 w-[10vw] font-normal"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="border-2 border-[#174337]  hover:bg-[#1D332D] text-[#34D399] px-5 lg:px-7 py-1 rounded-lg transition duration-200 w-[10vw] font-normal"
          >
            Logout
          </button>
        )}
      </div>

      {user && (
        <div className='border-t-2 border-t-[#333333] text-[#E5E5E5] h-[20vh] w-full flex justify-center items-start pt-4 mt-auto text-[2vh]'>{user.userid}</div>
      )}
    </div>

  );
};

export default Navbar;