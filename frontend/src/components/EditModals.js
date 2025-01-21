import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const MyEditModal = ({ closeEditModal, hackathonId ,compName,hackathonName }) => {
   
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflowY;
        const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

        // Calculate and apply the scrollbar width as padding
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflowY = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            // Restore original styles when modal is closed
            document.body.style.overflowY = originalStyle;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, []);
    const navigate = useNavigate();
    return (
        <div className="fixed h-fit inset-0 flex items-center justify-center p-3">
            <div className="relative border-2 border-[#333333] bg-[#262626] w-[30vw] text-slate-50 rounded-lg">
                <div className="flex items-center justify-center absolute right-2 text-slate-300 text-xl px-2 hover:cursor-pointer hover:rounded-[100%]  active:scale-90 transition duration-150">
                    <p
                        onClick={closeEditModal}
                        className="p-2"
                    >
                        x
                    </p>
                </div>

                <h2 className="text-xl text-center text-[#34D399] py-2 border-b-2 border-b-[#333333]">{hackathonName}</h2>
                <div className="w-full flex flex-col gap-5 py-5 px-6">
                    <p className="text-lg text-slate-300">Do you want to edit {compName} details?</p>
                    <div className="flex flex-wrap gap-4 items-center justify-end pr-4">
                        <button
                            className="w-[25%] px-4 py-2 text-lg border-2 border-[#174337] text-[#23d18b] bg-[#1D332D] hover:bg-[#1b2f29] active:translate-y-[2px] cursor-pointer rounded-lg  transition duration-150"
                            onClick={closeEditModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-[25%] px-4 py-2 text-lg border-2 border-[#174337] text-[#23d18b] bg-[#1D332D] hover:bg-[#1b2f29] active:translate-y-[2px] active:bg-[#098c5a] cursor-pointer rounded-lg transition duration-150"
                            onClick={() => {
                                if (compName === "hackathon") {
                                    navigate(`/edithackathon/${hackathonId}`);
                                } else if (compName === "contest") {
                                    navigate(`/editcontest/${hackathonId}`);
                                }
                                else if(compName==="Event"){
                                    navigate(`/editevent/${hackathonId}`);

                                }
                            }}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MyEditModal;