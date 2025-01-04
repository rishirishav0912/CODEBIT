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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="relative bg-[#1F252B] w-[30vw] text-slate-50 rounded-lg border-[4px] border-[#0DB276]">
                <div className="flex items-center justify-center absolute right-2 text-slate-300 text-4xl px-2 hover:cursor-pointer hover:rounded-[100%]  active:scale-90 transition duration-150">
                    <p
                        onClick={closeDeleteModal}
                        className="p-2"
                    >
                        x
                    </p>
                </div>

                <h2 className="bg-[#0DB276] text-3xl text-center py-2 ">{hackathonName}</h2>
                <div className="w-full flex flex-col gap-8 py-6 px-6">
                    <p className="text-2xl text-slate-300">Are you sure you want to proceed with deleting this {compName} program?</p>

                    <div className="flex flex-wrap gap-4 items-center justify-end pr-4">
                        <button
                            className="w-[25%] px-4 py-2 text-xl border-2 border-[#0DB276] hover:bg-[#0aa46c] active:translate-y-[2px] active:bg-[#098c5a] cursor-pointer rounded-lg bg-[#0DB276] transition duration-150"
                            onClick={closeDeleteModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-[25%] px-4 py-2 text-xl border-2 border-[#0DB276] hover:bg-[#0aa46c] active:translate-y-[2px] active:bg-[#098c5a] cursor-pointer rounded-lg bg-[#0DB276] transition duration-150"
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