const mongoose = require("mongoose");
const userSchema = require("../models/userSchema");

const authenticatedUser = async (userType, userid, pass) => {
    let value = false; // Default to false to prevent uninitialized return values

    try {
        if (userType === "student") {
            // Find the student in the database
            const foundStd = await userSchema.findOne({ email: userid, pass: pass });
            value = foundStd || false; // If no student is found, return false
        } else if (userType === "admin") {
            // Compare admin credentials with environment variables
            const adminId = process.env.ADMINID;
            const adminPass = process.env.ADMINPASS;
             
            if (userid === adminId && pass === adminPass) {
                value = true; // You can return an object or boolean as needed
            } else {
                value = false; // If credentials do not match, return false
            }
        } else {
            throw new Error("User type not identified"); // Handle invalid user types
        }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
  console.log(value);
    return value;
};

module.exports = {
    authenticatedUser,
};
