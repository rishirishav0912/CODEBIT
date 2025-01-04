import { useState } from "react";
import { ResizableBox } from "react-resizable"
import "react-resizable/css/styles.css";
import SubmitCode from "./SubmitCode";
import CustomIO from "./CustomIO";



const OutputSection = ({ w, h }) => {
    const [selectedButton, setSelectedButton] = useState("btn-1");

    return (
        <ResizableBox height={0.27 * h} width={w}
            className="overflow-y-auto scroll-color" minConstraints={[0.1 * w, 0.27 * h]} maxConstraints={[1.5 * w, 0.61 * h]} resizeHandles={['n']}
        >
            <>
                <div className="flex space-x-6 p-4 font-semibold text-[17px]">
                    <button
                        onClick={() => setSelectedButton("btn-1")}
                        className={`pb-1 ${selectedButton === "btn-1" ? "border-b-[4px] border-[#23d18b] text-[#23d18b]" : "text-gray-400"}`}>Custom Testcases</button>
                    <button
                        onClick={() => setSelectedButton("btn-2")}
                        className={`pb-1 ${selectedButton === "btn-2" ? "border-b-[4px] border-[#23d18b] text-[#23d18b]" : "text-gray-400"}`}>Submit Code</button>
                </div>
                {selectedButton === "btn-1" ?
                    <CustomIO />
                    :
                    <SubmitCode />
                }
            </>
        </ResizableBox>
    )
}

export default OutputSection;