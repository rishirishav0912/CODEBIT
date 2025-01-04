import useSize from "@react-hook/size"
import { ResizableBox } from "react-resizable"
import { useLocation, useParams } from "react-router-dom"

//components
import CodeEditor from "../components/CodeEditor"
import ContestProblemDesc from "../components/ContestProblemDesc"
import OutputSection from "../components/OutputSection"
import { useRef } from "react"


const CodeSubmission = () => {
    const location = useLocation();
    const { contestId, problemId} = useParams();
    const { problem, name } = location.state || {}; //extracting the problem from the state


    const pref1 = useRef(null);
    const [w1, h1] = useSize(pref1);

    const pref2 = useRef(null);
    const [w2, h2] = useSize(pref2);

    return (
        <div className="h-[100vh] w-full flex bg-[#181C21]" ref={pref1}>
            <ContestProblemDesc w={w1} h={h1} problem={problem} name={name} id={contestId}/>
            <ResizableBox height={h1} width={.55 * w1}
                minConstraints={[.55 * w1, h1]}
                maxConstraints={[3 * w1, h1]}
                resizeHandles={['w']}
                className="overflow-hidden"
            >
                <div className="flex flex-col h-full w-full" ref={pref2}>
                    <CodeEditor w={w2} h={h2} contestId={contestId} problemId={problemId}/>
                    <OutputSection w={w2} h={h2} />
                </div>
            </ResizableBox>
        </div>
    )
}

export default CodeSubmission;