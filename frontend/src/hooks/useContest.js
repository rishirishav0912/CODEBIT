import { useAuthContext } from "./useAuthContext"

const useContest = () => {
    const { user } = useAuthContext();

    // fetching contest data for specific contest Id
    const fetchContestData = async (contestId) => {
        try {
            const response = await fetch(`http://localhost:4000/contestproblems/${contestId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.log("Failed to fetch contest data");
                return;
            }

            const json = await response.json();

            return json;
        }
        catch (error) {
            console.log(error);
        }
    }

    // compute finish time for a user
    const computeFinishTime = (submissions) => {
        const lastAcceptedSubmission = submissions.find((submission) => {
            return submission.state === "A"
        });

        return lastAcceptedSubmission? lastAcceptedSubmission.subtm : null;
    }

    //fetching users data for leadreboard
    
    const leaderboardData = async (contestId) => {
    
        try {
            // fetching users data
            const response = await fetch(`http://localhost:4000/leaderboard-data/${contestId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const json = await response.json();

            console.log("leaderboard data fetched\n", json);

            // fetching problem ids for the specific contestId
            const contestData = await fetchContestData(contestId);

            const problems = contestData.problems.map((problem) => {
                return problem._id;
            });

            console.log("prob", problems, "userData", json.usersData);

            const users = json.usersData.map((user) => {
                const finishTime = computeFinishTime(user.cnthis[0].submiss);
                const questions = problems.map((problemId) => {
                    // used a helper function fetchStatus , its definition is given below the leaderboardData function
                    const status = fetchStatus(problemId, user);
                    return { status: status }
                })
                return {
                    email: user.email,
                    finishTime: finishTime,
                    points: user.cnthis[0].point,
                    questions: questions
                }
            })


            console.log("updated user data for leaderboard\n", users);

            const rankedUsers = rankingUsers(users);

            return {rankedUsers, problems};
        }
        catch (error) {
            console.log(error);
        }
    }

    // fetch problem status for a given problemId and for a specific user
    // helper funnction used in above leaderboardData function
    const fetchStatus = (problemId, user) => {
        const lastProblemSubmission = user.cnthis[0].submiss.find((submission) => {
            return submission.pid === problemId
        });

        const status = lastProblemSubmission ?
            lastProblemSubmission.state === "A" ?
                "pass"
                :
                lastProblemSubmission.state === "W" ?
                    "fail" :
                    "notAttempted"
            :
            "notAttempted";

        return status;
    }


    // ranking users on basis of finish time and points 
    const rankingUsers = (users) => {
        users.sort((a, b) => {
            if (b.points === a.points) {
                return a.finishTime - b.finishTime; // Ascending by finishTime
            }
            return b.points - a.points; // Descending by points
        });

        return users;
    }

    return { fetchContestData, leaderboardData }
}

export default useContest