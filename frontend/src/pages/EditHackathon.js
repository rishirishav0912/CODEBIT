import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditHackathon = () => {
    const { hackathonId } = useParams(); // Assuming you are using react-router-dom
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null;
    const userEmail = user?.userid || null;
    const token = user?.tokene || null;
    const [formData, setFormData] = useState({
        hackathonName: "",
        teamSize: "",
        registrationTimeline: { start: "", end: "" },
        hackathonTimeline: { start: "", end: "" },
        allowVideoLink: false,
        allowLiveDeploymentLink: false,
        themes: [{ title: "", desc: "" }],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHackathonData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:4000/auth/hackathondata/${hackathonId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const data = await response.json();
                const formatDate = (dateString) =>
                    dateString ? new Date(dateString).toISOString().slice(0, 16) : "";
                // Map backend field names to frontend field names
                setFormData({
                    hackathonName: data.hackName || "",
                    teamSize: data.tSize || "",
                    registrationTimeline: {
                        start: formatDate(data.regTime?.start) || "",
                        end: formatDate(data.regTime?.end) || "",
                    },
                    hackathonTimeline: {
                        start: formatDate(data.hackTime?.start) || "",
                        end: formatDate(data.hackTime?.end) || "",
                    },
                    allowVideoLink: data.allVidLink || false,
                    allowLiveDeploymentLink: data.allLiveDepLink || false,
                    themes: data.themes?.length > 0
                        ? data.themes.map(theme => ({
                            title: theme.title || "",
                            desc: theme.desc || "",
                        }))
                        : [{ title: "", desc: "" }],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (hackathonId) {
            fetchHackathonData();
        }
    }, [hackathonId]);

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
    const handleEditHackathon = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(
                `http://localhost:4000/auth/edit-hackathon/${hackathonId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to edit hackathon: ${response.statusText}`);
            }

            const data = await response.json();
            alert("Hackathon details updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <p>Loading hackathon data...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="min-h-screen bg-[#171717] w-full flex justify-center p-8">
            <div className="h-full w-[50vw] border-2 border-[#333333] bg-[#262626] text-[#E5E5E5] rounded-md">
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-3xl border-b-2 border-b-[#333333] font-semibold mb-6 py-2 tracking-wider text-[#0DB276] text-center">
                        Edit Hackathon Details
                    </h2>
                    <form className="space-y-8">
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
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
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
                                className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                            />
                        </div>
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Registration Timeline:
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="datetime-local"
                                    value={formData.registrationTimeline.start}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "registrationTimeline.start",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.registrationTimeline.end}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "registrationTimeline.end",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                />
                            </div>
                        </div>
                        {/* Registration Timeline */}
                        <div>
                            <label className="block text-xl font-medium mb-2">
                                Hackathon Timeline:
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="datetime-local"
                                    value={formData.hackathonTimeline.start}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "hackathonTimeline.start",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.hackathonTimeline.end}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "hackathonTimeline.end",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-1/2 p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
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
                                            className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Theme Description:
                                        </label>
                                        <textarea
                                            value={theme.desc}
                                            onChange={(e) =>
                                                handleInputChange(`themes.${index}.desc`, e.target.value)
                                            }
                                            required
                                            className="w-full p-3 rounded bg-[#171717] border
                                border-transparent focus:border-[#0DB276]  focus:outline-none placeholder-[#393530]"
                                            rows="4"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTheme(index)}
                                        className="text-red-500 hover:text-red-700 pb-3"
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
                        <div>
                            <button
                                type="button"
                                onClick={handleEditHackathon}
                                className="mt-6 p-3 w-[20vw] text-[#34D399] bg-[#1D332D]  border-2 border-[#174337] rounded hover:bg-[#1b2f29] focus:outline-none"
                            >
                                Edit Hackathon
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHackathon;
