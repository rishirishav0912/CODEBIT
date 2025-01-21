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
    <div className="min-h-screen text-[#E5E5E5] p-4 sm:p-8 bg-[#171717]">
      {/* Header with Toggle Buttons */}
      <div className="flex justify-start space-x-6 mb-8 pl-20 pt-8">
        <button
          className={`pb-1 text-lg font-semibold ${viewType === "Participants"
            ? "border-b-[4px] border-[#34D399] text-[#34D399]"
            : "hover:text-[#34D399] transition duration-200"}`
          }
          onClick={() => setViewType("Participants")}
        >
          Participants
        </button>
        <button
          className={`pb-1 text-lg font-semibold ${viewType === "Leaderboard"
            ? "border-b-[4px] border-[#34D399] text-[#34D399]"
            : "hover:text-[#34D399] transition duration-200"}`
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
          <div className="overflow-x-auto w-[60vw] h-full rounded-lg mx-auto">
            <table className="table-auto w-full max-w-7xl mx-auto border-2 border-[#333333] bg-[#262626] text-[#E5E5E5E5] rounded-lg">
              <thead>
                <tr className="border-b-2 border-b-[#333333] text-xl">
                  <th className="px-4 py-3 text-left">Roll Number</th>
                  <th className="px-4 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {contestData?.map((participant, index) => (

                  <tr key={index} className="border-b-2 border-b-[#333333] hover:bg-[#232A28] hover:text-[#34D399]">
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
