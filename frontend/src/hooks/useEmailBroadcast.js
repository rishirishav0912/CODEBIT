import { useState, useEffect } from 'react';
import { useAuthContext } from "./useAuthContext"
import emailjs from '@emailjs/browser';

// template_53p2qmo
// service_s3oruwc
// eRzi5FMPxscRPHte2

const useEmailBroadcast = () => {
    const {user} = useAuthContext();


    const fetchEmails = async () => {
        console.log(user)
        try {
            const response = await fetch("http://localhost:4000/auth/mails", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": user.tokene
                }
            }); // API endpoint
            if (!response.ok) {
                console.log("Failed to fetch emails");
                return;
            }
            const data = await response.json();
            console.log("data is", data);
            return data.emails || [];
        } catch (err) {
            console.log(err);
        }
    };

    
    const emailBroadcast = async (formdata) => {
        const { tit, desc, deadline, org, anType, selEv, tNames } = formdata;
        const emails = await fetchEmails();
        console.log(emails);
        emailjs.send('service_s3oruwc', 'template_53p2qmo', {
            from_name: "Admin",
            from_email: 'rishirishav912@gmail.com',
            to_email: emails,
            message: `
        Subject: ${tit}

        Dear students,

        This email is to announce for ${tit}, organized by ${org.map(org => org.name).join(", ")}.

        ${desc}

        ${anType === "normal" ? `The deadline for this announcement is: ${deadline}.` : ""}
        ${anType === "hackathon" || anType === "contest" ? `This event is part of: ${selEv}.` : ""}
        ${anType === "hackathon" ? `Teams won are: ${tNames.join(", ")}.` : ""}

        We look forward to your participation in future events!

        Best regards,
        ${org.map(org => org.name).join(", ")}
        ${org.map(org => org.email).join(", ")}
        ${org.map(org => org.phone).join(", ")}
    `
        }, 'eRzi5FMPxscRPHte2').then(() => {
            alert('Email Broadcasted Successfully!');

        }).catch((error) => {
            console.log(error);
            alert('Something went wrong')
        })
    }

    return { emailBroadcast }
}


export default useEmailBroadcast;