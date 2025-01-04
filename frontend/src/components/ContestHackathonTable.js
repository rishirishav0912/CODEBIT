import React, { useEffect, useState } from "react";
import ContestHackathonElement from "./ContestHackathonElement";

const ContestHackathonTable = ({ UP, feat }) => {

    const [hackathons, setHackathons] = useState([]);
    const [contests, setContests] = useState([]);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [userRegistrationscontest, setUserRegistrationscontest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date();

                if (feat === "hackathon") {
                    // Fetch hackathons
                    const hackathonResponse = await fetch("http://localhost:4000/hackathons");

                    const hackathonData = await hackathonResponse.json();

                    const filteredHackathons = hackathonData.filter(h =>
                        UP === "upcoming"
                            ? new Date(h.hackTime.start) > currentDate
                            : new Date(h.hackTime.start) <= currentDate
                    );

                    setHackathons(filteredHackathons);

                    // Fetch user registrations for hackathons
                    const user = JSON.parse(localStorage.getItem("user"));
                    const email = user?.userid;
                    const userType=user?.userType;
                  
                    if (email ) {
                       
                        const registrationResponse = await fetch(
                            `http://localhost:4000/user-registrations?email=${encodeURIComponent(email)}`
                        );
                        const registrationData = await registrationResponse.json();
                        setUserRegistrations(registrationData.map(reg => reg.hackid));}
                    
                } else if (feat === "contest") {
                    // Fetch contests
                    const contestResponse = await fetch("http://localhost:4000/contests");
                    const contestData = await contestResponse.json();

                    const filteredContests = contestData.filter(c =>
                        UP === "upcoming"
                            ? new Date(c.startTime) > currentDate
                            : new Date(c.startTime) <= currentDate
                    );

                    setContests(filteredContests);
                    const user = JSON.parse(localStorage.getItem("user"));
                    const email = user?.userid;
                    const userType=user?.userType;
                 
                    if (email ) {
                        
                        const registrationResponse = await fetch(
                            `http://localhost:4000/user-registrationscontest?email=${encodeURIComponent(email)}`
                        );
                        const registrationData = await registrationResponse.json();

                        setUserRegistrationscontest(registrationData.registeredContests.filter(reg => reg.contestId));
                    
                    }
                    

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [UP, feat]);

    const renderHackathonList = () =>

        hackathons.map(({ _id, hackName, tSize, regTime, hackTime }) => {
            const isRegistered = userRegistrations.includes(_id); // Check if the user is registered

            return (
                <div key={_id} className="flex flex-col p-4 rounded-lg w-[100%]">
                    <ContestHackathonElement
                        compName="hackathon"
                        hackathonId={_id}
                        hackathonName={hackName}
                        teamSize={tSize}
                        registrationTimeline={regTime}
                        hackathonTimeline={hackTime}
                        isRegistered={isRegistered} // Pass registration status
                    />
                </div>
            );
        });

    const renderContestList = () =>

        contests.map(({ _id, contName, startTime, endTime }) => {

            const isRegistered = userRegistrationscontest.some(reg => reg.contestId === _id);

            return (
                <div key={_id} className="flex flex-col  rounded-lg p-4 w-[100%]">
                    <ContestHackathonElement
                        compName="contest"
                        hackathonId={_id}
                        hackathonName={contName}
                        hackathonTimeline={{ start: startTime, end: endTime }}
                        isRegistered={isRegistered}
                    />
                </div>
            );
        });

    return (
        <div className="flex flex-col w-[100%]">
            {loading ? (
                <p>Loading...</p>
            ) : feat === "hackathon" ? (
                hackathons.length > 0 ? (
                    renderHackathonList()
                ) : (
                    <p>No hackathons found.</p>
                )
            ) : feat === "contest" ? (
                contests.length > 0 ? (
                    renderContestList()
                ) : (
                    <p>No contests found.</p>
                )
            ) : (
                <p>Invalid value for UP.</p>
            )}
        </div>
    );
};

export default ContestHackathonTable;