import HomeComponent from "../components/HomeComponent";
import UploadExcel from "../components/UploadExcel";
import AddEvents from "../components/AddEvents";
import { useEffect, useState } from "react";
const Home = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
        const userType = user?.userType || null;
        setIsAdmin(userType === "admin");
    }, []);
    return (
        <div className="w-full bg-[#181C21] flex flex-col items-center justify-center ">
            <div className="  w-[65vw] min-h-screen py-10 bg-[#181C21] flex gap-10 ">
                <div className="flex flex-wrap justify-between w-[72%]">
                    <HomeComponent />
                </div>
                <div className="flex flex-col gap-16 w-[28%]">
                    {isAdmin && <AddEvents feat={"events"} />}
                    {isAdmin && <UploadExcel />}
                </div>
            </div>
        </div>
    );
};

export default Home;