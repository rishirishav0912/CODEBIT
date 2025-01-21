import ContestHackathonTable from "./ContestHackathonTable";
const ContestHackathonEvents = ({ UP, feat }) => {

    return (
        <div className="flex flex-wrap flex-col max-w-[80vw] ">
            <p className="font-bold m-2 px-2 py-3 text-[28px] text-green-600 tracking-wide capitalize">{UP === "upcoming" ? `Current ${feat}` : `${UP} ${feat}`} </p>
            <div className="py-2 border-4s border-[#393530]s">
                <ContestHackathonTable UP={UP} feat={feat} />
            </div>
        </div>
    );
};
export default ContestHackathonEvents;