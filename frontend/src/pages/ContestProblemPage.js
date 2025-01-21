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

    const { leaderboardData } = useContest();

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
                const response = await fetch(`http://localhost:4000/contestproblems/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': token,  // Add the Authorization header
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
            const updateLeaderboardData = async () => {
                try {
                    const newData = await leaderboardData(id);
                    setRankingsData(newData.rankedUsers);
                }
                catch (error) {
                    console.log(error);
                }

            };



            // Initial call
            updateLeaderboardData();

            // Set up the interval
            const intervalId = setInterval(updateLeaderboardData, 600000);

            // Cleanup function
            return () => clearInterval(intervalId);
        }

    }, [id]);

    if (loading) return <div className="bg-[#12181F] h-[100vh] w-full] text-[#0DB276] flex justify-center items-center">Loading...</div>;
    if (error) return <div className="bg-[#12181F] h-[100vh] w-full] text-[#0DB276] flex justify-center items-center">{error}</div>;

    return (
        <div className="flex min-h-screen bg-[#171717] text-white">
            {
                contest ?
                    (new Date(contest.endTime) === new Date()) ?
                        <Navigate to={"/contest"} />
                        :

                        (
                            <>
                                <div className="flex-1 py-8 px-4 space-y-4 w-full h-full">
                                    <div className="text-[40px] text-[#0EA96E] tracking-wider font-extrabold mb-6 rounded-lg w-fit flex justify-center py-2 px-4">
                                        {name}
                                    </div>

                                    {/* Loop through problems and display them */}
                                    <div className="w-fulls max-w-[700px]s w-[80%] space-y-4 p-8">
                                        {contest?.problems?.map((problem, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#21272E]s rounded-lg border-2 border-[#333333] bg-[#262626] shadow-lg p-8 relative self-start hover:border-[#174337] flex-wrap"
                                            >
                                                <div className="text-[30px] w-[80%] font-bold text-[#0EA96E]c text-[#34D399] mb-4">
                                                    {problem.desc.probName}
                                                </div>
                                                <div className="text-[18px] mb-4 flex items-center text-[#2f3741]d text-[#737373] font-normal">
                                                    <span>Max Score : </span>
                                                    <span className="material-icons">currency_bitcoin</span>
                                                    {problem.pnt}
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/${id}/${problem._id}/codeEditor`, {
                                                        state: {
                                                            problem: problem,
                                                            name: name
                                                        }
                                                    })}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 border border-[#21272E]d border-[#174337] hover:bg-[#21272E]d hover:bg-[#1D332D] text-[#0EA96E]s text-[#34D399] py-3 px-6 rounded-lg tracking-wider font-medium"
                                                >
                                                    Solve →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Leaderboard Section */}
                                <div className="flex flex-col items-end p-4 w-[300px]s w-[35%] space-y-4 mr-8 mt-40 ">

                                    {/* Leaderboard Table */}
                                    {
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
                                    }
                                    <button
                                        onClick={() => navigate(`/contestleaderboard/${id}`)}
                                        className="text-[#0EA96E] border border-[#2f3741]s hover:bg-[#2f3741]s border-[#174337] bg-[#1D332D] hover:bg-[#064e3b]  py-2 px-6 rounded-lg font-medium"
                                    >
                                        Leaderboard →
                                    </button>
                                </div>
                            </>
                        )

                    :
                    (<Navigate to={"/contest"} />)
            }
        </div>

    );
};

export default ContestProblemPage;
