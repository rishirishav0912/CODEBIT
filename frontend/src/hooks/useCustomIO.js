import { useCodeContext } from "./useCodeContext";
import {useAuthContext} from "./useAuthContext";
const languageMapping = {
    "javascript": 63,
    "python": 71,
    "cpp": 54,
    "java": 62
}


const useCustomIO = () => {
    const {user} = useAuthContext();
    const { resetCustomIO, updateOutput, setCustomInput } = useCodeContext();

    const submitCustomInput = async (code, language, customInput) => {
        try {
            const response = await fetch('http://localhost:4000/auth/customIO', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.tokene,  // Add the Authorization header
                },
                body: JSON.stringify({
                    sourceCode: code,
                    languageId: languageMapping[language],
                    customInput: customInput
                })
            });

            if(response.ok){
                const json = await response.json();
                const output = json.output;
                console.log(json);
                updateOutput(output);
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            resetCustomIO();
            setCustomInput()
        }
    }

    return { submitCustomInput }
}

export default useCustomIO;