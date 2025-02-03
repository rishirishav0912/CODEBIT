import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const DbUpdateContext = createContext();

export const DbUpdateProvider = ({ children }) => {
    const [dbChanged, setDbChanged] = useState(false);

    useEffect(() => {
        socket.on("dbUpdate", () => {
            console.log("Database changed");
            setDbChanged(true);
        });

        return () => socket.off("dbUpdate");
    }, []);

    useEffect(() => {
        if (dbChanged) {
            setTimeout(() => setDbChanged(false), 500); // Reset after 500ms
        }
    }, [dbChanged]);

    return (
        <DbUpdateContext.Provider value={{ dbChanged }}>
            {children}
        </DbUpdateContext.Provider>
    );
};
