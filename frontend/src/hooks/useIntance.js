import { useAuthContext } from "./useAuthContext"

const useIntance = () => {
    const {user} = useAuthContext();

    const instanceCreate = async() => {
        //logic of request to backend for instance creation
        const response = await fetch("http://localhost:4000/auth/create-instance",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": user.tokene,
            }
        });

        const json = await response.json();

        if(response.ok){
            console.log(json.message);
            return;
        }

        console.log(json.error);
    }

    const instanceDelete = async() => {
        //logic of request to backend for instance creation
        const response = await fetch("http://localhost:4000/auth/delete-instance",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": user.tokene,
            }
        });

        const json = await response.json();

        if(response.ok){
            console.log(json.message);
            return;
        }

        console.log(json.error);
    }



    return {instanceCreate, instanceDelete}
}

export default useIntance;