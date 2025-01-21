import { useCodeContext } from '../hooks/useCodeContext';

const CustomIO = () => {
    const { customInput, setCustomInput, triggerCustomIO, output, customIOSubmitted, codeSubmitted } = useCodeContext();

    return (
        <div className="px-4 py-4 flex h-full w-full item-center justify-evenly">
            <div className='flex flex-col h-[85%] w-[40%]'>
                <textarea
                    className='bg-[#161A1E]d bg-[#262626] p-2 h-full w-full overflow-auto focus:outline-none text-white resize-none border border-[#333333] rounded-md' placeholder='custom input...'
                    value={customInput}
                    onChange={(e) => {
                        const finalInput = e.target.value.replace(/ /g, '\n');
                        console.log(finalInput);
                        setCustomInput(finalInput)
                    }}
                />

                <button className={`border border-[#293139]s border-[#174337] bg-[#1D332D] hover:bg-[#064e3b] hover:bg-[#21272e]s h-[15%] w-[50%] font-semibold tracking-wide text-[#23d18b]d text-[#34d399] rounded mt-2 flex items-center justify-center ${customIOSubmitted || codeSubmitted ? "cursor-not-allowed":""} py-1`}

                    onClick={triggerCustomIO}
                    disabled={customIOSubmitted || codeSubmitted}
                >
                    {customIOSubmitted?`Compiling...`:`Compile & Run`}
                </button>
            </div>

            <pre className="h-[70%] w-[40%] bg-[#161A1E]d bg-[#262626] overflow-auto p-3 text-white text-wrap border border-[#333333] rounded-md">
                {output ?
                    output.error ?
                        output.error
                        :
                        output.stdout ?
                            output.stdout
                            :
                            output.compile_output ?
                                output.compile_output
                                :
                                output.message
                    :
                    <span className='opacity-[55%]'>No output yet...</span>
                }
            </pre>

        </div>
    )
}

export default CustomIO