import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditEvent = () => {
    const { hackathonId } = useParams();
    const [tit, setTit] = useState("");
    const [desc, setDesc] = useState("");
    const [deadline, setDeadline] = useState("");
    const [org, setOrg] = useState([{ name: "", email: "", phone: "" }]);
   
    const [announcementType, setAnnouncementType] = useState("normal");
    const [teamNames, setTeamNames] = useState([""]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.tokene || null;

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/eventdata/${hackathonId}`, {
                    method: "GET",
                    headers: { Authorization: token },
                });

                if (response.ok) {
                    const eventData = await response.json();
                    
                    setTit(eventData.tit || "");
                    setDesc(eventData.desc || "");
                    setDeadline(
                        eventData.deadline ? new Date(eventData.deadline).toISOString().slice(0, 10) : ""
                    );
                    setOrg(eventData.org || [{ name: "", email: "", phone: "" }]);
                    setAnnouncementType(eventData.anType || "normal");
                    setTeamNames(eventData.tNames || [""]);
                } else {
                    console.error("Failed to fetch event data.");
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [hackathonId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tit || !desc || (announcementType === "normal" && !deadline)) {
            alert("Title, description, and deadline are required for normal announcements.");
            return;
        }

        if (org.some((o) => !o.name || !o.email || !o.phone)) {
            alert("Please fill in all organizer details.");
            return;
        }

        if (announcementType === "hackathon" && teamNames.some((name) => !name)) {
            alert("Please provide all winner team names.");
            return;
        }

        const updatedEvent = {
            tit,
            desc,
            deadline: announcementType === "normal" ? deadline : undefined,
            org,
            anType: announcementType,
            tNames: ["hackathon"].includes(announcementType) ? teamNames : undefined,
        };

        try {
            const response = await fetch(`http://localhost:4000/auth/edit-event/${hackathonId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                alert("Event updated successfully!");
            } else {
                const errorData = await response.json();
                alert(`Update failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating event:", error);
            alert("An error occurred during the update. Please try again.");
        }
    };

    const handleRemoveOrg = (index) => {
        const newOrg = org.filter((_, idx) => idx !== index);
        setOrg(newOrg);
    };

    const handleRemoveTeamName = (index) => {
        const newTeamNames = teamNames.filter((_, idx) => idx !== index);
        setTeamNames(newTeamNames);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <header className="px-8 pt-8 pb-4 bg-[#181C21]">
                <h1 className="text-3xl font-bold text-[#0DB276] text-center">Edit Event</h1>
            </header>

            <main className="px-8 py-8">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                    {/* Announcement Type */}
                    <div>
                        <label className="block text-m font-medium mb-2">Announcement Type</label>
                        <select
                            value={announcementType}
                            className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                            disabled
                        >
                            <option value="normal">Normal Announcement</option>
                            <option value="hackathon">Hackathon Result Announcement</option>
                            <option value="contest">Contest Result Announcement</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-m font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={tit}
                            onChange={(e) => setTit(e.target.value)}
                            className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-m font-medium mb-2">Description</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                        ></textarea>
                    </div>

                    {/* Winner Teams */}
                    {announcementType === "hackathon" && (
                        <div>
                            <label className="block text-m font-medium mb-2">Winner Team Names</label>
                            {teamNames.map((name, idx) => (
                                <div key={idx} className="flex gap-4 mb-2">
                                    <input
                                        type="text"
                                        value={name}
                                        placeholder={`Team ${idx + 1}`}
                                        onChange={(e) =>
                                            setTeamNames((prev) =>
                                                prev.map((teamName, i) =>
                                                    i === idx ? e.target.value : teamName
                                                )
                                            )
                                        }
                                        className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                    />
                                    {teamNames.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTeamName(idx)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setTeamNames([...teamNames, ""])}
                                className="text-[#0DB276] hover:underline mt-2"
                            >
                                Add Another Team
                            </button>
                        </div>
                    )}

                    {/* Deadline */}
                    {announcementType === "normal" && (
                        <div>
                            <label className="block text-m font-medium mb-2">Deadline</label>
                            <input
                                type="type"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                            />
                        </div>
                    )}

                    {/* Organizer Details */}
                    <div>
                        <label className="block text-m font-medium mb-2">Organizer Details</label>
                        {org.map((o, idx) => (
                            <div key={idx} className="flex gap-4 mb-2">
                                <input
                                    type="text"
                                    value={o.name}
                                    placeholder="Organizer Name"
                                    onChange={(e) =>
                                        setOrg((prev) =>
                                            prev.map((orgItem, i) =>
                                                i === idx ? { ...orgItem, name: e.target.value } : orgItem
                                            )
                                        )
                                    }
                                    className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                />
                                <input
                                    type="email"
                                    value={o.email}
                                    placeholder="Organizer Email"
                                    onChange={(e) =>
                                        setOrg((prev) =>
                                            prev.map((orgItem, i) =>
                                                i === idx ? { ...orgItem, email: e.target.value } : orgItem
                                            )
                                        )
                                    }
                                    className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    value={o.phone}
                                    placeholder="Organizer Phone"
                                    onChange={(e) =>
                                        setOrg((prev) =>
                                            prev.map((orgItem, i) =>
                                                i === idx ? { ...orgItem, phone: e.target.value } : orgItem
                                            )
                                        )
                                    }
                                    className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                />
                                {org.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOrg(idx)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setOrg([...org, { name: "", email: "", phone: "" }])}
                            className="text-[#0DB276] hover:underline mt-2"
                        >
                            Add Another Organizer
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-[#0DB276] text-white py-2 rounded-md hover:bg-[#0a9a62]"
                        >
                            Update Event
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditEvent;
