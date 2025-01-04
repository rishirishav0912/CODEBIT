import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const FormHackathon = () => {
    const { hackathonId } = useParams(); // Extract hackathonId from URL
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Extract user details from localStorage
    const userString = localStorage.getItem("user");
    let userId = "";
    let token = "";
    if (userString) {
        const userObject = JSON.parse(userString); // Parse the JSON string
        userId = userObject.userid || ""; // Use userid as Team Leader Email
        token = userObject.tokene || "";  // Access token
    } else {
        console.log("User data not found in localStorage.");
    }

    // Form State
    const [formData, setFormData] = useState({
        teamName: "",
        teamLeader: {
            name: "",
            email: userId, // Prefill Team Leader Email from userId
            phone: "",
        },
        teamMembers: [{ name: "", email: "", phone: "" }],
        selectedProblem: "",
        
    });

    const [problemStatements, setProblemStatements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathonData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/teamregister/${hackathonId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token, // Use token from localStorage
                    },
                });
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    return;
                }
                const data = await response.json();
                setProblemStatements(data.themes || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching hackathon data:", error);
                setLoading(false);
            }
        };

        if (hackathonId && token) {
            fetchHackathonData();
        }
    }, [hackathonId, token]);

    const handleInputChange = (path, value) => {
        const pathArray = path.split(".");
        setFormData((prev) => {
            let updatedData = { ...prev };
            let temp = updatedData;
            for (let i = 0; i < pathArray.length - 1; i++) {
                temp = temp[pathArray[i]];
            }
            temp[pathArray[pathArray.length - 1]] = value;
            return updatedData;
        });
    };

    const handleAddTeamMember = () => {
        setFormData((prev) => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: "", email: "", phone: "" }],
        }));
    };

    const handleProblemSelection = (id) => {
        setFormData((prev) => ({
            ...prev,
            selectedProblem: id,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            hackid:hackathonId,
            teamName: formData.teamName,
            teamLeader: formData.teamLeader,
            teamMembers: formData.teamMembers,
            selectedProblem: formData.selectedProblem,
            
        };

        try {
            const response = await fetch(`http://localhost:4000/auth/teamregister/${hackathonId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Display the error message from the response as an alert
                window.alert(`Error: ${errorData.error || "Unknown error occurred"}`);
                return;
            }

            const result = await response.json();
            console.log("Form submitted successfully:", result);
            window.alert("Form submitted successfully!");

            // Reset form state after successful submission
            setFormData({
                teamName: "",
                teamLeader: {
                    name: "",
                    email: userId, // Prefill Team Leader Email from userId
                    phone: "",
                },
                teamMembers: [{ name: "", email: "", phone: "" }],
                selectedProblem: "",
           
            });

            // // Optionally, reset other states
            setProblemStatements([]); // Clear problem statements if necessary
            setLoading(true); // Optionally reset loading state if you plan to reload any data

            // Navigate to the /hackathon page after successful submission
            navigate("/hackathon");

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-4xl font-semibold mb-8 tracking-wider text-[#0DB276]">
                    Hackathon Team Registration
                </h2>
                {loading ? (
                    <p>Loading themes...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Name:</label>
                            <input
                                type="text"
                                value={formData.teamName}
                                onChange={(e) => handleInputChange("teamName", e.target.value)}
                                required
                                className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Leader Email:</label>
                            <input
                                type="email"
                                value={formData.teamLeader.email} // Prefilled with userId
                                readOnly // Make it non-editable
                                className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:outline-none cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Leader Name:</label>
                            <input
                                type="text"
                                value={formData.teamLeader.name}
                                onChange={(e) => handleInputChange("teamLeader.name", e.target.value)}
                                required
                                className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Leader Phone:</label>
                            <input
                                type="text"
                                value={formData.teamLeader.phone}
                                onChange={(e) => handleInputChange("teamLeader.phone", e.target.value)}
                                required
                                className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Members:</label>
                            {formData.teamMembers.map((member, index) => (
                                <div key={index} className="flex space-x-4 mt-4">
                                    <input
                                        type="text"
                                        placeholder="Member Name"
                                        value={member.name}
                                        onChange={(e) =>
                                            handleInputChange(`teamMembers.${index}.name`, e.target.value)
                                        }
                                        required
                                        className="w-1/3 p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Member Email"
                                        value={member.email}
                                        onChange={(e) =>
                                            handleInputChange(`teamMembers.${index}.email`, e.target.value)
                                        }
                                        required
                                        className="w-1/3 p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Member Phone"
                                        value={member.phone}
                                        onChange={(e) =>
                                            handleInputChange(`teamMembers.${index}.phone`, e.target.value)
                                        }
                                        required
                                        className="w-1/3 p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddTeamMember}
                                className="mt-4 px-6 py-2 bg-[#0DB276] hover:bg-green-600 rounded text-white font-semibold"
                            >
                                + Add Member
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Theme</h3>
                            <div className="space-y-4">
                                {problemStatements.map((problem, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center space-x-4 p-4 border border-[#293139] rounded bg-[#212830] hover:bg-[#1b2127]"
                                    >
                                        <input
                                            type="radio"
                                            name="problemStatement"
                                            value={problem.title}
                                            checked={formData.selectedProblem === problem.title}
                                            onChange={() => handleProblemSelection(problem.title)}
                                            required
                                        />
                                        <span>{problem.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#0DB276] hover:bg-green-600 text-white font-semibold tracking-wide rounded transition delay-100"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FormHackathon;
