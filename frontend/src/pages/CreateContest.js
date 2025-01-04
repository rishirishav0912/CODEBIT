import React, { useState } from "react";

const CreateContest = () => {
    const [formData, setFormData] = useState({
        contestName: "",
        startTime: "",
        endTime: "",
        challenges: [],
    });

    const [currentChallenge, setCurrentChallenge] = useState({
        challengeName: "",
        problemStatement: "",
        inputFormat: "",
        constraints: "",
        outputFormat: "",
        examples: [], // List of example inputs/outputs
        testCases: [], // List of test cases
        points: "",
        exampleInput: "",
        exampleOutput: "",
        testCaseInput: "",
        testCaseOutput: "",
    });

    const [isAddingChallenge, setIsAddingChallenge] = useState(false);

    const handleInputChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChallengeChange = (key, value) => {
        setCurrentChallenge((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleAddExample = () => {
        if (currentChallenge.exampleInput && currentChallenge.exampleOutput) {
            const newExample = {
                inp: currentChallenge.exampleInput,
                out: currentChallenge.exampleOutput,
            };

            setCurrentChallenge((prev) => ({
                ...prev,
                examples: [...prev.examples, newExample],
                exampleInput: "",
                exampleOutput: "",
            }));
        } else {
            alert("Please fill in both example input and output.");
        }
    };
    const userString = localStorage.getItem("user");
    let userId = "";
    let token = "";
    if (userString) {
        const userObject = JSON.parse(userString); // Parse the JSON string
        userId = userObject.userid || ""; // Use userid as Team Leader Email
        token = userObject.tokene || "";  // Access token
    } else {
        console.log("User data not found in localStorage.");
    }
    const handleAddTestCase = () => {
        if (currentChallenge.testCaseInput && currentChallenge.testCaseOutput) {
            const newTestCase = {
                inp: currentChallenge.testCaseInput,
                expout: currentChallenge.testCaseOutput,
            };

            setCurrentChallenge((prev) => ({
                ...prev,
                testCases: [...prev.testCases, newTestCase],
                testCaseInput: "",
                testCaseOutput: "",
            }));
        } else {
            alert("Please fill in both test case input and output.");
        }
    };

    const handleAddChallenge = () => {
        if (
            !currentChallenge.challengeName ||
            !currentChallenge.points ||
            !currentChallenge.problemStatement
        ) {
            alert("Please fill in all the required fields for the challenge.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            challenges: [...prev.challenges, currentChallenge],
        }));

        setCurrentChallenge({
            challengeName: "",
            problemStatement: "",
            inputFormat: "",
            constraints: "",
            outputFormat: "",
            examples: [],
            testCases: [],
            points: "",
            exampleInput: "",
            exampleOutput: "",
            testCaseInput: "",
            testCaseOutput: "",
        });

        setIsAddingChallenge(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requestData = {
            contName: formData.contestName,
            startTime: formData.startTime,
            endTime: formData.endTime,
            problems: formData.challenges.map((challenge) => ({
                pnt: parseInt(challenge.points, 10),
                desc: {
                    probName: challenge.challengeName,
                    statement: challenge.problemStatement,
                    inpForm: challenge.inputFormat,
                    constraint: challenge.constraints,
                    outForm: challenge.outputFormat,
                },
                exmp: challenge.examples,
                testcs: challenge.testCases,
            })),
        };

        try {
            console.log(requestData);
            console.log(token)
            const response = await fetch("http://localhost:4000/auth/createcontest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Contest and challenges submitted successfully!");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert("There was an error while creating the contest. Please try again.");
        }

        setFormData({
            contestName: "",
            startTime: "",
            endTime: "",
            challenges: [],
        });
    };

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-5xl font-semibold mb-8 tracking-wider text-[#0DB276]">
                    Create Contest with Challenges
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contest Details */}
                    {/* ...Existing Inputs for contestName, startTime, and endTime */}
                    <div>
                        <label className="block text-xl font-medium mb-2">Contest Name:</label>
                        <input
                            type="text"
                            value={formData.contestName}
                            onChange={(e) => handleInputChange("contestName", e.target.value)}
                            required
                            className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xl font-medium mb-2">Start Time:</label>
                        <input
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => handleInputChange("startTime", e.target.value)}
                            required
                            className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xl font-medium mb-2">End Time:</label>
                        <input
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) => handleInputChange("endTime", e.target.value)}
                            required
                            className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                        />
                    </div>
                    {/* Challenges Section */}
                    <div className="mt-8">
                        <h3 className="text-3xl font-semibold mb-4">Challenges</h3>
                        {formData.challenges.map((challenge, index) => (
                            <div key={index} className="p-4 mb-4 rounded bg-[#212830] border border-[#0DB276]">
                                <h4 className="text-2xl">{challenge.challengeName}</h4>
                                <p>{challenge.problemStatement}</p>
                            </div>
                        ))}

                        {!isAddingChallenge && (
                            <button
                                type="button"
                                onClick={() => setIsAddingChallenge(true)}
                                className="mt-4 py-3 px-6 bg-[#0DB276] hover:bg-green-600 text-white font-semibold tracking-wide rounded"
                            >
                                Add Challenge
                            </button>
                        )}

                        {isAddingChallenge && (
                            <div className="p-4 mt-4 rounded bg-[#212830] border border-[#0DB276]">
                                <h4 className="text-2xl mb-4">New Challenge</h4>
                                {/* Fields for challengeName, problemStatement, etc. */}
                                <div>
                                    <label className="block text-lg mb-2">Challenge Name:</label>
                                    <input
                                        type="text"
                                        value={currentChallenge.challengeName}
                                        onChange={(e) => handleChallengeChange("challengeName", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Problem Statement:</label>
                                    <textarea
                                        value={currentChallenge.problemStatement}
                                        onChange={(e) => handleChallengeChange("problemStatement", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Points for Challenge:</label>
                                    <input
                                        type="number"
                                        value={currentChallenge.points || ""}
                                        onChange={(e) => handleChallengeChange("points", e.target.value)}
                                        min="1"
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Input Format:</label>
                                    <textarea
                                        value={currentChallenge.inputFormat}
                                        onChange={(e) => handleChallengeChange("inputFormat", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Constraints:</label>
                                    <textarea
                                        value={currentChallenge.constraints}
                                        onChange={(e) => handleChallengeChange("constraints", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Output Format:</label>
                                    <textarea
                                        value={currentChallenge.outputFormat}
                                        onChange={(e) => handleChallengeChange("outputFormat", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent placeholder-slate-500 focus:border-[#0DB276] focus:outline-none"
                                    ></textarea>
                                </div>
                                {/* Examples */}
                                <div>
                                    <h4 className="text-xl mt-4 mb-2">Examples</h4>
                                    <input
                                        type="text"
                                        placeholder="Example Input"
                                        value={currentChallenge.exampleInput}
                                        onChange={(e) => handleChallengeChange("exampleInput", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Example Output"
                                        value={currentChallenge.exampleOutput}
                                        onChange={(e) => handleChallengeChange("exampleOutput", e.target.value)}
                                        className="w-full p-3 mt-2 rounded bg-[#212830] border border-transparent focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddExample}
                                        className="mt-2 py-2 px-4 bg-[#0DB276] text-white font-semibold rounded"
                                    >
                                        Add Example
                                    </button>
                                </div>

                                {/* Test Cases */}
                                <div>
                                    <h4 className="text-xl mt-4 mb-2">Test Cases</h4>
                                    <input
                                        type="text"
                                        placeholder="Test Case Input"
                                        value={currentChallenge.testCaseInput}
                                        onChange={(e) => handleChallengeChange("testCaseInput", e.target.value)}
                                        className="w-full p-3 rounded bg-[#212830] border border-transparent focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Expected Output"
                                        value={currentChallenge.testCaseOutput}
                                        onChange={(e) => handleChallengeChange("testCaseOutput", e.target.value)}
                                        className="w-full p-3 mt-2 rounded bg-[#212830] border border-transparent focus:border-[#0DB276] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTestCase}
                                        className="mt-2 py-2 px-4 bg-[#0DB276] text-white font-semibold rounded"
                                    >
                                        Add Test Case
                                    </button>
                                </div>
                                
                                {/* Save Challenge Button */}
                                <button
                                    type="button"
                                    onClick={handleAddChallenge}
                                    className="mt-4 py-2 px-4 bg-green-600 text-white rounded"
                                >
                                    Save Challenge
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#0DB276] hover:bg-green-700 text-white font-semibold rounded"
                    >
                        Create Contest
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateContest;
