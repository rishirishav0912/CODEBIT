import React from 'react'

const useNotifications = () => {

    const fetchNotifications = async()=>{
        const response = await fetch("http://localhost:4000/notifications", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json();
        // console.log("notifications", json)
        return json.notifications;
    }

    return { fetchNotifications }
}

export default useNotifications