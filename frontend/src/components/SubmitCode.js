// import { useEffect, useState } from "react";
import { useCodeContext } from "../hooks/useCodeContext"

const TestCaseBox = ({ index, status, isCorrect }) => {
    return (
        <div className="border border-[#293139] bg-[#21272e] p-3 h-[1%] w-[17%] font-semibold tracking-wide text-slate-300 rounded m-1 text-center">
            <h1>Test Case {index}</h1>
            {
                status ?
                    status === 'Accepted' ?
                        isCorrect ? <p className="material-icons text-[#23d18b] pt-1">task_alt</p>
                            : <p className="material-icons text-[#E23830] pt-1">dangerous</p>
                        :
                        status === 'Time Limited Exceeded' ?
                            <span className="material-icons text-[#F0B90B] pt-1 flex flex-col flex-wrap">
                                timer
                                <span className="text-[9px] text-[#F0B90B]">{status}
                                </span>
                            </span>
                            : <span className="material-icons text-[#F0B90B] pt-1 flex flex-col flex-wrap w-full">
                                error
                                <span className="flex flex-wrap text-[9px] text-[#F0B90B]">{status}
                                </span>
                            </span>
                    :
                    <span className="material-icons text-[#E23830] pt-1">pending</span>
            }
        </div>
    )
}


const SubmitCode = () => {
    const { triggerSubmission, testcasesResult } = useCodeContext();

    return (
        <div className="px-4 py-1">
            <button className="border border-[#293139] hover:bg-[#21272e] p-1 py-2 h-[1%] w-[17%] font-semibold tracking-wide text-[#23d18b] rounded"
                onClick={triggerSubmission}
            >
                submit solution
            </button>
            <div className="h-full w-full space-x-4 flex mt-2">
                {testcasesResult.map((testcase, index) => {
                    console.log(testcase);
                    return (<TestCaseBox status={testcase.status} isCorrect={testcase.isCorrect} index={index} />)
                })}
            </div>

        </div>
    )
}

export default SubmitCode;