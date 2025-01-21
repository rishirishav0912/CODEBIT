// import { useEffect, useState } from "react";
import { useCodeContext } from "../hooks/useCodeContext"

const TestCaseBox = ({ index, status, isCorrect, errorMessage }) => {
    return (
        <div className="border border-[#293139]d bg-[#21272e]d p-3 h-[1%] w-[17%] font-semibold tracking-wide text-slate-300 rounded m-1 flex flex-col flex-wrap justify-center items-center border-[#333333] bg-[#262626]">
            <h1>Test Case {index}</h1>
            {
                status ?
                    status === 'Accepted' ?
                        isCorrect ? <p className="material-icons text-[#23d18b] pt-1">task_alt</p>
                            : <p className="material-icons text-[#E23830] pt-1">dangerous</p>
                        :
                        status === "Forcefully Terminated" ? <>
                            <span className="material-icons text-[#F0B90B] pt-1">
                                error
                            </span>
                            <span className="flex flex-wrap text-[12px] text-[#F0B90B] pt-1">
                                {status}
                            </span>
                        </> :
                            status === 'Time Limited Exceeded' ?
                                <>
                                    <span className="material-icons text-[#F0B90B] pt-1">
                                        timer
                                    </span>
                                    <span className="flex flex-wrap text-[12px] text-[#F0B90B] pt-1">
                                        {errorMessage}
                                    </span>
                                </>
                                : <>
                                    <span className="material-icons text-[#F0B90B] pt-1">
                                        error
                                    </span>
                                    <span className="flex flex-wrap text-[12px] text-[#F0B90B] pt-1">
                                        {errorMessage}
                                    </span>
                                </>
                    :
                    <span className="material-icons text-[#E23830] pt-1">pending</span>
            }
        </div>
    )
}


const SubmitCode = () => {
    const { triggerSubmission, testcasesResult, codeSubmitted, customIOSubmitted } = useCodeContext();

    return (
        <div className="px-4 py-1">
            <button className={`border border-[#293139]d border-[#174337] bg-[#1D332D] hover:bg-[#064e3b]  hover:bg-[#21272e]d p-1 py-2 h-[1%] w-[19%] font-semibold tracking-wide text-[#23d18b] rounded ${codeSubmitted || customIOSubmitted ? "cursor-not-allowed" : ""}`}
                onClick={triggerSubmission}
                disabled={codeSubmitted || customIOSubmitted}
            >
                {codeSubmitted ? `Running Testcases` : `Submit Solution`}
            </button>
            <div className="h-full w-full space-x-4 flex mt-2">
                {testcasesResult.map((testcase, index) => {
                    console.log(testcase);
                    return (<TestCaseBox status={testcase.status} isCorrect={testcase.isCorrect} errorMessage={testcase.error} index={index} />)
                })}
            </div>

        </div>
    )
}

export default SubmitCode;