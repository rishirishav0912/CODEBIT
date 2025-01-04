import ContestHackathonEvents from "../components/ContestHackathonEvents";
import AddEvents from "../components/AddEvents";
import { useParams } from "react-router-dom";
const ContestHackathon = () => {
    const { feat } = useParams();
    const userType = JSON.parse(localStorage.getItem("user"))?.userType || "null";
    return (

        <div className="flex flex-wrap flex-col items-center justify-center bg-[#181C21] px-4 py-10 w-full ">
            <div className="flex flex-wrap flex-col gap-16 items-start bg-[#181C21] text-slate-300 rounded-2xl box-border w-[65vw]  ">
                <div className="flex justify-between w-[100%] ">
                    <div className="w-[70%] ">
                        <ContestHackathonEvents UP="upcoming" feat={feat} />
                    </div>
                    <div className="w-[28%] ">
                        {userType === "admin" ? <AddEvents feat={feat} /> : null}
                    </div>
                </div>
                <div className="w-[70%] ">
                    <ContestHackathonEvents UP="past" feat={feat} />
                </div>
            </div>

        </div >
    );
};
export default ContestHackathon;