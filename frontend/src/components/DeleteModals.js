import { useEffect } from "react";

const MyDeleteModal = ({ closeDeleteModal ,hackathonId ,compName,hackathonName}) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const userType = user?.userType || null;
    const userEmail = user?.userid || null;
    const token = user?.tokene || null;
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

    const handleDelete = async () => {
        try {
            // Dynamically decide the endpoint based on compName
            const deleteEndpoint =
                compName === "hackathon"
                    ? `http://localhost:4000/auth/deletehackathon/${hackathonId}`
                    : compName === "contest"
                    ? `http://localhost:4000/auth/deletecontest/${hackathonId}`
                    :compName==="Event"
                    ? `http://localhost:4000/auth/deleteevent/${hackathonId}`
                    : null;

            if (!deleteEndpoint) {
                console.error("Invalid compName provided.");
                return;
            }

            const response = await fetch(deleteEndpoint, {
                method: "DELETE",
                headers: {
                    Authorization: token, // Use your auth mechanism
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete the ${compName}`);
            }

            const result = await response.json();
            alert(`Successfully deleted the ${compName}!`);
            closeDeleteModal(); // Close the modal after successful deletion
            // Optionally, refresh the list or redirect the user
        } catch (error) {
            console.error(`Error deleting ${compName}:`, error);
            alert(`Error deleting the ${compName}: ${error.message}`);
        }
    };


    return (
        <div className="fixed inset-0 h-fit flex items-center justify-center p-4">
            <div className="relative border-2 border-[#333333] bg-[#262626] w-[30vw] text-slate-50 rounded-lg">
                <div className="flex items-center justify-center absolute right-2 text-slate-300 text-xl px-2 hover:cursor-pointer hover:rounded-[100%]  active:scale-90 transition duration-150">
                    <p
                        onClick={closeDeleteModal}
                        className="p-2"
                    >
                        x
                    </p>
                </div>

                <h2 className="text-xl text-center py-2 border-b-2 border-b-[#333333]">{hackathonName}</h2>
                <div className="w-full flex flex-col gap-4 py-4 px-6">
                    <p className="text-lg text-slate-300">Are you sure you want to proceed with deleting this {compName} program?</p>

                    <div className="flex flex-wrap gap-4 items-center justify-end pr-4">
                        <button
                            className="w-[25%] px-4 py-2 text-lg  border-2 border-[#174337] text-[#23d18b] bg-[#1D332D] hover:bg-[#1b2f29]  active:translate-y-[2px] cursor-pointer rounded-lg transition duration-150"
                            onClick={closeDeleteModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-[25%] px-4 py-2 text-lg border-2 border-[#174337] text-[#23d18b] bg-[#1D332D] hover:bg-[#1b2f29]  active:translate-y-[2px] cursor-pointer rounded-lg transition duration-150"
                            onClick={handleDelete}
                                
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MyDeleteModal;