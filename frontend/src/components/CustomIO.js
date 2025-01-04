import { useCodeContext } from '../hooks/useCodeContext';

const CustomIO = () => {
    const { customInput, setCustomInput, triggerCustomIO, output } = useCodeContext();

    return (
        <div className="px-4 py-4 flex h-full w-full item-center justify-evenly">
            <div className='flex flex-col h-full w-[40%]'>
                <textarea
                    className='bg-[#161A1E] p-2 h-full w-full overflow-auto focus:outline-none text-white' placeholder='custom input...'
                    value={customInput}
                    onChange={(e) => {
                        const finalInput = e.target.value.replace(/ /g, '\n');
                        console.log(finalInput);
                        setCustomInput(finalInput)
                    }}
                />

                <button className="border border-[#293139] hover:bg-[#21272e] h-[15%] w-[50%] font-semibold tracking-wide text-[#23d18b] rounded mt-2 flex items-center justify-center"

                    onClick={triggerCustomIO}
                >
                    Compile & Run
                </button>
            </div>

            <pre className="h-full w-[40%] bg-[#161A1E] overflow-auto p-3 text-white">
                {output ?
                    output.error ?
                        output.error
                        :
                        output.stdout
                    :
                    <span className='opacity-[55%]'>No output yet...</span>
                }
            </pre>

        </div>
    )
}

export default CustomIO