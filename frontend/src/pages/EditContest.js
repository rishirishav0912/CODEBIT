import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditContest = () => {
    const { hackathonId } = useParams();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
    const token = user?.tokene || null;

    const [formData, setFormData] = useState({
        contestName: "",
        startTime: "",
        endTime: "",
        challenges: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // Fetch contest details from the backend
    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/contestdata/${hackathonId}`, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                // Map data to form structure
                setFormData({
                    contestName: data.contName,
                    startTime: new Date(data.startTime).toISOString().slice(0, 16),
                    endTime: new Date(data.endTime).toISOString().slice(0, 16),
                    challenges: data.problems.map((problem) => ({
                        challengeName: problem.desc.probName,
                        problemStatement: problem.desc.statement,
                        inputFormat: problem.desc.inpForm,
                        constraints: problem.desc.constraint,
                        outputFormat: problem.desc.outForm,
                        examples: problem.exmp.map((ex) => ({ inp: ex.inp, out: ex.out })),
                        testCases: problem.testcs.map((tc) => ({ inp: tc.inp, expout: tc.expout })),
                        points: problem.pnt.toString(),
                    })),
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching contest details:", error);
                setIsLoading(false);
            }
        };

        if (hackathonId) {
            fetchContestDetails();
        }
    }, [hackathonId, token]);

    const handleChallengeChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index][field] = value;
            return { ...prev, challenges: updatedChallenges };
        });
    };

    const handleNestedChange = (index, field, subIndex, subField, value) => {
        setFormData((prev) => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index][field][subIndex][subField] = value;
            return { ...prev, challenges: updatedChallenges };
        });
    };

    const addChallenge = () => {
        setFormData((prev) => ({
            ...prev,
            challenges: [
                ...prev.challenges,
                {
                    challengeName: "",
                    problemStatement: "",
                    inputFormat: "",
                    constraints: "",
                    outputFormat: "",
                    examples: [{ inp: "", out: "" }],
                    testCases: [{ inp: "", expout: "" }],
                    points: "0",
                },
            ],
        }));
    };

    const removeChallenge = (index) => {
        setFormData((prev) => ({
            ...prev,
            challenges: prev.challenges.filter((_, i) => i !== index),
        }));
    };

    const addExample = (index) => {
        setFormData((prev) => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index].examples.push({ inp: "", out: "" });
            return { ...prev, challenges: updatedChallenges };
        });
    };

    const addTestCase = (index) => {
        setFormData((prev) => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index].testCases.push({ inp: "", expout: "" });
            return { ...prev, challenges: updatedChallenges };
        });
    };
    const removeTestCase = (challengeIndex, testCaseIndex) => {
        setFormData((prev) => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[challengeIndex].testCases = updatedChallenges[challengeIndex].testCases.filter((_, i) => i !== testCaseIndex);
            return { ...prev, challenges: updatedChallenges };
        });
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            console.log("haji");
            const response = await fetch(`http://localhost:4000/auth/edit-contest/${hackathonId}`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            console.log("Save successful:", result);
            alert("Contest updated successfully!");
        } catch (error) {
            console.error("Error saving contest changes:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };
    if (isLoading) {
        return <div className="min-h-screen bg-[#181C21] text-slate-300 flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#181C21] text-slate-300">
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-5xl font-semibold mb-8 tracking-wider text-[#0DB276]">
                    Edit Contest: {formData.contestName}
                </h2>
                <form className="space-y-8">
                <div>
    <label className="block text-xl font-medium mb-2">Contest Name:</label>
    <input
        type="text"
        value={formData.contestName}
        onChange={(e) => setFormData((prev) => ({ ...prev, contestName: e.target.value }))}
        className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
    />
</div>

<div>
    <label className="block text-xl font-medium mb-2">Start Time:</label>
    <input
        type="datetime-local"
        value={formData.startTime}
        onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
        className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
    />
</div><div>
    <label className="block text-xl font-medium mb-2">End Time:</label>
    <input
        type="datetime-local"
        value={formData.endTime}
        onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
        className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
    />
</div>
                    <div>
                        <h3 className="text-3xl font-semibold mb-4">Challenges</h3>
                        {formData.challenges.map((challenge, index) => (
                            <div key={index} className="p-4 mb-4 rounded bg-[#212830] border border-[#0DB276]">
                                <div className="flex justify-between items-center">
                                    <label className="block text-lg font-medium mb-2">Challenge Name:</label>
                                    <button
                                        type="button"
                                        onClick={() => removeChallenge(index)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Remove Challenge
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={challenge.challengeName}
                                    onChange={(e) =>
                                        handleChallengeChange(index, "challengeName", e.target.value)
                                    }
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                />
                                <label className="block text-lg font-medium mb-2">Problem Statement:</label>
                                <textarea
                                    value={challenge.problemStatement}
                                    onChange={(e) =>
                                        handleChallengeChange(index, "problemStatement", e.target.value)
                                    }
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                ></textarea>
                                <label className="block text-lg font-medium mb-2">Input Format:</label>
                                <input
                                    type="text"
                                    value={challenge.inputFormat}
                                    onChange={(e) =>
                                        handleChallengeChange(index, "inputFormat", e.target.value)
                                    }
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                />
                                <label className="block text-lg font-medium mb-2">Constraints:</label>
                                <textarea
                                    value={challenge.constraints}
                                    onChange={(e) =>
                                        handleChallengeChange(index, "constraints", e.target.value)
                                    }
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                ></textarea>
                                <label className="block text-lg font-medium mb-2">Output Format:</label>
                                <input
                                    type="text"
                                    value={challenge.outputFormat}
                                    onChange={(e) =>
                                        handleChallengeChange(index, "outputFormat", e.target.value)
                                    }
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                />
                                <label className="block text-lg font-medium mb-2">Points:</label>
                                <input
                                    type="number"
                                    value={challenge.points}
                                    onChange={(e) => handleChallengeChange(index, "points", e.target.value)}
                                    className="w-full p-3 rounded bg-[#212830] border border-[#0DB276] placeholder-slate-500 focus:outline-none"
                                />
                                <label className="block text-lg font-medium mb-2">Examples:</label>
                                {challenge.examples.map((example, exIndex) => (
                                    <div key={exIndex} className="mb-4">
                                        <input
                                            type="text"
                                            value={example.inp}
                                            placeholder="Input"
                                            onChange={(e) =>
                                                handleNestedChange(index, "examples", exIndex, "inp", e.target.value)
                                            }
                                            className="w-full p-2 mb-2 rounded bg-[#212830] border border-[#0DB276]"
                                        />
                                        <input
                                            type="text"
                                            value={example.out}
                                            placeholder="Output"
                                            onChange={(e) =>
                                                handleNestedChange(index, "examples", exIndex, "out", e.target.value)
                                            }
                                            className="w-full p-2 rounded bg-[#212830] border border-[#0DB276]"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addExample(index)}
                                    className="text-green-500 hover:underline"
                                >
                                    Add Example
                                </button>
                                <label className="block text-lg font-medium mb-2">Test Cases:</label>
                                {challenge.testCases.map((testCase, tcIndex) => (
                                    <div key={tcIndex} className="mb-4">
                                        <input
                                            type="text"
                                            value={testCase.inp}
                                            placeholder="Input"
                                            onChange={(e) =>
                                                handleNestedChange(index, "testCases", tcIndex, "inp", e.target.value)
                                            }
                                            className="w-full p-2 mb-2 rounded bg-[#212830] border border-[#0DB276]"
                                        />
                                        <input
                                            type="text"
                                            value={testCase.expout}
                                            placeholder="Expected Output"
                                            onChange={(e) =>
                                                handleNestedChange(index, "testCases", tcIndex, "expout", e.target.value)
                                            }
                                            className="w-full p-2 rounded bg-[#212830] border border-[#0DB276]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTestCase(index, tcIndex)}
                                            className="text-red-500 hover:underline mt-2"
                                        >
                                            Remove Test Case
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addTestCase(index)}
                                    className="text-green-500 hover:underline"
                                >
                                    Add Test Case
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addChallenge}
                            className="text-green-500 hover:underline"
                        >
                            Add Challenge
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className={`mt-6 px-6 py-3 rounded bg-[#0DB276] text-white font-semibold ${
                            isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0AA066]"
                        }`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditContest;
