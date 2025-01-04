import React, { createContext, useState } from 'react';

export const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
    const [codeSubmitted, setCodeSubmitted] = useState(false); // flag if code is submitted
    const [customIOSubmitted, setCustomIOSubmitted] = useState(false); // flag if custom i/o submitted
    const [testcasesResult, setTestcasesResult] = useState([]); // for testcase result
    const [customInput, setCustomInput] = useState(``);
    const [output, setOutput] = useState(``); //for sutom output

    const triggerCustomIO = () => setCustomIOSubmitted(true);
    const resetCustomIO = () => setCustomIOSubmitted(false);

    const triggerSubmission = () => setCodeSubmitted(true);
    const resetSubmission = () => setCodeSubmitted(false);

    const updateTestcasesResult = (result) => { setTestcasesResult(result) };
    const updateOutput = (output) => { setOutput(output) };

    return (
        <CodeContext.Provider value={{ codeSubmitted, customIOSubmitted, triggerCustomIO, resetCustomIO, triggerSubmission, resetSubmission, testcasesResult, updateTestcasesResult, output,  updateOutput, customInput, setCustomInput }}>
            {children}
        </CodeContext.Provider>
    );
};

