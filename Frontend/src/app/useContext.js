'use client'
const { createContext, useState } = require("react");

export const GeminiObject = createContext();

export function GeminiFunction({children}){
    const[geminiResponse, setGetminiResponse] = useState({});
    const[geminiResponseArray, setGetminiResponseArray] = useState([]);
    const[geminiResultArray, setGetminiResultArray] = useState([]);


    return(
        <GeminiObject.Provider value={{geminiResponse, setGetminiResponse, geminiResponseArray, setGetminiResponseArray, geminiResultArray, setGetminiResultArray}}>
            {children}
        </GeminiObject.Provider>
    )
}