import React, { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
const CreateHackathon = () => {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({
        hackathonName: "",
        teamSize: "",
        registrationTimeline: { start: "", end: "" },
        hackathonTimeline: { start: "", end: "" },
        allowVideoLink: false,
        allowLiveDeploymentLink: false,
        themes: [{ title: "", desc: "" }],
    });
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

    const handleAddTheme = () => {
        setFormData((prev) => ({
            ...prev,
            themes: [...prev.themes, { title: "", desc: "" }],
        }));
    };

    const handleRemoveTheme = (index) => {
        const updatedThemes = formData.themes.filter((_, idx) => idx !== index);
        setFormData((prev) => ({
            ...prev,
            themes: updatedThemes,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {

            return
        }

        try {

            const response = await fetch('http://localhost:4000/auth/hackathon/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create hackathon: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Response:", data);
            alert('Hackathon created successfully!');

            // Reset the form after successful submission
            setFormData({
                hackathonName: "",
                teamSize: "",
                registrationTimeline: { start: "", end: "" },
                hackathonTimeline: { start: "", end: "" },
                allowVideoLink: false,
                allowLiveDeploymentLink: false,
                themes: [{ title: "", desc: "" }],
            });
        } catch (error) {
            console.error("Error creating hackathon:", error);
            alert('Failed to create hackathon. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#171717] w-full flex justify-center p-8">
            <div className="h-full w-[50vw] border-2 border-[#333333] bg-[#262626] text-[#E5E5E5] rounded-md">
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-4xl text-center font-semibold mb-6  border-b-2 border-b-[#333333] py-2 tracking-wider text-[#0DB276]">
                        Create Hackathon
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Hackathon Name */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Hackathon Name:
                            </label>
                            <input
                                type="text"
                                value={formData.hackathonName}
                                onChange={(e) =>
                                    handleInputChange("hackathonName", e.target.value)
                                }
                                required
                                className="w-full p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                            />
                        </div>

                        {/* Team Size */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Team Size:
                            </label>
                            <input
                                type="number"
                                value={formData.teamSize}
                                onChange={(e) =>
                                    handleInputChange("teamSize", e.target.value)
                                }
                                required
                                className="w-full p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                            />
                        </div>

                        {/* Registration Timeline */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Registration Timeline:
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="datetime-local"
                                    value={formData.registrationTimeline.start}
                                    onChange={(e) =>
                                        handleInputChange("registrationTimeline.start", e.target.value)
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.registrationTimeline.end}
                                    onChange={(e) =>
                                        handleInputChange("registrationTimeline.end", e.target.value)
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Hackathon Timeline */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Hackathon Timeline:
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="datetime-local"
                                    value={formData.hackathonTimeline.start}
                                    onChange={(e) =>
                                        handleInputChange("hackathonTimeline.start", e.target.value)
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.hackathonTimeline.end}
                                    onChange={(e) =>
                                        handleInputChange("hackathonTimeline.end", e.target.value)
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Themes Section */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Hackathon Themes:
                            </label>
                            {formData.themes.map((theme, index) => (
                                <div key={index} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Theme Title:
                                        </label>
                                        <input
                                            type="text"
                                            value={theme.title}
                                            onChange={(e) =>
                                                handleInputChange(`themes.${index}.title`, e.target.value)
                                            }
                                            required
                                            className="w-full p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Theme Description:
                                        </label>
                                        <textarea
                                            value={theme.desc}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    `themes.${index}.desc`,
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full p-3 rounded bg-[#171717] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                            rows="4"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTheme(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove Theme
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddTheme}
                                className="text-[#0DB276] hover:text-green-600"
                            >
                                Add Another Theme
                            </button>
                        </div>

                        {/* Allow Additional Links */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Allow users to provide:
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowVideoLink}
                                        onChange={(e) =>
                                            handleInputChange("allowVideoLink", e.target.checked)
                                        }
                                        className="w-4 h-4 text-[#0DB276] border-gray-300 rounded focus:ring-[#0DB276]"
                                    />
                                    <label className="ml-2 text-sm">Video Link</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowLiveDeploymentLink}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "allowLiveDeploymentLink",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-[#0DB276] border-gray-300 rounded focus:ring-[#0DB276]"
                                    />
                                    <label className="ml-2 text-sm">Live Deployment Link</label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-[20vw] text-[#34D399] bg-[#1D332D] hover:bg-[#1b2f29] border-2 border-[#174337] py-3 font-semibold tracking-wide rounded transition delay-100"
                        >
                            Create Hackathon
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateHackathon;
