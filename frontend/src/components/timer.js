import React, { useState, useEffect } from "react";
import useInstance from "../hooks/useIntance"

export const RegTimer = ({ deadline, compName }) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const {instanceCreate} = useInstance();

    // create a contest insatnce 30 min before the contest

    const getTime = (deadline) => {
        const time = Date.parse(deadline) - Date.now();
        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / (1000 * 60)) % 60));
        setSeconds(Math.floor((time / 1000) % 60));

        // Check for the exact 30-minute mark
        if (days === 0 && hours === 0 && minutes === 30 && seconds === 0 && compName === "contest") {
            instanceCreate();
        }
    };

    useEffect(() => {
        const interval = setInterval(() => getTime(deadline), 1000);
        return () => clearInterval(interval);
    }, [deadline]); // Include compName as a dependency

    return (
        <div className="text-[15px] text-[#0DB256]">
            {(days < 1 && days >= 0) ? (
                <div className="flex">
                    <p>{hours.toString().padStart(2, '0')}:</p>
                    <p>{minutes.toString().padStart(2, '0')}:</p>
                    <p>{seconds.toString().padStart(2, '0')}</p>
                </div>
            ) : ((days < 5 && days > 0) ? (
                <div className="flex justify-center items-center ">
                    <p>{days}d</p>
                    <p>{hours.toString().padStart(2, '0')}h</p>
                    <p>{minutes.toString().padStart(2, '0')}m</p>
                    <p>{seconds.toString().padStart(2, '0')}s</p>
                </div>
            ) : ((days > 0) ? (
                <div>{days}days</div>
            ) : (
                <div></div>
            )
            ))}
        </div>
    );
};


export const RunningTimer = ({ deadline, compName}) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const {instanceDelete} = useInstance();

    const getTime = (deadline) => {
        const time = Date.parse(deadline) - Date.now();
        setHours(Math.floor(time / (1000 * 60 * 60) % 24));
        setMinutes(Math.floor(time / (1000 * 60) % 60));
        setSeconds(Math.floor(time / (1000) % 60));

        // Check for the ending of contest
        if (hours === 0 && minutes === 0 && seconds === 0 && compName === "contest") {
            instanceDelete();
        }
    };
    useEffect(() => {
        const interval = setInterval(() => getTime(deadline), 1000);
        return () => clearInterval(interval);
    }, [deadline]);
    return (
        <div className="text-sm text-[#0DB256]">
            {(hours < 3 && hours >= 0) ? (
                <div className="flex">
                    <p>{hours.toString().padStart(2, '0')}h</p>
                    <p>{minutes.toString().padStart(2, '0')}m</p>
                    <p>{seconds.toString().padStart(2, '0')}s</p>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );

};;