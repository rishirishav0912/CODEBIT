import { ResizableBox } from "react-resizable";
import { useNavigate } from "react-router-dom";

const ContestProblemDesc = ({ w, h, problem, name, id }) => {

  const navigate = useNavigate();

  // Destructuring necessary fields from the problem prop
  const { probName, statement, inpForm, constraint, outForm } = problem?.desc || {};
  const examples = problem?.exmp || [];
  const points = problem?.pnt || 0;

  return (
    <ResizableBox
      height={h}
      width={0.45 * w}
      className="font-medium p-4 overflow-y-auto scroll-color text-[17px] overflow-x-hidden"
      minConstraints={[0.1 * w, h]}
      maxConstraints={[3 * w, h]}
      resizeHandles={["e"]}
    >
      {
        problem ?
          (<div className="h-full w-full">
            <p className="bg-[#161A1E] rounded-xl w-fit text-[20px] text-[#0DB276] tracking-wide p-3 mb-1 flex items-center justify-center">
              <span className="material-icons text-[35px] px-1">terminal</span>
              {probName}
            </p>

            <div className="ml-2 flex">
              <p className="bg-[#161A1E] rounded-xl text-[15px] text-[#0DB276]z text-yellow-300 w-fit flex items-center justify-between p-2 pr-3 ">
                <span className="material-icons">currency_bitcoin</span>
                {points}
              </p>

              <p className="bg-[#161A1E] rounded-xl text-[15px] text-[#0DB276]z text-blue-400 w-fit flex items-center justify-between p-2 pr-3 ml-2
          hover:cursor-pointer"
                onClick={() => navigate(`/contestproblempage`, {
                  state: {
                    id: id,
                    name: name,
                  },
                })}
              >
                <span className="material-icons px-1">keyboard_return</span>
                Return To Problem Page
              </p>

              {/* add timer component here */}
              <p className="bg-[#161A1E] rounded-xl text-[15px] text-[#0DB276]z text-red-400 w-fit flex items-center justify-between p-2 pr-3 ml-2">
                <span className="material-icons px-1">timer</span>
                2:30:12
              </p>
            </div>

            <div className="tracking-wide p-4 bg-[#161A1E] rounded-xl mt-2">
              {/* Problem Statement */}
              <div className="py-2">
                <p className="text-[#0DB276] text-[15px]">Problem Statement:</p>
                <p className="text-slate-400 pl-2">{statement}</p>
              </div>


              {/* Input Format */}
              <div className="py-2">
                <p className="text-[#0DB276] text-[15px]">Input Format:</p>
                <p className="text-slate-400 pl-2">{inpForm}</p>
              </div>

              {/* Output Format */}
              <div className="py-2">
                <p className="text-[#0DB276] text-[15px]">Output Format:</p>
                <p className="text-slate-400 pl-2">{outForm}</p>
              </div>

              {/* Examples */}
              <div className="bg-[#181C21] p-3 rounded-xl my-2">
                {examples.map((ex, index) => (
                  <div key={index} className="py-2">
                    <p className="text-[#0DB276] text-[15px]">Example {index + 1}:</p>
                    <p className="text-slate-300 pl-1">Input:</p>
                    <p className="text-slate-400 pl-2">{ex.inp}</p>
                    <p className="text-slate-300 pl-1">Output:</p>
                    <p className="text-slate-400 pl-2">{ex.out}</p>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="py-2">
                <p className="text-[#0DB276] text-[15px]">Constraints:</p>
                <p className="text-slate-400 pl-2">{constraint}</p>
              </div>

            </div>
          </div>)
          :
          (<span className="text-[#0DB276] h-full w-full flex items-center justify-center text-[20px] tracking-wide">loading...</span>)

      }

    </ResizableBox>
  );
};

export default ContestProblemDesc;
