import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import MyEditModal from "./EditModals";
import MyDeleteModal from "./DeleteModals";
import "react-toastify/dist/ReactToastify.css";
import { RegTimer } from "./timer";

const ContestHackathonElement = ({
    compName,
    hackathonId,
    hackathonName,
    teamSize,
    registrationTimeline,
    hackathonTimeline,
    isRegistered,
}) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null;
    const userEmail = user?.userid || null;
    const token = user?.tokene || null;
    const navigate = useNavigate();
    const [editHackathonModal, setEditHackathonModal] = useState(false);
    const [deleteHackathonModal, setDeleteHackathonModal] = useState(false);
    const [editContestModal, setEditContestModal] = useState(false); // New State
    const [deleteContestModal, setDeleteContestModal] = useState(false); // New State
    const [isProjectSubmitted, setIsProjectSubmitted] = useState(false);

    const currentDate = new Date();
    const registrationStart = registrationTimeline?.start ? new Date(registrationTimeline.start) : null;
    const registrationEnd = registrationTimeline?.end ? new Date(registrationTimeline.end) : null;
    const hackathonStart = hackathonTimeline?.start ? new Date(hackathonTimeline.start) : null;
    const hackathonEnd = hackathonTimeline?.end ? new Date(hackathonTimeline.end) : null;
    const registrationNotStarted = registrationStart && registrationStart > currentDate;
    const registrationClosed = registrationEnd && registrationEnd < currentDate;
    const hackathonNotStarted = hackathonStart && hackathonStart > currentDate;

    const contestRunning = hackathonStart <= currentDate && hackathonEnd >= currentDate; // Check if contest is running

    const hackathonEnded = hackathonEnd && hackathonEnd < currentDate;
    let deadline;
    if (compName === "hackathon") {
        if (registrationNotStarted) {
            deadline = registrationStart; // Registration hasn't started
        } else if (registrationClosed) {
            deadline = hackathonStart; // Registration closed, set hackathon start time as deadline
        }
    } else if (compName === "contest") {
        deadline = hackathonStart; // Contest deadline is always the contest start time
    }
    useEffect(() => {
        const checkProjectSubmission = async () => {
            if (!userEmail || !hackathonId) return;

            try {

                const response = await fetch(
                    `http://localhost:4000/auth/checkProjectSubmission?hackathonId=${hackathonId}&email=${userEmail}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setIsProjectSubmitted(data.submitted);
            } catch (error) {
                console.error("Error fetching project submission status:", error);
            }
        };

        checkProjectSubmission();
    }, [userEmail, hackathonId, token]);

    const isRegistrationOpen =
        userType !== "admin" && !registrationClosed && !isRegistered && hackathonEnd > currentDate;
    const canViewLeaderboard = hackathonEnded;
    const handleRegisterClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (compName === "contest") {
            try {
                const response = await fetch("http://localhost:4000/auth/register-contest", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        contestId: hackathonId,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Registration failed");
                }

                toast.success("Successfully registered for the contest!", {
                    position: "top-center",
                    onClose: () => window.location.reload(),
                });

            } catch (error) {
                console.error("Error registering:", error);
                toast.error("Registration failed. Try again later.", { position: "top-center" });
            }
        } else {
            navigate(`/teamregister/${hackathonId}`);
        }
    };

    const handleEnterClick = () => {
        if (!user) {
            navigate("/login");
        } else if (compName === 'hackathon') {
            navigate(`/projectsubmit/${hackathonId}`);
        }
        else if (compName === 'contest') {
            navigate(`/contestproblempage`, {
                state: {
                    id: hackathonId,
                    name: hackathonName,
                },
            });

        }

    };

    const handleManageClick = () => {
        if (compName === "hackathon") {
            navigate(`/managehackathon/${hackathonId}`);
        } else if (compName === "contest") {
            navigate(`/managecontest/${hackathonId}`);
        }
    };



    const closeEditModal = () => {
        if (compName === "hackathon") setEditHackathonModal(false);
        if (compName === "contest") setEditContestModal(false);
    };

    const closeDeleteModal = () => {
        if (compName === "hackathon") setDeleteHackathonModal(false);
        if (compName === "contest") setDeleteContestModal(false);
    };
    return (
        <div className={`relative flex items-center justify-between text-sm lg:text-base pt-6 px-4 pb-8 border-2 border-[#293139]s bg-[#21272e]s border-[#333333] bg-[#262626] hover:border-[#174337] rounded-lg h-full lg:gap-8 ${currentDate > hackathonEnd?"w-[49vw]":""}`}>
            {userType === "admin" && (
                (compName === "hackathon" && hackathonNotStarted) ||
                (compName === "contest" && currentDate < hackathonEnd)
            ) && (
                    <div className="flex gap-4 px-2 py-1 absolute right-8 top-4">
                        <img
                            src="\images\edit.png"
                            alt="edit"
                            onClick={() => compName === "hackathon"
                                ? setEditHackathonModal(true)
                                : setEditContestModal(true)}
                            className="w-[20px] h-[20px] filter invert-[50%] sepia-[80%] saturate-[500%] hue-rotate-[120deg] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 "
                        />
                        <img
                            src="\images\delete.png"
                            alt="delete"
                            onClick={() => compName === "hackathon"
                                ? setDeleteHackathonModal(true)
                                : setDeleteContestModal(true)}
                            className="w-[20px] h-[20px] filter invert-[50%] sepia-[80%] saturate-[500%] hue-rotate-[120deg] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200"

                        />
                        {compName === "hackathon" && editHackathonModal && (
                            <MyEditModal closeEditModal={closeEditModal} hackathonId={hackathonId} compName="hackathon" hackathonName={hackathonName} />
                        )}
                        {compName === "hackathon" && deleteHackathonModal && (
                            <MyDeleteModal closeDeleteModal={closeDeleteModal} hackathonId={hackathonId} compName="hackathon" hackathonName={hackathonName} />
                        )}
                        {compName === "contest" && editContestModal && (
                            <MyEditModal closeEditModal={closeEditModal} hackathonId={hackathonId} compName="contest" hackathonName={hackathonName} />
                        )}
                        {compName === "contest" && deleteContestModal && (
                            <MyDeleteModal closeDeleteModal={closeDeleteModal} hackathonId={hackathonId} compName="contest" hackathonName={hackathonName} />
                        )}
                    </div>

                )}

            <div className=" flex flex-col justify-center h-full ">
                <div className="text-lg lg:text-2xl font-bold text-green-500 py-2">{hackathonName}</div>
                {compName === "hackathon" && (
                    <>
                        <div>Team Size: {teamSize}</div>
                        <div>
                            <strong>Registration:</strong>{" "}
                            {registrationTimeline?.start
                                ? `${new Date(registrationTimeline.start).toLocaleString([], {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}`
                                : "N/A"}{" "}
                            to{" "}
                            {registrationEnd
                                ? `${registrationEnd.toLocaleString([], { dateStyle: "short", timeStyle: "short" })}`
                                : "N/A"}
                        </div>
                        <div>
                            <strong>Hackathon:</strong>{" "}
                            {hackathonTimeline?.start
                                ? `${hackathonStart.toLocaleString([], { dateStyle: "short", timeStyle: "short" })}`
                                : "N/A"}{" "}
                            to{" "}
                            {hackathonEnd
                                ? `${hackathonEnd.toLocaleString([], { dateStyle: "short", timeStyle: "short" })}`
                                : "N/A"}
                        </div>
                    </>
                )}

                {compName === "contest" && (
                    <>
                        <div>
                            <strong>Contest Date:</strong>{" "}
                            {hackathonStart
                                ? `${hackathonStart.toLocaleDateString([], { dateStyle: "medium" })}`
                                : "N/A"}
                        </div>
                        <div>
                            <strong>Contest Time:</strong>{" "}
                            {hackathonStart && hackathonEnd
                                ? `${hackathonStart.toLocaleTimeString([], { timeStyle: "short" })} - ${hackathonEnd.toLocaleTimeString(
                                    [],
                                    { timeStyle: "short" }
                                )}`
                                : "N/A"}
                        </div>
                    </>
                )}
                {(
                    (compName === "hackathon" && registrationNotStarted) ||
                    (compName === "contest" && currentDate < hackathonStart)
                ) && (
                        <div className="font-bold flex items-center gap-4 ">
                            <p>Start in : </p>
                            <RegTimer deadline={deadline} compName={compName} />
                        </div>
                    )}

            </div>

            <div className="flex flex-col items-center gap-3 lg:gap-4 w-[12vw]">

                {isRegistrationOpen && (
                    <div
                        onClick={handleRegisterClick}
                        className="w-fit hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s rounded-lg py-2 px-4 text-center border-2 border-[#174337]  hover:bg-[#1D332D] text-[#34D399]"
                    >
                        Register →
                    </div>
                )}

                {userType === "admin" && (
                    <div
                        onClick={handleManageClick}
                        className="w-fit hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s rounded-lg py-2 px-4 text-center border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399]"
                    >
                        Manage →
                    </div>
                )}

                {isRegistered && (
                    <>
                        {compName === "hackathon" &&
                            currentDate >= hackathonStart &&
                            currentDate <= hackathonEnd && ( // Only show if hackathon has not ended
                                <div
                                    onClick={isProjectSubmitted ? null : handleEnterClick}
                                    className={`w-fit ${isProjectSubmitted
                                        ? "bg-gray-500s cursor-not-allowed"
                                        : "hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399]"
                                        } rounded-lg py-2 px-4 text-center`}
                                >
                                    {isProjectSubmitted ? "Project Submitted" : "Enter →"}
                                </div>
                            )}

                        {compName === "contest" && contestRunning && (
                            <div
                                onClick={handleEnterClick}
                                className="w-fit hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399] rounded-lg py-2 px-4 text-center"
                            >
                                Enter →
                            </div>
                        )}
                    </>
                )}


                {canViewLeaderboard && userType !== "admin" && (
                    <div
                        onClick={() => {
                            if (compName === "contest") {
                                navigate(`/contestleaderboard/${hackathonId}`);
                            } else if (compName === "hackathon") {
                                navigate(`/hackathonleaderboard/${hackathonId}`);
                            }
                        }}
                        className="w-fit hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399] rounded-lg py-2 px-4 text-center"
                    >
                        View Results →
                    </div>
                )}
            </div>


        </div>
    );
};

export default ContestHackathonElement;