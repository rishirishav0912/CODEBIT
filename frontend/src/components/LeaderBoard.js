import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import useContest from "../hooks/useContest";

const Leaderboard = () => {
    const { contestId } = useParams();
    const { leaderboardData } = useContest();
    const [data, setData] = useState([]);

    // updating the leaderboard data every 10 minutes
    useEffect(() => {
        // updating leaderboard data
        const updateLeaderboardData = () => {
            const newData = leaderboardData(contestId);
            setData(newData);
        };

        // Initial call
        updateLeaderboardData();

        // Set up the interval
        const intervalId = setInterval(updateLeaderboardData, 10 * 60 * 1000);

        // Cleanup function
        return () => clearInterval(intervalId);
    }, [leaderboardData, contestId])


    // Declare the data directly in the component
    // const data = [
    //     {
    //         rank: 1,
    //         name: "some_idiot",
    //         score: 20,
    //         finishTime: "00:27:46",
    //         questions: [
    //             { status: "pass" },
    //             { status: "pass" },
    //             { status: "pass" },
    //             { status: "pass" },
    //         ],
    //     },
    //     {
    //         rank: 2,
    //         name: "Ian Wong",
    //         score: 20,
    //         finishTime: "00:43:28",
    //         questions: [
    //             { status: "pass" },
    //             { status: "pass" },
    //             { status: "pass" },
    //             { status: "fail" },
    //         ],
    //     },
    //     {
    //         rank: 3,
    //         name: "Superultra",
    //         score: 20,
    //         finishTime: "00:49:58",
    //         questions: [
    //             { status: "pass" },
    //             { status: "pass" },
    //             { status: "fail" },
    //             { status: "fail" },
    //         ],
    //     },
    // ];

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <h2 className="text-4xl font-bold mb-8 text-[#23d18b] tracking-wider">
                    Leaderboard
                </h2>

                {/* Main container box for the table */}
                {data?.length === 0 ?
                    (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <p className="text-xl text-gray-400">No data available.</p>
                        </div>
                    ) :
                    (
                        <div className="border-2 border-[#393530] rounded-lg overflow-hidden p-6">
                            <table className="w-full table-auto border-collapse border-spacing-y-0"> {/* Creates the gap between rows */}
                                {/* Table Header */}

                                <tr
                                    className="text-[#23d18b]"
                                >
                                    <th className="px-6 py-2 text-[20px]">Rank</th>
                                    <th className="px-6 py-2 text-[20px]">Name</th>
                                    <th className="px-6 py-2 text-[20px]">Score</th>
                                    <th className="px-6 py-2 text-[20px]">Finish Time</th>
                                    <th className="px-6 py-2 text-[20px]">Q1</th>
                                    <th className="px-6 py-2 text-[20px]">Q2</th>
                                    <th className="px-6 py-2 text-[20px]">Q3</th>
                                    <th className="px-6 py-2 text-[20px]">Q4</th>
                                </tr>

                                {/* Table Body */}
                                <tbody className="font-semibold">
                                    <tr className="border-t border-[#393530] h-[10px]"></tr>
                                    {data.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className={`text-center hover:border hover:border-[#23d18b] ${index % 2 === 0 ? "bg-[#21272e]" : "bg-transparent"
                                                }`}
                                        >
                                            <td
                                                className="px-6 py-4 rounded-tl-xl rounded-bl-xl" // Green text for rank
                                            >
                                                {index}
                                            </td>
                                            <td
                                                className="px-6 py-4" // Green text for name
                                            >
                                                {entry.email}
                                            </td>
                                            <td
                                                className="px-6 py-4" // Green text for score
                                            >
                                                {entry.points}
                                            </td>
                                            <td
                                                className="px-6 py-4" // Green text for finish time
                                            >
                                                {entry.finishTime}
                                            </td>
                                            {entry.questions.map((q, idx) => (
                                                <td
                                                    key={idx}
                                                    className="px-6 py-4" // Green text for question status
                                                >
                                                    {q.status === "pass" ? (
                                                        <span className="text-[#23d18b] text-lg font-semibold">✔</span> // Green for pass
                                                    ) : q.status === "fail" ? (
                                                        <span className="text-red-500 text-lg font-semibold">❌</span> // Red for fail
                                                    ) : (
                                                        <span className="text-gray-500 text-lg font-semibold">-</span>
                                                    )}
                                                </td>
                                            ))}
                                            <td
                                                className="px-6 py-4 rounded-tr-xl rounded-br-xl" // Green text for last cell
                                            />
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

export default Leaderboard;