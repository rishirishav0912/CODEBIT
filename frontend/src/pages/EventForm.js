import React, { useState, useEffect } from "react";
import useEmailBroadcast from "../hooks/useEmailBroadcast";

const EventForm = () => {
    const [tit, setTit] = useState("");
    const [desc, setDesc] = useState("");
    const [deadline, setDeadline] = useState("");
    const [org, setOrg] = useState([{ name: "", cont: "" }]);
    const [announcementType, setAnnouncementType] = useState("normal");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [hackathons, setHackathons] = useState([]);
    const [contests, setContests] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(false);
    const {emailBroadcast} = useEmailBroadcast();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.tokene || null;

    const currentDate = new Date();
    const [teamNames, setTeamNames] = useState([""]);

    const handleteamNameChange = (index, value) => {
        const updatedEmails = [...teamNames];
        updatedEmails[index] = value;
        setTeamNames(updatedEmails);
    };

    const addteamName = () => {
        setTeamNames([...teamNames, ""]);
    };
    const removeTeamName = (index) => {
        const updatedTeamNames = teamNames.filter((_, i) => i !== index);
        setTeamNames(updatedTeamNames);
    };


    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                if (announcementType === "hackathon") {
                    const response = await fetch("http://localhost:4000/hackathons", {
                        method: "GET",
                        headers: { Authorization: token },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const pastHackathons = data
                            .filter((event) => new Date(event.hackTime.end) < currentDate)
                            .map((event) => ({ name: event.hackName, id: event._id }));
                        setHackathons(pastHackathons);
                    }
                } else if (announcementType === "contest") {
                    const response = await fetch("http://localhost:4000/contests", {
                        method: "GET",
                        headers: { Authorization: token },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const pastContests = data
                            .filter((event) => new Date(event.endTime) < currentDate)
                            .map((event) => ({ name: event.contName, id: event._id }));
                        setContests(pastContests);
                    }
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [announcementType, token]);

    const addOrganizer = () => {
        setOrg([...org, { name: "", email: "", phone: "" }]);
    };

    const handleOrganizerChange = (index, field, value) => {
        const newOrg = [...org];
        newOrg[index][field] = value;
        setOrg(newOrg);
    };
    const removeOrganizer = (index) => {
        const updatedOrg = org.filter((_, i) => i !== index);
        setOrg(updatedOrg);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!tit || !desc ||  (announcementType === "normal" &&  !deadline)) {
            alert("Title, description, and deadline are required for normal announcements.");
            return;
        }
    
        if (org.some((o) => !o.name || !o.email || !o.phone)) {
            alert("Please fill in all organizer details.");
            return;
        }
    
        if ((announcementType === "hackathon" ) && teamNames.some((name) => !name)) {
            alert("Please provide all winner team names.");
            return;
        }
    
        const formData = {
            tit,
            desc,
            deadline: announcementType === "normal" ? deadline : undefined,
            org,
            anType: announcementType,
            selEv: (announcementType === "hackathon" || announcementType === "contest") ? selectedEvent : undefined,
            tNames: (announcementType === "hackathon" ) ? teamNames : undefined,
        };
    
        try {
            console.log(formData);
            const response = await fetch("http://localhost:4000/auth/addevents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert("Event created successfully!");
                // email broadcasting logic here
                emailBroadcast(formData);
                setTit("");
                setDesc("");
                setDeadline("");
                setOrg([{ name: "", email: "", phone: "" }]);
                setAnnouncementType("normal");
                setSelectedEvent("");
                setTeamNames([""]);

            } else {
                const errorData = await response.json();
                alert(`Submission failed: ${errorData.error}`);
            }
        } catch (error) {
            alert("An error occurred during submission. Please try again.");
            console.error("Submission error:", error);
        }
    };
    
   
   

     
      

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <header className="px-8 pt-8 pb-4 bg-[#181C21]">
                <h1 className="text-3xl font-bold text-[#0DB276] text-center">Event Registration</h1>
            </header>

            <main className="px-8 py-8">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                    {/* Announcement Type */}
                    <div>
                        <label className="block text-m font-medium mb-2">Announcement Type</label>
                        <select
                            value={announcementType}
                            onChange={(e) => setAnnouncementType(e.target.value)}
                            className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                        >
                            <option value="normal">Normal Announcement</option>
                            <option value="hackathon">Hackathon Result Announcement</option>
                            <option value="contest">Contest Result Announcement</option>
                        </select>
                    </div>

                    {/* Event Name */}
                    {(announcementType === "hackathon" || announcementType === "contest") && (
                        <div>
                            <label className="block text-m font-medium mb-2">Event Name</label>
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                            >
                                <option value="">
                                    Select {announcementType === "hackathon" ? "Hackathon" : "Contest"}
                                </option>
                                {loading ? (
                                    <option>Loading...</option>
                                ) : (
                                    (announcementType === "hackathon" ? hackathons : contests).map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}


                    {/* Winner Team name */}
                    {(announcementType === "hackathon") && (
                        <div>
                            <label className="block text-m font-medium mb-2">Winners Team Name</label>
                            {teamNames.map((email, index) => (
                                <div key={index} className="flex gap-4 mb-2">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => handleteamNameChange(index, e.target.value)}
                                        className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                        placeholder={`Rank ${index + 1}`}
                                    />
                                    {/* Only show the delete button if the index is not 0 */}
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTeamName(index)}  // Function to remove team name
                                            className="text-[#0DB276] rounded-md px-2 p-1 hover:cursor-pointer"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addteamName}
                                className="px-4 py-2 mt-2 rounded-md bg-[#0DB276] hover:bg-[#0aa46c]"
                            >
                                + Add Another Team Name
                            </button>
                        </div>

                    )}


                    {/* Title */}
                    { (
                        <div>
                            <label className="block text-m font-medium mb-2">Title</label>
                            <input
                                type="text"
                                value={tit}
                                onChange={(e) => setTit(e.target.value)}
                                className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                placeholder="Event Title"
                            />
                        </div>
                    )}
                    {/* Description */}
                    { (
                        <div>
                            <label className="block text-m font-medium mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                placeholder="Event Description"
                            ></textarea>
                        </div>
                    )}

                    {/* Deadline */}
                    {(announcementType === "normal") && (
                        <div>
                            <label className="block text-m font-medium mb-2">Deadline</label>
                            <input
                                type="text"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                placeholder="Deadline (e.g., 2024-12-20)"
                            />
                        </div>
                    )}

                    {/* Organizers */}
                    <div>
                        <label className="block text-m font-medium mb-2">Organizers</label>
                        {org.map((o, index) => (
                            <div key={index} className="flex gap-4 mb-2">
                                <input
                                    type="text"
                                    className="w-1/2 bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                    placeholder="Organizer Name"
                                    value={o.name}
                                    onChange={(e) =>
                                        handleOrganizerChange(index, "name", e.target.value)
                                    }
                                />
                                <input
                                    type="email"
                                    className="w-1/2 bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                    placeholder="Organizer Email"
                                    value={o.email}
                                    onChange={(e) =>
                                        handleOrganizerChange(index, "email", e.target.value)
                                    }
                                />
                                <input
                                    type="tel"
                                    className="w-1/2 bg-[#21272e] text-slate-300 px-4 py-2 rounded-md focus:outline-none"
                                    placeholder="Organizer Phone"
                                    value={o.phone}
                                    onChange={(e) =>
                                        handleOrganizerChange(index, "phone", e.target.value)
                                    }
                                />
                                {/* Only show the delete button if the index is not 0 */}
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOrganizer(index)} // Function to remove the organizer
                                        className="text-[#0DB276] rounded-md px-2 p-1 hover:cursor-pointer"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOrganizer}
                            className="px-4 py-2 mt-2 rounded-md bg-[#0DB276] hover:bg-[#0aa46c]"
                        >
                            + Add another organizer
                        </button>
                    </div>



                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-[#0DB276] text-white px-4 py-2 rounded-md font-medium"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EventForm;