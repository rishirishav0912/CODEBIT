import { useAuthContext } from "./useAuthContext";
import { useCodeContext } from "./useCodeContext";

const languageMapping = {
    "javascript": 63,
    "python": 71,
    "cpp": 54,
    "java": 62
}

const useCodeSubmission = ()=> {
    const { updateTestcasesResult, resetSubmission } = useCodeContext();
    const { user } = useAuthContext();

    const handleCodeSubmission = async (code, language, contestId, problemId) => {
        try {
            const response = await fetch(`http://localhost:4000/auth/${user.userid}/${contestId}/${problemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.tokene
                },
                body: JSON.stringify({
                    sourceCode: code,
                    languageId: languageMapping[language]
                })
            });

            if(response.ok){
                const json = await response.json();
                console.log(json);
                console.log("results is",json.results);
                updateTestcasesResult(json.results);

            }
        } catch (error) {
            console.log(error);
        }finally{
            resetSubmission(); 
        }
    }

    return { handleCodeSubmission }
}

export default useCodeSubmission