const { instanceDetails } = require("../controllers/instanceController");

const handleCustomInput = async (customInput, sourceCode, languageId) => {
    console.log(instanceDetails, customInput, sourceCode, languageId);

    try {
        // Submit the code to Judge0 for execution
        const submissionResponse = await fetch(`http://${instanceDetails.ipAddress}:2358/submissions`, { //process.env.JUDGE0_API_URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            },
            body: JSON.stringify({
                source_code: sourceCode,
                language_id: languageId,
                stdin: customInput,
            }),
        });

        console.log(submissionResponse);
        if (!submissionResponse.ok) {
            console.log(submissionResponse.status);
            throw new Error(`Submission failed: ${submissionResponse.statusText}`);
        }

        const submissionData = await submissionResponse.json();
        const { token } = submissionData;
        console.log(submissionData);
        console.log(token);

        const resultData = await checkSubmissionStatus(token);

        // Determine if the output matches the expected output
        return { stdout: resultData.stdout, error: resultData.stderr, compile_output: resultData.compile_output, message: resultData.message }
    } catch (error) {
        // Catch unexpected errors for this test case
        console.log(error);
        return { error: error.message }
    }

}


// Function to handle a single test case
const handleTestCase = async (testCase, sourceCode, languageId) => {
    console.log(instanceDetails, testCase, sourceCode, languageId);
    const { input, expectedOutput } = testCase;

    try {
        // Submit the code to Judge0 for execution
        const submissionResponse = await fetch(`http://${instanceDetails.ipAddress}:2358/submissions`, { //process.env.JUDGE0_API_URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            },
            body: JSON.stringify({
                source_code: sourceCode,
                language_id: languageId,
                stdin: input,
            }),
        });

        console.log(submissionResponse);
        if (!submissionResponse.ok) {
            console.log(submissionResponse.status);
            throw new Error(`Submission failed: ${submissionResponse.statusText}`);
        }

        const submissionData = await submissionResponse.json();
        const { token } = submissionData;
        console.log(submissionData);
        console.log(token);

        // Poll the Judge0 API for the result
        
        const resultData = await checkSubmissionStatus(token);

        // Determine if the output matches the expected output
        const isCorrect = resultData.stdout?.trim() === expectedOutput.trim();
        const isTLE = resultData.status.description === "Time Limit Exceeded";

        return {
            testCase,
            status: isTLE ? "Time Limit Exceeded" : resultData.status.description,
            actualOutput: resultData.stdout,
            isCorrect: isCorrect && !isTLE, // Mark false if TLE occurs
            error: resultData.compile_output || resultData.stderr || resultData.message,
        };
    } catch (error) {
        // Catch unexpected errors for this test case
        return {
            testCase,
            status: "Error",
            actualOutput: null,
            isCorrect: false,
            error: error.message,
        };
    }
};



// Polling function to check the status of a submission
const checkSubmissionStatus = async (token) => {
    const MAX_RETRIES = 15; // Maximum number of retries
    const DELAY_MS = 2000; // Delay between retries in milliseconds

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {

            // Fetch the status of the submission
            const resultResponse = await fetch(`http://${instanceDetails.ipAddress}:2358/submissions/${token}`, { //${process.env.JUDGE0_API_URL}
                method: 'GET',
                // headers: {
                //     'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                // },
            });

            if (!resultResponse.ok) {
                throw new Error(`Error fetching submission status: ${resultResponse.statusText}`);
            }

            const resultData = await resultResponse.json();
            console.log("result data is : ", resultData);

            // Status ID: 3 -> Completed
            if (resultData.status.id === 3) {
                return resultData; // Return the completed result
            } else if (resultData.status.id === 1 || resultData.status.id === 2) {
                // Status ID: 1 -> Queued, 2 -> Processing
                console.log(`Attempt ${attempt + 1}: Status is ${resultData.status.description}`);
                await new Promise((resolve) => setTimeout(resolve, DELAY_MS)); // Delay before retrying
            } else {
                // Handle unexpected statuses (e.g., compilation errors, runtime errors)
                console.log(`Attempt ${attempt + 1}: Unexpected status ${resultData}`);
                return resultData;
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1}: Error checking submission status - ${error.message}`);
        }
    }

    throw new Error("Maximum retries exceeded while checking submission status.");
};

module.exports = {
    handleTestCase,
    handleCustomInput
}