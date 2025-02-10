import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useContest from "../hooks/useContest";

const Leaderboard = () => {
    const { contestId } = useParams();
    const { leaderboardData } = useContest();
    const [data, setData] = useState([]);
    const [problems, setProblems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; // Number of users per page

    // Update leaderboard data every 10 minutes
    useEffect(() => {
        const updateLeaderboardData = async () => {
            console.log("update leaderboard is called", contestId);
            const newData = await leaderboardData(contestId);
            setData(newData.rankedUsers);
            setProblems(newData.problems);
        };

        updateLeaderboardData();
        const intervalId = setInterval(updateLeaderboardData, 600000);
        return () => clearInterval(intervalId);
    }, [contestId]);

    // Pagination handlers
    const totalPages = Math.ceil(data.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedData = data.slice(startIndex, startIndex + usersPerPage);

    return (
        <div className="min-h-screen bg-[#181C21]s bg-[#171717]  text-slate-300">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <h2 className="text-4xl font-bold mb-8 text-[#23d18b] tracking-wider">
                    Leaderboard
                </h2>

                {data.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <p className="text-xl text-gray-400">No data available.</p>
                    </div>
                ) : (
                    <div className="border-2 border-[#393530]s border-[#333333] bg-[#262626] rounded-lg overflow-auto p-6 scroll-color">
                        <table className="w-full table-auto border-collapse border-spacing-y-0">
                            <thead>
                                <tr className="text-[#23d18b]s text-[#A3A3A3] border-b-2 border-[#333333]">
                                    <th className="px-6 py-2 text-[20px]">Rank</th>
                                    <th className="px-6 py-2 text-[20px]">User Id</th>
                                    <th className="px-6 py-2 text-[20px]">Score</th>
                                    <th className="px-6 py-2 text-[20px]">Finish Time</th>
                                    {problems.map((problem, index) => (
                                        <th className="px-6 py-2 text-[20px]" key={index}>
                                            Q{index + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="font-normal text-[17px]">
                                {paginatedData.map((entry, index) => (
                                    <tr
                                        key={index}
                                        className={`text-center border-b-2 border-[#333333] hover:bg-[#232A28] hover:text-[#34D399]`}
                                    >
                                        {/* ${index % 2 === 0 ? "bg-[#21272e]" : "bg-transparent "
                                    } */}
                                        <td className="px-6 py-4 rounded-tl-xl rounded-bl-xl">#{startIndex + index + 1}</td>
                                        <td className="px-6 py-4">{entry.email}</td>
                                        <td className="px-6 py-4">{entry.points}</td>
                                        <td className="px-6 py-4">{entry.finishTime}</td>
                                        {entry.questions.map((q, idx) => (
                                            <td key={idx} className="px-6 py-4">
                                                {q.status === "pass" ? (
                                                    <span className="text-[#23d18b] text-lg font-semibold">
                                                        ✔
                                                    </span>
                                                ) : q.status === "fail" ? (
                                                    <span className="text-red-500 text-lg font-semibold">
                                                        ❌
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-lg font-semibold">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td
                                            className="px-1 py-1 rounded-tr-xl rounded-br-xl"
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination controls */}
                        <div className="flex justify-between mt-6">
                            <button
                                className={`px-4 py-2 rounded-lg border-2 text-whites border-[#174337] ${currentPage === 1 ? " cursor-not-allowed" : "bg-[#23d18b]s hover:bg-green-600s bg-[#1D332D] hover:bg-[#064e3b]"
                                    } text-[#0EA96E]`}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-[#23d18b]s text-[#0EA96E]">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className={`px-4 py-2 border-2 border-[#174337] rounded-lg text-whites ${currentPage === totalPages ? "cursor-not-allowed" : "bg-[#23d18b]s hover:bg-green-600s bg-[#1D332D] hover:bg-[#064e3b]"
                                    } text-[#0EA96E]`}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
