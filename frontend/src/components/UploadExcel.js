import { useState } from 'react';

const UploadExcel = () => {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setFileName(file.name);
        } else {
            alert('Please upload a valid Excel file (.xlsx).');
            setFileName(null);
        }
    };

    const handleUploadClick = () => {
        if (fileName) {
            alert(`File "${fileName}" uploaded successfully!`);
            // Add your file upload logic here (e.g., sending it to a backend server)
        } else {
            alert('Please select a file before uploading.');
        }
    };

    return (
        <div
            className="border-4 border-[#393530]  h-[300px] 
            flex flex-col gap-4 items-center justify-center rounded-lg  mx-4 "
        >
            <div className="text-center text-3xl font-bold text-slate-300">
                Upload Student
                <div className="text-green-400 py-3">Excel File</div>
            </div>
            <div className="w-[220px]">
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                />
                <label
                    htmlFor="fileInput"
                    className="rounded-lg text-[18px] text-center text-slate-200 font-semibold 
                     hover:scale-105 transition-transform duration-300  bg-transparent border-2 hover:cursor-pointer transition delay-300 p-2 block"
                >
                    {fileName ? `Selected: ${fileName}` : 'Choose File'}
                </label>
            </div>
            <div className="">
                <button
                    className="rounded-lg text-[18px] text-center text-slate-200 font-semibold 
                    bg-[#0DB276] hover:bg-[#0aa46c] hover:cursor-pointer transition delay-100 py-2 px-6"
                    onClick={handleUploadClick}
                >
                    Upload Excel
                </button>
            </div>
        </div>
    );
};

export default UploadExcel;