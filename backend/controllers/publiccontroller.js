const userSchema = require("../models/userSchema");
const VerificationSchema = require("../models/VerificationSchema");
const ContestSchema = require("../models/ContestSchema");
const HackathonSchema = require("../models/HackathonSchema");
const Notification = require("../models/Notificationschema");
// const ContestRegistration=require("../models/ContestRegistrationSchema");
// const CreateContestSchema=require("../models/CreateContestSchema");// Import the student register schema
const EventSchema = require("../models/EventSchema");
const Token = require("../models/tokenSchema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helperFunctions/sendEmail");
const crypto = require("crypto");
let { authenticatedUser } = require("../helperFunctions/publicHelper");

const registerStudent = async (req, res) => {
  const { email, roll, pass } = req.body;  // Extract the required data from the request body

  if (!email || !roll || !pass) {
    return res.status(400).json({
      message: "Email, collegeRollNumber, and password are required",
    });
  }

  try {
    // Check if the student exists in the studentMain schema
    const existingStudent = await VerificationSchema.findOne({ email, roll });

    const newexistingStudent = await userSchema.findOne({ email, roll });

    if (!existingStudent) {
      return res.status(409).json({
        message: "Student with this email and roll number is not eligible for  registration",
      });

    }
    if (newexistingStudent) {
      return res.status(409).json({
        message: "Student with this email and roll number is already registered",
      });
    }

    // Create a new student document using the studentRegister model
    const newStudent = new userSchema({
      email,
      roll,
      pass,
    });

    // Save the student registration
    const savedStudent = await newStudent.save();
    const token = await new Token({
      uId: savedStudent._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();

    const url = `${process.env.BASE_URL}users/${savedStudent._id}/verify/${token.token}`;

    await sendEmail(savedStudent.email, "Verify Email", url);

    res.status(201).json({
      message: "An Email sent to your account please verify",
      student: savedStudent,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to register student",
      error: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  const { userType } = req.params;
  const { userid, pass } = req.body;
  console.log(userType);
  console.log(userid);
  console.log(pass);
  // Check if userid and password are provided
  if (!userid || !pass) {
    return res.status(404).json({ error: 'Username and password are required.' });
  }
  // User authentication successful, generate JWT token
  let user = await authenticatedUser(userType, userid, pass);
  if (user) {
    if (userType == 'student' && !user.isVerified) {
      let token = await Token.findOne({ uId: user._id });
      if (!token) {
        token = await new Token({
          uId: user._id,
          token: crypto.randomBytes(32).toString("hex")
        }).save();

        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

        const p = await sendEmail(user.email, "Verify Email", url);
        console.log(p);

      }

    }
    const tokene = jwt.sign({ userid }, 'fingerprint_customer');
    // req.session.authorization = {
    //     token, userid
    // }
    return res.status(200).json({ userid, userType, tokene });
  }
  else {
    return res.status(400).json({ error: "Invalid Login,User not registered" });
  }
}
const showHackathons = async (req, res) => {
  try {
    const hackathons = await HackathonSchema.find().sort({ 'hackTime.start': -1 });

    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }



}

const showContest = async (req, res) => {
  try {
    const contests = await ContestSchema.find().sort({ 'startTime': -1 });

    res.json(contests);


  } catch (err) {
    res.status(500).json({ message: err.message });


  }



}
const getUserRegisteredHackathons = async (req, res) => {
  const userEmail = req.query.email; // Assuming the auth route sets req.user

  try {
    const user = await userSchema.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hackathons = user.hackhist.filter(
      (hack) =>
        hack.teamLeader.email === userEmail ||
        hack.teamMembers.some((member) => member.email === userEmail)
    );

    // Respond with the filtered hackathons
    res.status(200).json(hackathons);
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const getUserRegisteredContests = async (req, res) => {
  const userEmail = req.query.email;

  try {

    const user = await userSchema.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const registeredContests = user.cnthis.map((contest) => ({
      contestId: contest.cntid,
      points: contest.point || 0, // Default points to 0 if not set
      submissions: contest.submiss, // Include submissions for the contest
    }));
    console.log(registeredContests);
    res.status(200).json({ registeredContests });
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }


}

const getEvents = async (req, res) => {


  try {
    const events = await EventSchema.find().sort({ ct: -1 }); // Fetch all events
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events" });
  }




}
const getAnnouncement = async (req, res) => {

  const { announcementType, eventId } = req.params;


  try {
    const event = await EventSchema.findOne({
      anType: announcementType,
      selEv: eventId,
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
  }




}
const getTeamDetails = async (req, res) => {
  const { eventId, teamNames } = req.query;

  try {
    // Validate input parameters
    if (!eventId || !teamNames) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Parse the teamNames query parameter
    const teamNamesArray = JSON.parse(teamNames);

    // Fetch teams from the database
    const users = await userSchema.find({
      "hackhist.hackid": eventId,
      "hackhist.tName": { $in: teamNamesArray },
    });

    // Filter unique teams based on `tName`
    const uniqueUsers = [];
    const seenTeamNames = new Set();

    users.forEach(user => {
      const relevantHack = user.hackhist.find(
        hack => hack.hackid === eventId && teamNamesArray.includes(hack.tName)
      );
      if (relevantHack && !seenTeamNames.has(relevantHack.tName)) {
        seenTeamNames.add(relevantHack.tName);
        uniqueUsers.push({ user, relevantHack }); // Include both user and relevantHack
      }
    });

    // Map the filtered unique data to the desired response format
    const teamData = uniqueUsers.map(({ user, relevantHack }) => ({
      teamName: relevantHack.tName,
      projectName: relevantHack.submiss?.[0]?.pname || "N/A", // First submission project name
      githubLink: relevantHack.submiss?.[0]?.githubLink || "N/A",
      liveDemoLink: relevantHack.submiss?.[0]?.liveLink || "N/A",
      videoLink: relevantHack.submiss?.[0]?.videoLink || "N/A",
      members: [
        {
          email: relevantHack.teamLeader.email,
          name: relevantHack.teamLeader.name,
          phone: relevantHack.teamLeader.phone,
        },
        ...relevantHack.teamMembers.map(member => ({
          email: member.email,
          name: member.name,
          phone: member.phone,
        })),
      ],
    }));

    // Respond with the unique team data
    res.status(200).json(teamData);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};


const checkRegistration = async (req, res) => {

  const { eventId, userEmail } = req.query;
  try {
    // Query the StudentRegister model to check if the user is part of the hackhist array
    const user = await userSchema.findOne({
      $or: [
        {
          "hackhist.hackid": eventId,
          "hackhist.teamLeader.email": userEmail
        },
        {
          "hackhist.hackid": eventId,
          "hackhist.teamMembers.email": userEmail
        }
      ]
    });

    if (user) {
      // Find the specific hackhist entry for the given eventId
      const hackathonDetails = user.hackhist.find(
        (hack) => hack.hackid === eventId
      );
      res.json({
        isRegistered: true,
        hackathonDetails, // Send the relevant hackhist details
      });
    } else {
      res.json({
        isRegistered: false,
        message: "User is not registered for this hackathon.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking registration", error });
  }
};


//fetching data for leaderboard
const fetchLeaderboardData = async (req, res) => {
  try {
    const { contestId } = req.params;

    const usersData = await userSchema.find(
      { "cnthis.cntid": contestId }, // Query: Filter users who participated in the specific contest
      {
        email: 1, // Include email
        _id: 0, // Exclude _id field
        cnthis: {
          $elemMatch: { cntid: contestId }, // Include only the `cnthis` entry for the specified contest ID
        },
      }
    );

    return res.status(200).json({ usersData });
  }
  catch (error) {
    return res.status(400).json(error);
  }
}

const getNotifications = async (req,res) => {
  try {
    const notifications = await Notification.find().sort({ ct: -1 });
    res.status(200).json({notifications: notifications});
  }
  catch (error) {
    console.log(error)
  }

}



module.exports = {
  registerStudent,
  loginUser,
  getUserRegisteredHackathons,
  showHackathons,
  showContest,
  getUserRegisteredContests,
  getEvents,
  getAnnouncement,
  getTeamDetails,
  checkRegistration,
  fetchLeaderboardData,
  getNotifications
};
