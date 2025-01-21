import React, { useEffect, useState } from "react";
import ContestHackathonElement from "./ContestHackathonElement";
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
                            ? new Date(h.hackTime.end) > currentDate
                            : new Date(h.hackTime.end) <= currentDate
                    );

                    setHackathons(filteredHackathons);

                    // Fetch user registrations for hackathons
                    const user = JSON.parse(localStorage.getItem("user"));
                    const email = user?.userid;
                    const userType = user?.userType;

                    if (email) {

                        const registrationResponse = await fetch(
                            `http://localhost:4000/user-registrations?email=${encodeURIComponent(email)}`
                        );
                        const registrationData = await registrationResponse.json();
                        setUserRegistrations(registrationData.map(reg => reg.hackid));
                    }

                } else if (feat === "contest") {
                    // Fetch contests
                    const contestResponse = await fetch("http://localhost:4000/contests");
                    const contestData = await contestResponse.json();

                    const filteredContests = contestData.filter(c =>
                        UP === "upcoming"
                            ? new Date(c.endTime) > currentDate
                            : new Date(c.endTime) <= currentDate
                    );

                    setContests(filteredContests);
                    const user = JSON.parse(localStorage.getItem("user"));
                    const email = user?.userid;
                    const userType = user?.userType;

                    if (email) {

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

    const renderContestList = () => {
        const settings = {
            centerMode: true,
            slidesToShow: 1,
            centerPadding: "60px",
            autoplay: true,
            autoplaySpeed: 3000,
            speed:800
        };

        return <>{UP === "upcoming" ? <Slider {...settings} className="w-[50vw] h-fit duration-1000">
            {contests.map(({ _id, contName, startTime, endTime }) => {

                const isRegistered = userRegistrationscontest.some(reg => reg.contestId === _id);

                return (
                    <div key={_id} className="flex rounded-lg p-4 w-[100%] focus:scale-105 duration-500">
                        <ContestHackathonElement
                            compName="contest"
                            hackathonId={_id}
                            hackathonName={contName}
                            hackathonTimeline={{ start: startTime, end: endTime }}
                            isRegistered={isRegistered}
                        />
                    </div>
                );
            })}
        </Slider> : <>
            {contests.map(({ _id, contName, startTime, endTime }) => {

                const isRegistered = userRegistrationscontest.some(reg => reg.contestId === _id);

                return (
                    <div key={_id} className="flex rounded-lg p-4 ">
                        <ContestHackathonElement
                            compName="contest"
                            hackathonId={_id}
                            hackathonName={contName}
                            hackathonTimeline={{ start: startTime, end: endTime }}
                            isRegistered={isRegistered}
                        />
                    </div>
                );
            })}
        </>}</>
    }

    return (
        <div className="flex flex-col w-[100%] slider-container">
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