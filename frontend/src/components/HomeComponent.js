import { useEffect, useState } from "react";
import MyDeleteModal from "./DeleteModals";
import MyEditModal from "./EditModals";
import useContest from "../hooks/useContest";

const HomeComponent = () => {
    const { leaderboardData } = useContest();

    const [events, setEvents] = useState([]); // Set initial state as an empty array
    const [teamDetails, setTeamDetails] = useState({});
    const [editEventModal, setEditEventModal] = useState(false);
    const [deleteEventModal, setDeleteEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rankingsData, setRankingsData] = useState([]);
    useEffect(() => {
        // Fetch events from the backend
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:4000/events");
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data); // Store events in state

                    data.forEach(event => fetchContestResults(event));
                    data.forEach(event => fetchTeamAndSubmissionDetails(event));
                } else {
                    console.error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
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

        // fetching leaderboard-data for contest results
        const fetchContestResults = async (event) => {
            try {
                if (event.anType === 'contest' && event.selEv) {
                    const id = event.selEv;
                    const newData = await leaderboardData(id);
                    setRankingsData(newData.rankedUsers);
                }
            }
            catch (error) {
                console.error("Error fetching contest reults:", error);
            }
        }

        fetchEvents();
    }, []);


    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null;


    const closeEditModal = () => {
        setEditEventModal(false);
        setSelectedEvent(null);
    };

    const closeDeleteModal = () => {
        setDeleteEventModal(false);
        setSelectedEvent(null);
    };
    const handleEditClick = (event) => {
        console.log("Selected Event:", event);
        setSelectedEvent(event); // Set the selected event details
        setEditEventModal(true);
    };
    const handleDeleteClick = (event) => {
        console.log("Selected Event:", event);
        setSelectedEvent(event); // Set the selected event details
        setDeleteEventModal(true);
    };
    return (
        <div className="homecomponentonent flex flex-col items-center w-full px-4 rounded-lg">
            {events?.map((event, index) => (

                <div
                    key={index}
                    className="w-full rounded-lg border-2 border-[#0DB276]s border-[#333333] bg-[#21272e]s bg-[#262626] my-10 hover:border-[#174337] hover:bg-[#1D332D] duration-[1000ms]"
                >
                    {/* Title Section */}
                    <div className="relative text-[28px] font-bold text-slate-50s text-[#34d399] bg-[#0DB276]s py-4 border-b-2 border-b-[#333333]">
                        <h1 className="w-full text-center">
                            {"CodeBIT "}
                            {event.tit}
                        </h1>
                        {userType === "admin" && (
                            <div className="flex gap-4 px-2 py-1 absolute right-8 top-4 ">
                                <img
                                    src="\images\edit.png"
                                    alt="edit"
                                    onClick={() => handleEditClick(event)}
                                    className="w-[20px] h-[20px] filter invert-[50%] sepia-[80%] saturate-[500%] hue-rotate-[120deg] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 "
                                />
                                <img
                                    src="\images\delete.png"
                                    alt="delete"
                                    onClick={() => handleDeleteClick(event)}
                                    className="w-[20px] h-[20px] filter invert-[50%] sepia-[80%] saturate-[500%] hue-rotate-[120deg] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200"

                                />


                            </div>

                        )}
                    </div>

                    {/* Event Details */}
                    <div className="bg-[#21272e]s bg-[#262626] px-8 py-6 rounded-lg">
                        <div className="text-[22px] text-slate-50 flex flex-col gap-6">
                            {/* Description */}
                            <div>
                                <p className="leading-relaxed ">{event.desc}</p>
                                {(event.type === "normal" &&
                                    <p className="text-[#0a9160] text-[20px] font-bold">
                                        {new Date(event.deadline).toLocaleString("en-US", {
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






                            {event.anType === "hackathon" && (
                                <div>
                                    {console.log("Event:", event, "Team Details:", teamDetails)}
                                    {teamDetails && Object.keys(teamDetails).length > 0 ? (
                                        Object.entries(teamDetails).map(([eventId, teams]) => {
                                            console.log("Rendering Event ID:", eventId, "Teams:", teams);
                                            return (
                                                <div key={eventId} className="mb-6">
                                                    {/* Event ID Title */}

                                                    {teams.map((team, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`mb-6 border-b-2 border-[#333333] pb-6 text-lg text-slate-200 ${idx === 0 ? "border-t-2 border-[#333333] pt-6" : ""
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
                                                                        className={`py-1 text-center capitalize rounded text-[#34D399] bg-[#1D332D] hover:bg-[#1b2f29]  border-2 border-[#174337]`}
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

                            {/* top performers of the contest */}
                            {
                                event.anType === "contest" && (
                                    rankingsData?.length === 0 ?
                                        (
                                            <div className="flex justify-center items-center min-h-[200px]">
                                                <p className="text-xl text-gray-400">No data available.</p>
                                            </div>
                                        ) :
                                        (
                                            <div className="border-2 border-[#21272E]s border-[#333333] bg-[#262626] rounded-lg shadow-lg p-8 w-[600px]s w-full hover:border-[#174337] overflow-auto">
                                                <div className="text-[28px] font-bold text-[#0EA96E]s text-[#34D399] mb-4 tracking-wider">Rankings</div>
                                                <table className="w-full text-base text-[24px] ">
                                                    <thead className="text-[#0EA96E]s text-[#A3A3A3]">
                                                        <tr className="border-b border-[#333333]">
                                                            <th className="px-4 py-2 text-left">Rank</th>
                                                            <th className="px-4 py-2 text-left">Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-slate-300s text-[#E5E5E5] font-medium">
                                                        {rankingsData.map((student, index) => (
                                                            <tr key={index} className="border-b border-[#2f3741]s border-[#333333] hover:bg-[#232A28] font-light hover:text-[#34D399]">
                                                                <td className="px-4 py-2">#{index + 1}</td>
                                                                <td className="px-4 py-2">{student.email}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                )
                            }


                            {/* Organizers */}
                            {event.org && event.org.length > 0 && (
                                <div>
                                    <p className="text-[18px] text-[#0DB276]s text-[#34D399] font-medium">Organizers:</p>
                                    <ul className="text-[19px] px-2 list-inside list-disc text-slate-300">
                                        {event.org.map((organizer, idx) => (
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
            ))}
            {editEventModal && selectedEvent && (
                <MyEditModal closeEditModal={closeEditModal} hackathonId={selectedEvent._id} hackathonName={selectedEvent.tit} compName="Event" />
            )}
            {deleteEventModal && (
                <MyDeleteModal closeDeleteModal={closeDeleteModal} hackathonId={selectedEvent._id} hackathonName={selectedEvent.tit} compName="Event" />
            )}
        </div>
    );
};

export default HomeComponent;