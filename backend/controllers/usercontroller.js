const { handleTestCase, handleCustomInput } = require('../helperFunctions/contestSubmissionHelpers');
const StudentRegister = require("../models/userSchema");
const Contest = require("../models/ContestSchema");
//const Problem = require('../models/Problem'); // MongoDB Problem model


// checking for custom input
const runCustomIO = async (req, res) => {
  const { sourceCode, languageId, customInput } = req.body;

  try {
    // Validate input
    if (!sourceCode) {
      return res.status(400).json({ error: "Source code is required." });
    }

    if (!languageId) {
      return res.status(400).json({ error: "Language ID is not defined for this problem." });
    }


    // Execute for custom input
    const results = await handleCustomInput(customInput, sourceCode, languageId);

    return res.status(200).json({ output: results })
  }
  catch (error) {
    return res.status(400).json({ error });
  }
}


// submitting a code
const makeSubmission = async (req, res) => {
  const { userId, contestId, problemId } = req.params;
  const { sourceCode, languageId } = req.body;

  // Validate input
  if (!sourceCode) {
    return res.status(400).json({ error: "Source code is required." });
  }

  try {
    // Fetch the problem and its test cases from the database
    const contest = await Contest.findById(contestId);

    const problem = contest.problems.find((problem) => problem._id.toHexString() === problemId);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const user = await StudentRegister.findOne({ email: userId })

    if (!user) {
      return res.status(400).json({ error: "user not fetched" });
    }

    const submissions = user.cnthis.find((cnt) => cnt.cntid === contestId).submiss;

    const latestSubmissiom = submissions.find((submission) => submission.pid === problemId) || null;

    if (latestSubmissiom !== null) {
      const state = latestSubmissiom.state;

      //if problem already, submission will not take place.
      if (state === "A") return res.status(400).json({ error: "problem already accepted, cannot be submitted again" })

    }

    const { testcs, pnt } = problem;
    const testCases = testcs;
    const points = pnt;
    // const testCases = [
    //     { input: "2\n4", expectedOutput: "6" },
    //     { input: "1\n2", expectedOutput: "3" },
    //     { input: "54\n48", expectedOutput: "102" },
    //     { input: "1000\n100000", expectedOutput: "101000" }
    // ]

    // Validate problem data
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: "No test cases available for this problem." });
    }
    if (!languageId) {
      return res.status(400).json({ error: "Language ID is not defined for this problem." });
    }

    console.log(testCases, sourceCode, languageId);
    // Execute all test cases concurrently
    const results = await Promise.all(testCases.map((testcase) => handleTestCase(testcase, sourceCode, languageId)));

    const allCorrect = results.every(result => result.isCorrect);

    if (allCorrect) {
      await StudentRegister.findOneAndUpdate(
        { _id: userId, "cnthis.cntid": contestId },
        { $inc: { "cnthis.$.point": points } }
      ).then(async() => {
        console.log("problem accepted successfully");

        submissions.unshift({
          pid: problemId,
          subtm: (new Date()),
          state: "A",
        })

        await user.save();
      }).catch((err) => console.log(err));
    }
    else {
      console.log("problem not accepted");

      submissions.unshift({
        pid: problemId,
        subtm: (new Date()),
        state: "W"
      })

      await user.save();
    }

    // Return the results
    res.status(200).json({
      problemId,
      results,
    });
  } catch (error) {
    console.error("Error processing submission:", error);
    res.status(500).json({ error: "An unexpected error occurred while processing the submission." });
  }
}

module.exports = {
  makeSubmission,
  runCustomIO
}