import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const HackathonmanagePage = () => {
    const { hackathonId } = useParams();

    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null; // Get userType or set null if not logged in
    const userEmail = user?.userid || null; // Get user email
    const token = user?.tokene || null;
    const [viewType, setViewType] = useState("Teams");
    const [hackHist, setHackHist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchHackHist = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/hackathonhist/${hackathonId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token, // Send the token in the Authorization header
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch hackathon history");
                }
                const data = await response.json();
                setHackHist(data);
            } catch (error) {
                console.error("Error fetching hackathon history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHackHist();
    }, [hackathonId]);

    if (isLoading) {
        return <div className="text-center text-green-400">Loading...</div>;
    }


    return (
        <div className="min-h-screen text-[#E5E5E5] p-4 sm:p-8 bg-[#171717]">
            {/* Header with Toggle Buttons */}
            <div className="flex justify-start space-x-6 mb-8 pl-20 pt-8">
                <button
                    className={`pb-1 text-lg font-semibold ${viewType === "Teams"
                        ? "border-b-[4px] border-[#34D399] text-[#34D399]"
                        : "hover:text-[#34D399] transition duration-200"
                        }`}
                    onClick={() => setViewType("Teams")}
                >
                    Teams
                </button>
                <button
                    className={`pb-1 text-lg font-semibold ${viewType === "Submissions"
                        ? "border-b-[4px] border-[#34D399] text-[#34D399]"
                        : "hover:text-[#34D399] transition duration-200"
                        }`}
                    onClick={() => setViewType("Submissions")}
                >
                    Submissions
                </button>
            </div>
            {viewType === "Teams" && (<div>
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-[#34D399] text-center mb-6">
                    Registered Teams
                </h1>

                {/* Table */}
                <div className="overflow-x-auto w-[60vw] h-full rounded-lg mx-auto">
                    <table className="table-auto w-full max-w-7xl  border-2 border-[#333333] bg-[#262626] rounded-lg">
                        <thead className="border-b-2 border-b-[#333333]">
                            <tr className="text-xl">
                                <th className="px-4 py-3 text-left">Team Name</th>
                                <th className="px-4 py-3 text-left">Theme</th>
                                <th className="px-4 py-3 text-left">Team Leader</th>
                                <th className="px-4 py-3 text-center" colSpan="3">
                                    Team Members
                                </th>
                            </tr>
                            <tr className="">
                                <th colSpan="3"></th>
                                <th className="px-2 py-2 text-center text-sm">
                                    Name
                                </th>
                                <th className="px-2 py-2 text-center text-sm">
                                    Email
                                </th>
                                <th className="px-2 py-2 text-center text-sm">
                                    Phone
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {hackHist.map((team, teamIndex) => (
                                <React.Fragment key={teamIndex}>
                                    <tr className="border-b-2 border-b-[#333333]">
                                        {/* Team Name */}
                                        <td
                                            className="px-4 py-3 text-sm"
                                            rowSpan={team.teamMembers.length + 1}
                                        >
                                            {team.tName}
                                        </td>
                                        {/* Hackathon theme */}
                                        <td
                                            className="px-4 py-3 text-sm"
                                            rowSpan={team.teamMembers.length + 1}
                                        >
                                            {team.submiss?.length > 0 ? team.submiss[0].theme : "N/A"}
                                        </td>
                                        {/* Team Leader */}
                                        <td
                                            className="px-4 py-3 text-sm"
                                            rowSpan={team.teamMembers.length + 1}
                                        >
                                            <div className="space-y-2">
                                                <div className="font-bold">
                                                    Name: {team.teamLeader.name}
                                                </div>
                                                <div>Email: {team.teamLeader.email}</div>
                                                <div>Phone: {team.teamLeader.phone}</div>
                                            </div>
                                        </td>
                                    </tr>
                                    {team.teamMembers.map((member, memberIndex) => (
                                        <tr key={memberIndex} className="border-b-2 border-b-[#333333]">
                                            {/* Team Member Name */}
                                            <td className="px-2 py-2 text-center text-sm">
                                                {member.name}
                                            </td>
                                            {/* Team Member Email */}
                                            <td className="px-2 py-2 text-center text-sm">
                                                {member.email}
                                            </td>
                                            {/* Team Member Phone */}
                                            <td className="px-2 py-2 text-center text-sm">
                                                {member.phone}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
            {viewType === "Submissions" && (
                <div className="min-h-screen p-4 sm:p-8">
                    <h1 className="text-2xl font-bold text-[#34D399] text-center mb-6">
                        Hackathon Submissions
                    </h1>
                    <div className="overflow-x-auto w-[60vw] h-full rounded-lg mx-auto">
                        <table className="table-auto w-full max-w-7xl border-2 border-[#333333] bg-[#262626]  rounded-lg">
                            <thead className="border-b-2 border-b-[#333333]">
                                <tr className="">
                                    <th className="px-4 py-3 text-left text-lg">
                                        Team Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-lg">
                                        Theme
                                    </th>
                                    <th className="px-4 py-3 text-left text-lg">
                                        Team Leader
                                    </th>
                                    <th className="px-4 py-3 text-left text-lg">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-center text-lg">
                                        GitHub Link
                                    </th>
                                    <th className="px-4 py-3 text-center text-lg">
                                        Video Link
                                    </th>
                                    <th className="px-4 py-3 text-center text-lg">
                                        Live Link
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {hackHist.map((team, teamIndex) =>
                                    team.submiss?.map((submission, subIndex) => (
                                        submission.githubLink ? (  // Only render if GitHub link is present
                                            <tr key={`${teamIndex}-${subIndex}`} className="border-b-2 border-b-[#333333]">
                                                {/* Team Name */}
                                                <td className="px-4 py-3 text-sm font-bold">
                                                    {team.tName}
                                                </td>
                                                {/* Theme */}
                                                <td className="px-4 py-3 text-sm">
                                                    {submission.theme}
                                                </td>
                                                {/* Team Leader */}
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="font-bold">
                                                        Name: {team.teamLeader.name}
                                                    </div>
                                                    <div>Email: {team.teamLeader.email}</div>
                                                    <div>Phone: {team.teamLeader.phone}</div>
                                                </td>
                                                {/* Description */}
                                                <td className="px-4 py-3 text-sm">
                                                    {submission.desc || "No Description Provided"}
                                                </td>
                                                {/* GitHub Link */}
                                                <td className="px-4 py-3 text-sm text-center">
                                                    <a
                                                        href={submission.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:underline"
                                                    >
                                                        GitHub
                                                    </a>
                                                </td>
                                                {/* Video Link */}
                                                <td className="px-4 py-3 text-sm text-center">
                                                    {submission.videoLink ? (
                                                        <a
                                                            href={submission.videoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:underline"
                                                        >
                                                            Video
                                                        </a>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                {/* Live Link */}
                                                <td className="px-4 py-3 text-sm text-center">
                                                    {submission.liveLink ? (
                                                        <a
                                                            href={submission.liveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:underline"
                                                        >
                                                            Live Demo
                                                        </a>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                            </tr>
                                        ) : null // Don't render if GitHub link is missing
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}




        </div>
    );
};

export default HackathonmanagePage;