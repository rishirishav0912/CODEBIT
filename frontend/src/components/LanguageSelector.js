import React, { useState } from "react";

const LanguageSelector = ({language,setLanguage}) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    { label: "Java", value: "java" }
  ];

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative w-16 text-[12px] h-[85%]">
      {/* Button to toggle dropdown */}
      <button
        className="bg-[#181C21] text-slate-300 py-1 px-1 rounded-md border border-slate-600 shadow-md hover:border-[#23d18b] flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)} // Toggle dropdown visibility
      >
        {languages.find((lang) => lang.value === language)?.label}
        <span className="text-slate-500 px-1">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute w-18 mt-2 bg-[#181C21] border border-slate-600 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
          {languages.map((lang) => (
            <li
              key={lang.value}
              className={`px-4 py-2 cursor-pointer hover:bg-[#23d18b] hover:text-black ${
                language === lang.value ? "bg-[#23d18b] text-black" : "text-slate-300"
              }`}
              onClick={() => handleLanguageChange(lang.value)}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
