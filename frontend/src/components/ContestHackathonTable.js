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
    function isoToISTString(isoDate) {
        const date = new Date(isoDate); // Parse the ISO date
        const utcTime = date.getTime(); // Get UTC timestamp in milliseconds
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (+5:30)
        const istDate = new Date(utcTime - istOffset); // Adjust UTC to IST
        return istDate; // Convert to string with IST timezone
    }


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
                            ? isoToISTString(h.hackTime.end) > currentDate
                            : isoToISTString(h.hackTime.end) <= currentDate
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
                            ? isoToISTString(c.endTime) > currentDate
                            : isoToISTString(c.endTime) <= currentDate
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

    const renderHackathonList = () => {

        const settings = {
            centerMode: true,
            infinite: !(hackathons.length === 1),
            arrows: !(hackathons.length === 1),
            slidesToShow: 1,
            centerPadding: "60px",
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 800
        };

        return <>{UP === "upcoming" ? <Slider {...settings} className="w-[50vw] h-fit duration-1000">
            {
                hackathons.map(({ _id, hackName, tSize, regTime, hackTime }) => {
                    const isRegistered = userRegistrations.includes(_id); // Check if the user is registered

                    return (
                        <div key={_id} className="flex flex-col p-4 rounded-lg w-[100%]">
                            <ContestHackathonElement
                                key={_id}
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
                })
            }
        </Slider>
            : <>
                {
                    hackathons.map(({ _id, hackName, tSize, regTime, hackTime }) => {
                        const isRegistered = userRegistrations.includes(_id); // Check if the user is registered

                        return (
                            <div key={_id} className="flex flex-col p-4 rounded-lg w-[100%]">
                                <ContestHackathonElement
                                    key={_id}
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
                    })
                }
            </>
        }
        </>
    }

    const renderContestList = () => {
        const settings = {
            centerMode: true,
            infinite: !(contests.length === 1),
            arrows: !(contests.length === 1),
            slidesToShow: 1,
            centerPadding: "60px",
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 800
        };

        return <>{UP === "upcoming" ? <Slider {...settings} className="w-[50vw] h-fit duration-1000">
            {contests.map(({ _id, contName, startTime, endTime }) => {

                const isRegistered = userRegistrationscontest.some(reg => reg.contestId === _id);

                return (
                    <div key={_id} className="flex rounded-lg p-4 w-[100%] focus:scale-105 duration-500">
                        <ContestHackathonElement
                            key={_id}
                            compName="contest"
                            hackathonId={_id}
                            hackathonName={contName}
                            hackathonTimeline={{ start: startTime, end: endTime }}
                            isRegistered={isRegistered}
                        />
                    </div>
                );
            })}
        </Slider> : <div className="w-[50vw]">
            {contests.map(({ _id, contName, startTime, endTime }) => {

                const isRegistered = userRegistrationscontest.some(reg => reg.contestId === _id);

                return (
                    <div key={_id} className="flex w-[100%] rounded-lg p-4 ">
                        <ContestHackathonElement
                            key={_id}
                            compName="contest"
                            hackathonId={_id}
                            hackathonName={contName}
                            hackathonTimeline={{ start: startTime, end: endTime }}
                            isRegistered={isRegistered}
                        />
                    </div>
                );
            })}
        </div>}</>
    }

    return (
        <div className="relative flex flex-col w-full slider-container">
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