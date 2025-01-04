import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Leaderboard from "../components/LeaderBoard";  // Assuming the Leaderboard component is in the same directory

const ContestmanagePage = () => {
  const { contestId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.tokene || null;

  const [viewType, setViewType] = useState("Participants");
  const [contestData, setContestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/auth/contesthist/${contestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Send the token in the Authorization header
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch contest data");
        }
        const data = await response.json();
        setContestData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching contest data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, [contestId]);

  if (isLoading) {
    return <div className="text-center text-green-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-slate-300 p-4 sm:p-8 bg-[#181C21]">
      {/* Header with Toggle Buttons */}
      <div className="flex justify-start space-x-6 mb-8 pl-20 pt-8">
        <button
          className={`pb-1 text-lg font-semibold ${viewType === "Participants"
            ? "border-b-[4px] border-[#0DB276] text-[#0DB276]"
            : "text-gray-400 hover:text-[#0DB276]"}`
          }
          onClick={() => setViewType("Participants")}
        >
          Participants
        </button>
        <button
          className={`pb-1 text-lg font-semibold ${viewType === "Leaderboard"
            ? "border-b-[4px] border-[#0DB276] text-[#0DB276]"
            : "text-gray-400 hover:text-[#0DB276]"}`
          }
          onClick={() => setViewType("Leaderboard")}
        >
          Leaderboard
        </button>
      </div>

      {viewType === "Participants" && (
        <div>
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-green-400 text-center mb-6">Registered Participants</h1>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full max-w-7xl mx-auto bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700 text-xl">
                  <th className="px-4 py-3 text-left text-green-400">Roll Number</th>
                  <th className="px-4 py-3 text-left text-green-400">Email</th>
                </tr>
              </thead>
              <tbody>
              {contestData?.map((participant, index) => (
                
            <tr key={index} className="border-b border-gray-700">
              <td className="px-4 py-3 text-sm">{participant.roll}</td>
              <td className="px-4 py-3 text-sm">{participant.email}</td>
            </tr>
          ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewType === "Leaderboard" && (
        <div>
          {/* Leaderboard Component */}
          <Leaderboard />
        </div>
      )}
    </div>
  );
};

export default ContestmanagePage;
