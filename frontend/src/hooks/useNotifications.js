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

    const acceptNotifications = async(notificationId)=>{
        const response = await fetch(`http://localhost:4000/acceptNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json();
        // console.log("notifications", json)
        return json;
    }

    const rejectNotification = async(notificationId)=>{
        const response = await fetch(`http://localhost:4000/acceptNotification/${notificationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const json = await response.json();
        // console.log("notifications", json)
        return json;
    }

    return { fetchNotifications, acceptNotifications, rejectNotification }
}

export default useNotifications