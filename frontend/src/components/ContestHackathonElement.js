import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import MyEditModal from "./EditModals";
import MyDeleteModal from "./DeleteModals";
import "react-toastify/dist/ReactToastify.css";
import { RegTimer, RunningTimer } from "./timer";

const ContestHackathonElement = ({
    compName,
    hackathonId,
    hackathonName,
    teamSize,
    registrationTimeline,
    hackathonTimeline,
    isRegistered,
}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user?.userType || null;
    const userEmail = user?.userid || null;
    const token = user?.tokene || null;
    const navigate = useNavigate();
    const [editHackathonModal, setEditHackathonModal] = useState(false);
    const [deleteHackathonModal, setDeleteHackathonModal] = useState(false);
    const [editContestModal, setEditContestModal] = useState(false); // New State
    const [deleteContestModal, setDeleteContestModal] = useState(false); // New State
    const [isProjectSubmitted, setIsProjectSubmitted] = useState(false);
    const convertToIST = (dateString) => {
        if (!dateString) return "N/A";
        const utcDate = new Date(dateString);
        const istDate = new Date(utcDate.getTime() - (5.5 * 60 * 60 * 1000));

        return istDate.toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };
    function isoToISTString(isoDate) {
        const date = new Date(isoDate); // Parse the ISO date
        const utcTime = date.getTime(); // Get UTC timestamp in milliseconds
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (+5:30)
        const istDate = new Date(utcTime - istOffset); // Adjust UTC to IST
        return istDate; // Convert to string with IST timezone
    }
    const currentDate = new Date();

    const registrationStart = registrationTimeline?.start ? convertToIST(registrationTimeline.start) : null;
    const registrationEnd = registrationTimeline?.end ? convertToIST(registrationTimeline.end) : null;
    const hackathonStart = hackathonTimeline?.start ? convertToIST(hackathonTimeline.start) : null;
    const hackathonEnd = hackathonTimeline?.end ? convertToIST(hackathonTimeline.end) : null;




    const registrationNotStarted = registrationStart && isoToISTString(registrationTimeline.start) > currentDate;
    const registrationClosed = registrationEnd && isoToISTString(registrationTimeline.end) < currentDate;
    const hackathonNotStarted = hackathonStart && isoToISTString(hackathonTimeline.start) > currentDate;

    const contestRunning = isoToISTString(hackathonTimeline.start) <= currentDate && isoToISTString(hackathonTimeline.end) >= currentDate; // Check if contest is running

    const hackathonEnded = hackathonEnd && isoToISTString(hackathonTimeline.end) < currentDate;
    let deadline;
    if (compName === "hackathon") {
        if (registrationNotStarted) {
            deadline = registrationStart;
        } else if (registrationClosed) {
            deadline = hackathonStart;
        }
    } else if (compName === "contest") {

        deadline = hackathonStart;

    }




    // Convert hackathonEnd to IST
    const hackathonStartIST = convertToIST(hackathonStart);
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
        userType !== "admin" && !registrationClosed && !isRegistered && isoToISTString(hackathonTimeline.end) > currentDate;
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
        <div className={`relative flex items-center justify-between text-sm lg:text-base pt-6 px-4 pb-8 border-2 border-[#333333] bg-[#262626] hover:border-[#174337] rounded-lg h-full lg:gap-8 ${currentDate > isoToISTString(hackathonTimeline.end) ? "w-[50vw]" : ""}`}>
            {userType === "admin" && (
                (compName === "hackathon" && currentDate < (isoToISTString(hackathonTimeline.end))) ||
                (compName === "contest" && currentDate < (isoToISTString(hackathonTimeline.end)))
            ) && (
                    <div className="flex gap-4 px-2 py-1 absolute right-8 top-4">
                        <img
                            src="images/edit1.png"
                            alt="edit"
                            onClick={() => compName === "hackathon"
                                ? setEditHackathonModal(true)
                                : setEditContestModal(true)}
                            className="w-[20px] h-[20px] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 "
                        />
                        <img
                            src="images/delete1.png"
                            alt="delete"
                            onClick={() => compName === "hackathon"
                                ? setDeleteHackathonModal(true)
                                : setDeleteContestModal(true)}
                            className="w-[20px] h-[20px] hover:cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200"

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
                            {registrationTimeline?.start ? convertToIST(registrationTimeline.start) : "N/A"} to{" "}
                            {registrationTimeline?.end ? convertToIST(registrationTimeline.end) : "N/A"}
                        </div>
                        <div>
                            <strong>Hackathon:</strong>{" "}
                            {hackathonTimeline?.start ? convertToIST(hackathonTimeline.start) : "N/A"} to{" "}
                            {hackathonTimeline?.end ? convertToIST(hackathonTimeline.end) : "N/A"}
                        </div>
                    </>
                )}

                {compName === "contest" && (
                    <>
                        <div>
                            <strong>Contest Date:</strong>{" "}
                            {hackathonStart
                                ? new Date(hackathonStart).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                })
                                : "N/A"}
                        </div>
                        <div>
                            <strong>Contest Time:</strong>{" "}
                            {hackathonStart && hackathonEnd
                                ? `${new Date(hackathonStart).toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })} - ${new Date(hackathonEnd).toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}`
                                : "N/A"}
                        </div>
                    </>
                )}
                {(
                    (compName === "hackathon" && registrationNotStarted) ||
                    (compName === "contest" && currentDate < isoToISTString(hackathonTimeline.start)
                        ? true
                        : currentDate < isoToISTString(hackathonTimeline.end))
                ) && (

                        <div className="font-bold flex items-center gap-4 ">
                            {(compName === 'contest') && (contestRunning ?
                                <><span>Contest Ends in : </span> <RunningTimer deadline={hackathonEnd} compName={compName} /></>
                                :
                                <><span>Contest Starts in : </span> <RegTimer deadline={hackathonStart} compName={compName} />
                                </>)
                            }

                            {
                                (compName === 'hackathon') && (
                                    (currentDate >= isoToISTString(registrationTimeline.start) &&
                                        currentDate <= isoToISTString(registrationTimeline.end)) ?
                                        (<>Registration Closes in : <RegTimer compName={compName} deadline={registrationEnd} /></>)
                                        :
                                        (currentDate >= isoToISTString(hackathonTimeline.start) &&
                                            currentDate <= isoToISTString(hackathonTimeline.end) &&
                                            <>Hackathon Ends in : <RunningTimer compName={compName} deadline={hackathonEnd} /></>)
                                )
                            }
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
                            currentDate >= isoToISTString(hackathonTimeline.start) &&
                            currentDate <= isoToISTString(hackathonTimeline.end) && ( // Only show if hackathon has not ended
                                <div
                                    onClick={isProjectSubmitted ? null : handleEnterClick}
                                    className={`w-fit ${isProjectSubmitted
                                        ? "bg-gray-500s cursor-not-allowed"
                                        : "hover:bg-[#0a9160]s cursor-pointer bg-[#0DB276]s border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399]"
                                        } rounded-lg py-2 px-4 text-center`}
                                >
                                    {isProjectSubmitted ? (
                                        <button onClick={() => navigate(`/editsubmission/${hackathonId}`)}
                                            className="w-fit cursor-pointer border-2 border-[#174337] hover:bg-[#1D332D] text-[#34D399] rounded-lg py-2 px-4 text-center"
                                        >
                                            Edit Submission
                                        </button>
                                    ) : "Enter →"}
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