import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import useContest from "../hooks/useContest";

const ContestProblemPage = () => {
    const location = useLocation();
    const { id, name } = location.state || {}; // Assuming id is passed in the state
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null; // Get userType or set null if not logged in
    const userEmail = user?.userid || null; // Get user email
    const token = user?.tokene || null;
    // State to hold the contest data (including problems)
    const [contest, setContest] = useState(null);

    // State to handle loading and errors
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {leaderboardData} = useContest();

    // Leaderboard data (this would normally be fetched as well)
    // const rankingsData = [
    //     { rank: 1, name: "John Doe" },
    //     { rank: 2, name: "Jane Smith" },
    //     { rank: 3, name: "Alice Johnson" },
    //     { rank: 4, name: "Bob Brown" },
    // ];
    const [rankingsData, setRankingsData] = useState([]);

    // Fetch contest data including problems
    useEffect(() => {
        const fetchContestData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/auth/contestproblems/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,  // Add the Authorization header
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch contest data");
                }
                const data = await response.json();
                setContest(data);
            } catch (err) {
                setError("Failed to load contest data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContestData();
            // updating leaderboard data
            const updateLeaderboardData = () => {
                const newData = leaderboardData(id);
                setRankingsData(newData);
            };

            // Initial call
            updateLeaderboardData();

            // Set up the interval
            const intervalId = setInterval(updateLeaderboardData, 10 * 60 * 1000);

            // Cleanup function
            return () => clearInterval(intervalId);
        }

    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex min-h-screen bg-[#12181f] text-white">
            {/* Left Side: Problems Section */}
            <div className="flex-1 py-8 px-4 space-y-4">
                <div className="text-[28px] text-green-500 font-bold mb-6 text-center">
                    {name}
                </div>

                {/* Loop through problems and display them */}
                <div className="w-full max-w-[700px] space-y-4">
                    {contest?.problems?.map((problem, index) => (
                        <div
                            key={index}
                            className="bg-[#21272e] rounded-lg border border-[#293139] shadow-lg p-6 relative self-start ml-20"
                        >
                            <div className="text-[24px] font-semibold text-green-300 mb-4">
                                {problem.desc.probName}
                            </div>
                            <div className="text-[18px] text-gray-300 mb-4">
                                <strong>Points:</strong> {problem.pnt}
                            </div>

                            <button
                                onClick={() => <Navigate to={`/${id}/${problem._id}/codeEditor}`} state={{problem: problem, name:name}}/>}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#0DB276] hover:bg-[#0a9160] text-white py-2 px-6 rounded-lg"
                            >
                                Solve →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Leaderboard Section */}
            <div className="flex flex-col items-end p-4 w-[300px] space-y-4 mr-8">

                <button
                    onClick={() => navigate(`/contestleaderboard/${id}`)}
                    className="bg-[#0DB276] hover:bg-[#0a9160] text-white py-2 px-6 rounded-lg"
                >
                    Leaderboard →
                </button>

                {/* Leaderboard Table */}
                {
                    rankingsData?.length === 0 ?
                        (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <p className="text-xl text-gray-400">No data available.</p>
                            </div>
                        ) :
                        (
                            <div className="bg-[#21272e] rounded-lg border border-[#293139] shadow-lg p-12 w-[600px]">
                                <div className="text-[28px] font-semibold text-green-300 mb-4">Rankings</div>
                                <table className="w-full text-base text-gray-300 text-[24px] ">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Rank</th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingsData.map((student, index) => (
                                            <tr key={index} className="border-b border-[#293139]">
                                                <td className="px-4 py-2">{index}</td>
                                                <td className="px-4 py-2">{student.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                }

            </div>
        </div>

    );
};

export default ContestProblemPage;
