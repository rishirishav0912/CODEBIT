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
        <div className=" border-2 border-[#333333] h-[320px]
         flex flex-col gap-8 items-center justify-center rounded-lg my-12 mx-4 p-4 text-[#E5E5E5]">
            <div className="text-center text-4xl font-bold capitalize">
                Organize A
                <div className="text-[#34D399] py-3">{feat}</div>
            </div>
            <div className="">
                <div
                    className=" rounded-lg text-[18px] text-center  font-semibold 
                text-[#34D399] bg-[#1D332D] hover:bg-[#1b2f29] border-2 border-[#174337] hover:cursor-pointer transition delay-100 py-2 px-4"
                    onClick={handleCreateClick}
                >
                    Create {feat}
                </div>
            </div>
        </div>
    );
};

export default AddEvents;