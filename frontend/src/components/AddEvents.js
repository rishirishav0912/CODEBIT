import { useNavigate } from 'react-router-dom';

const AddEvents = ({ feat }) => {
    const navigate = useNavigate();

    const handleCreateClick = () => {
        if (feat === "hackathon") {
            navigate("/createhackathon");
        } else if (feat === "contest") {
            navigate("/createcontest");
        }
        else if (feat === "events") {
            navigate("/addevents");
        }
    };

    return (
        <div className="border-4 border-[#393530] h-[320px]
         flex flex-col gap-8 items-center justify-center rounded-lg my-12 mx-4 ">
            <div className="text-center text-4xl font-bold capitalize text-slate-300">
                Organize A
                <div className="text-green-400 py-3">{feat}</div>
            </div>
            <div className="">
                <div
                    className="rounded-lg text-[18px] text-center text-slate-200 font-semibold 
                bg-[#0DB276] hover:bg-[#0aa46c] hover:cursor-pointer transition delay-100 py-2 px-4"
                    onClick={handleCreateClick}
                >
                    Create {feat}
                </div>
            </div>
        </div>
    );
};

export default AddEvents;