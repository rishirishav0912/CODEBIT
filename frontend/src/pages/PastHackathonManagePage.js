import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const PastHackathonManagePage = () => {
    const { hackathonId } = useParams(); // Extract the event ID from the URL
    const [viewType, setViewType] = useState("Event Details");
    const [events, setEventData] = useState(null);
    const [teamDetails, setTeamDetails] = useState({});
    const [hackathonDetails, setHackathonDetails] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const anType = window.location.pathname.includes("hackathonleaderboard")
        ? "hackathon"
        : "contest";
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null; // Get userType or set null if not logged in
    const userEmail = user?.userid || null; // Get user email
    const token = user?.tokene || null;
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/announcements/${anType}/${hackathonId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch event data");
                }

                const data = await response.json();


                setEventData(data);

                fetchTeamAndSubmissionDetails(data);

                checkUserRegistration(data.selEv);





            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const checkUserRegistration = async (eventId) => {
            if (!userEmail) return;
            try {
                console.log(eventId, userEmail);
                if (eventId && userEmail) {
                    const response = await fetch(
                        `http://localhost:4000/teams/check-registration?eventId=${eventId}&userEmail=${userEmail}`,
                        { method: "GET", headers: { "Content-Type": "application/json" } }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        setIsRegistered(data.isRegistered); // Update registration status
                        if (data.isRegistered) {
                            setHackathonDetails(data.hackathonDetails); // Store backend data
                        } else {
                            setHackathonDetails(null); // Clear data if not registered
                        }
                    } else {
                        console.error("Failed to check user registration");
                    }
                }
            } catch (err) {
                console.error("Error checking registration:", err);
            }
        };
        const fetchTeamAndSubmissionDetails = async (event) => {
            try {

                if (event.selEv && event.tNames && event.tNames.length > 0) {

                    // Construct query parameters for the GET request
                    const queryParams = new URLSearchParams({
                        eventId: event.selEv,
                        teamNames: JSON.stringify(event.tNames),
                    });

                    const response = await fetch(`http://localhost:4000/teams?${queryParams.toString()}`);

                    if (response.ok) {
                        const data = await response.json();
                        setTeamDetails(prev => ({ ...prev, [event.selEv]: data })); // Add team details by event

                    } else {
                        console.error(`Failed to fetch team details for event ${event.selEv}`);
                    }

                }
            } catch (error) {
                console.error("Error fetching team and submission details:", error);
            }
        };

        fetchEventData();

    }, []);

    if (loading) {
        return <div className="text-center text-slate-300">Loading...</div>;
    }

    if (error) {
        return <div className=" bg-[#171717] flex items-center justify-center text-xl h-[100vh] w-full text-red-500">{"Result Not Yet Announced"}</div>;
    }



    return (
        <div className="min-h-screen bg-[#181C21]s bg-[#171717] p-4 sm:p-8">
            {/* Toggle Buttons */}
            <div className="flex justify-start space-x-6 mb-8 pl-20 pt-8">
                <button
                    className={`pb-1 text-lg font-semibold ${viewType === "Event Details"
                            ? "border-b-[4px] border-[#34d399] text-[#34d399]"
                            : "text-[#d4d4d4] hover:text-[#34d399]"
                        }`}
                    onClick={() => setViewType("Event Details")}
                >
                    Result Announcements
                </button>
                <button
                    className={`pb-1 text-lg font-semibold ${viewType === "Registered Team"
                            ? "border-b-[4px] border-[#34d399] text-[#34d399]"
                            : "text-[#d4d4d4] hover:text-[#34d399]"
                        }`}
                    onClick={() => setViewType("Registered Team")}
                >
                    My Submission
                </button>
            </div>

            {/* Content Based on View Type */}

            {viewType === "Event Details" && (
                <>


                    {events && (
                        <div

                            className="w-full max-w-3xl mx-auto border-2 border-[#333333] bg-[#21272e]s bg-[#262626] rounded-lg shadow-lg p-6 hover:border-[#174337] "
                        >
                            {/* Title Section */}
                            <div className="text-2xl font-bold text-slate-50s text-[#34d399] bg-[#0DB276]s border-b-2 border-b-[#333333] hover:border-[#174337] hover:bg-[#1D332D] duration-1000 py-2 ">
                                <h1 className="w-full text-center">
                                    {"CodeBIT "}
                                    {events.tit}
                                </h1>
                            </div>

                            {/* Event Details */}
                            <div className="bg-[#21272e]s bg-[#262626] px-8 py-6 rounded-lg">
                                <div className="text-[22px] text-slate-50 flex flex-col gap-6">
                                    {/* Description */}
                                    <div>
                                        <p className="leading-relaxed ">{events.desc}</p>
                                        {(events.type === "normal" &&
                                            <p className="text-[#0a9160] text-[20px] font-bold">
                                                {new Date(events.deadline).toLocaleString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                    timeZoneName: "short",
                                                })}
                                            </p>
                                        )}

                                    </div>






                                    {events.anType === "hackathon" && (
                                        <div>

                                            {teamDetails && Object.keys(teamDetails).length > 0 ? (
                                                Object.entries(teamDetails).map(([eventId, teams]) => {

                                                    return (
                                                        <div key={eventId} className="mb-6">
                                                            {/* Event ID Title */}

                                                            {teams.map((team, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`mb-6 border-b-2 border-[#0a9160] pb-6 text-lg text-slate-200 ${idx === 0 ? "border-t-2 border-[#0a9160] pt-6" : ""
                                                                        }`}
                                                                >
                                                                    {/* Rank */}
                                                                    <p>
                                                                        Rank:{" "}
                                                                        <span className="text-[#0DB276] font-bold">{idx + 1}</span>
                                                                    </p>

                                                                    {/* Project Name */}
                                                                    <p>
                                                                        Project Name:{" "}
                                                                        <span className="text-[#0DB276] font-semibold">{team.projectName}</span>
                                                                    </p>

                                                                    {/* Team Name */}
                                                                    <p>
                                                                        Team Name:{" "}
                                                                        <span className="font-semibold text-[#0DB276]">{team.teamName}</span>
                                                                    </p>



                                                                    {/* Team Members */}
                                                                    <p className="text-[20px] text-[#0DB276] font-bold mb-2 mt-4">
                                                                        Team Members:
                                                                    </p>
                                                                    <div className="grid grid-cols-3 gap-4 text-[18px] p-2">
                                                                        {team.members.map((member, memberIdx) => (
                                                                            <div
                                                                                key={memberIdx}
                                                                                className={`py-1 text-center capitalize rounded ${memberIdx % 2 === 0 ? "bg-gray-500" : "bg-gray-600"
                                                                                    }`}
                                                                            >
                                                                                <p>{member.name}</p>

                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-red-500">No teams available for this hackathon.</p>
                                            )}
                                        </div>
                                    )}


                                    {/* Organizers */}
                                    {events.org && events.org.length > 0 && (
                                        <div>
                                            <p className="text-[22px] text-[#0DB276] font-bold">Organizers:</p>
                                            <ul className="text-[19px] px-2 list-inside list-disc text-slate-300">
                                                {events.org.map((organizer, idx) => (
                                                    <li key={idx} className="flex gap-4 ">
                                                        {/* Name */}
                                                        <span
                                                            title={organizer.name}
                                                            className=" w-[200px] truncate">
                                                            {organizer.name}
                                                        </span>

                                                        {/* Phone */}
                                                        <span className="hover:text-white hover:cursor-pointer w-[120px]">
                                                            {organizer.phone}
                                                        </span>
                                                        {/* Email */}
                                                        <span
                                                            title={organizer.email}
                                                            className="hover:text-white hover:cursor-pointer w-[300px] truncate">
                                                            {organizer.email}
                                                        </span>

                                                    </li>
                                                ))}
                                            </ul>
                                        </div>



                                    )}
                                </div>
                            </div>
                        </div>
                    )}




                </>
            )}
            {viewType === "Registered Team" && (

                <div className="w-full max-w-3xl mx-auto border-2 border-[#333333] bg-[#21272e]s bg-[#262626] rounded-lg shadow-lg p-6 ">
                    <>
                        {isRegistered ? (
                            <div className="flex flex-col gap-4">
                                <h1 className="text-slate-300 font-bold text-xl px-2">
                                    We are thrilled to see your participation in this hackathon {events.tit}
                                </h1>
                                <div>
                                    <h3 className="text-xl text-[#0DB276] font-semibold mb-2">
                                        🏆 Team Details:
                                    </h3>
                                    <div className="px-8">
                                        <p>Team Name: <span className="font-bold">{hackathonDetails.tName}</span></p>
                                        <p>Project Name: <span className="font-bold">{hackathonDetails.submiss[0]?.theme || "N/A"}</span></p>
                                        <p>Leader Name: <span className="font-bold">{hackathonDetails.teamLeader.name}</span></p>
                                        <p>Leader Email: <span className="font-bold">{hackathonDetails.teamLeader.email}</span></p>
                                        <p>Phone: <span className="font-bold">{hackathonDetails.teamLeader.phone}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg text-[#0DB276] font-semibold mb-2">
                                        👥 Team Members:
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2 text-white mt-2 px-8">
                                        <p className="font-bold text-[#0DB276]">Name</p>
                                        <p className="font-bold text-[#0DB276]">Email</p>
                                        <p className="font-bold text-[#0DB276]">Phone</p>
                                        {hackathonDetails.teamMembers.map((member, index) => (
                                            <div key={index} className="contents">
                                                <p className="text-gray-200">{member.name}</p>
                                                <p className="text-gray-200 hover:cursor-pointer">{member.email}</p>
                                                <p className="text-gray-200 hover:cursor-pointer">{member.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg text-[#0DB276] font-semibold mb-2">
                                        📊 Project Submission:
                                    </h4>
                                    <div className="px-8 flex flex-col gap-2">
                                        <p>Project Desc: {hackathonDetails.submiss[0]?.desc || "No description provided"}</p>
                                        <p>
                                            GitHub:{" "}
                                            {hackathonDetails.submiss[0]?.githubLink ? (
                                                <a
                                                    href={hackathonDetails.submiss[0].githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#0DB276] underline"
                                                >
                                                    {hackathonDetails.submiss[0].githubLink}
                                                </a>
                                            ) : (
                                                "No link provided"
                                            )}
                                        </p>
                                        <p>
                                            Video:{" "}
                                            {hackathonDetails.submiss[0]?.videoLink ? (
                                                <a
                                                    href={hackathonDetails.submiss[0].videoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#0DB276] underline"
                                                >
                                                    {hackathonDetails.submiss[0].videoLink}
                                                </a>
                                            ) : (
                                                "No link provided"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-gray-800d  text-center rounded-lg p-6">
                                <h2 className="text-2xl text-[#34d399] font-bold mb-4">Not Registered!</h2>
                                <p className="text-[#d4d4d4] text-lg">
                                    You are not registered for this hackathon. If you believe this is a mistake, please contact the organizers for assistance.
                                </p>
                            </div>
                        )}


                    </>
                </div>
            )}

        </div>
    );
};

export default PastHackathonManagePage;
