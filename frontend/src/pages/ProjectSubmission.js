import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation and useParams to get hackathonId

const ProjectSubmission = () => {
    const { hackathonId } = useParams();  // Get the hackathonId from the URL
    const navigate = useNavigate();  // Initialize navigate for navigation

    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        githubLink: '',
        videoLink: '',
        liveLink: '',
        teamLeader: {
            email: '', // Add leader email
            name: '',  // Add leader name
        },
        teamMembers: [{ email: '', name: '' }],
    });

    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            // Handle change for team members
            setFormData((prev) => {
                const updatedMembers = [...prev.teamMembers];
                updatedMembers[index] = { ...updatedMembers[index], [name]: value };
                return { ...prev, teamMembers: updatedMembers };
            });
        } else {
            // Handle change for team leader or other fields
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add hackathonId to form data
        const dataToSubmit = {
            ...formData,
            userId,
            hackathonId, // Include the hackathonId from the URL
        };

        try {
            console.log(dataToSubmit);
            // Send the form data to the backend using fetch
            const response = await fetch('http://localhost:4000/auth/projects/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token,
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                if (response.status === 404 && result.message.includes("not an Team Leader")) {
                    alert("You are not the team leader for this hackathon.");
                } else {
                    alert(result.message || "Failed to submit project.");
                }
                throw new Error(result.message || "Submission failed");
            }

            const result = await response.json();
            alert('Project submitted successfully!');

            // Navigate to /hackathon on success
            navigate('/hackathon');

            // Reset form after successful submission
            setFormData({
                projectName: '',
                description: '',
                githubLink: '',
                videoLink: '',
                liveLink: '',
                teamLeader: { email: '', name: '' },
                teamMembers: [{ email: '', name: '' }],
            });
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Failed to submit project. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-[#171717] w-full flex justify-center p-8">
            <div className="h-full w-[50vw] border-2 border-[#333333] bg-[#262626] text-[#E5E5E5] rounded-md">
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-3xl border-b-2 border-b-[#333333] py-2 font-semibold mb-6 text-center tracking-wider text-[#0DB276]">
                        Project Submission
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Project Name */}
                        <div>
                            <label className="block text-xl font-medium mb-2">Project Name:</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xl font-medium mb-2">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                rows="4"
                            />
                        </div>

                        {/* GitHub Link */}
                        <div>
                            <label className="block text-xl font-medium mb-2">GitHub Link:</label>
                            <input
                                type="url"
                                name="githubLink"
                                value={formData.githubLink}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                            />
                        </div>

                        {/* Video Link */}
                        <div>
                            <label className="block text-xl font-medium mb-2">Video Link:</label>
                            <input
                                type="url"
                                name="videoLink"
                                value={formData.videoLink}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                            />
                        </div>

                        {/* Live Link */}
                        <div>
                            <label className="block text-xl font-medium mb-2">Live Deployment Link:</label>
                            <input
                                type="url"
                                name="liveLink"
                                value={formData.liveLink}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-[20vw] text-[#34D399] bg-[#1D332D]  border-2 border-[#174337] rounded hover:bg-[#1b2f29] py-3  font-semibold tracking-wide transition delay-100"
                        >
                            Submit Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectSubmission;
