import { useContext } from 'react';
import {CodeContext} from "../context/CodeContext"


export const useCodeContext = () => {
    const context = useContext(CodeContext);

    if (!context) {
        throw Error("useCodeContext must be used inside a CodeContextProvider");
    }

    return context;
}

