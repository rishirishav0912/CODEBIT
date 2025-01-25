import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditSubmission = () => {
    const { hackathonId } = useParams(); // Get hackathonId from the URL
    const navigate = useNavigate(); // For navigation

    const [formData, setFormData] = useState({
        pname: '',
        desc: '',
        githubLink: '',
        videoLink: '',
        liveLink: '',
      
    });

    const userString = localStorage.getItem("user");
    let token = "";
    let userId="";
    if (userString) {
        const userObject = JSON.parse(userString); // Parse the JSON string
        token = userObject.tokene || ""; // Access token
        userId=userObject.userid || "";

    } else {
        console.log("User data not found in localStorage.");
    }

    // Fetch existing submission data
    useEffect(() => {
        const fetchSubmissionData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/getprojectsubmission/${hackathonId}/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch submission data');
                }

                const data = await response.json();
                
                if (data.submission) {
                    setFormData({
                        pname: data.submission.pname || '',
                        desc: data.submission.desc || '',
                        githubLink: data.submission.githubLink || '',
                        videoLink: data.submission.videoLink || '',
                        liveLink: data.submission.liveLink || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching submission data:', error);
                alert('Failed to load submission data.');
            }
        };

        fetchSubmissionData();
    }, [hackathonId, token]);

    // Handle input changes
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
            // Handle change for other fields
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/auth/projects/editsubmission/${hackathonId}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update project submission');
            }

            const result = await response.json();
            alert('Project updated successfully!');

            // Navigate to the hackathon page
            navigate('/hackathon');
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-[#171717] w-full flex justify-center p-8">
            <div className="h-full w-[50vw] border-2 border-[#333333] bg-[#262626] text-[#E5E5E5] rounded-md">
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-3xl border-b-2 border-b-[#333333] py-2 font-semibold mb-6 text-center tracking-wider text-[#0DB276]">
                        Edit Project Submission
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Project Name */}
                        <div>
                            <label className="block text-xl font-medium mb-2">Project Name:</label>
                            <input
                                type="text"
                                name="pname"
                                value={formData.pname}
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
                                name="desc"
                                value={formData.desc}
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
                            className="w-[20vw] text-[#34D399] bg-[#1D332D] border-2 border-[#174337] rounded hover:bg-[#1b2f29] py-3 font-semibold tracking-wide transition delay-100"
                        >
                            Update Submission
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSubmission;
