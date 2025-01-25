import ContestHackathonEvents from "../components/ContestHackathonEvents";
import AddEvents from "../components/AddEvents";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const ContestHackathon = () => {
    const { feat } = useParams();
    const userType = JSON.parse(localStorage.getItem("user"))?.userType || "null";
    return (

        <div className="flex bg-[#171717] w-full ">
            <Navbar />
            <div className="flex flex-wrap flex-col gap-16 items-start bg-[#171717] text-slate-300 rounded-2xl box-border w-[65vw] ml-20 ">
                <div className="flex justify-between w-[100%] h-fit">
                    <div className="w-[70%] h-fit">
                        <ContestHackathonEvents UP="upcoming" feat={feat} />
                    </div>
                    <div className="w-[28%] ml-40">
                        {userType === "admin" ? <AddEvents feat={feat} /> : null}
                    </div>
                </div>
                <div className="w-[70%] ">
                    <ContestHackathonEvents UP="past" feat={feat} />
                </div>
            </div>

        </div>
    );
};
export default ContestHackathon;