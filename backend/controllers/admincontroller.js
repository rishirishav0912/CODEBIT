const VerificationSchema = require("../models/VerificationSchema");
const HackathonSchema = require("../models/HackathonSchema");
const userSchema = require("../models/userSchema");
const formidable = require('formidable');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const EventSchema = require("../models/EventSchema");
const ContestSchema = require("../models/ContestSchema");
const Notification = require("../models/NotificationSchema");
const HackHisSchema = require("../models/HackHisSchema");
const sendEmail2 = require("../helperFunctions/sendEmail2");
const getMails = async (req, res) => {
  try {
    const users = await userSchema.find({}, "email"); // Fetch only email field
    const emails = users.map(user => user.email); // Extract emails into an array
    res.status(200).json({ emails });
  } catch (error) {
    console.error("Error fetching user emails:", error);
    res.status(500).json({ error: "Failed to fetch user emails" });
  }
}

const registerMain = async (req, res) => {

  const { students } = req.body; // Extract students array from the request body
  console.log(students);
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "No student data provided" });
  }

  try {
    const results = [];
    for (const student of students) {
      const { roll, email } = student;

      if (!roll || !email) {
        results.push({ roll, status: "failed", reason: "Missing roll or email" });
        continue;
      }
      const existingStudent = await VerificationSchema.findOne({ roll });
      if (existingStudent) {
        results.push({ roll, status: "failed", reason: "Duplicate roll number" });
        continue;
      }

      const newStudent = new VerificationSchema({ roll, email });
      await newStudent.save();
      results.push({ roll, status: "success" });
    }
    res.status(201).json({
      message: "Students processed",
      results,
    });
  } catch (error) {
    console.error("Error saving students:", error);
    res.status(500).json({ message: "Failed to process students", error: error.message });
  }


};



//use for postman sending request in array of json
// const StudentSchema = require("../models/StudentSchema");

// const registerMain = async (req, res) => {
//     const students = req.body; // Expecting an array of student objects

//     // Validate that the request contains an array
//     if (!Array.isArray(students)) {
//         return res.status(400).json({ message: "Input should be an array of student objects" });
//     }

//     try {
//         const savedStudents = [];
//         for (const studentData of students) {
//             const { collegeRollNumber, email } = studentData;

//             // Validate each student object
//             if (!collegeRollNumber || !email) {
//                 return res.status(400).json({ message: "collegeRollNumber and email are required for each student" });
//             }

//             // Check for duplicates
//             const existingStudent = await StudentSchema.findOne({ collegeRollNumber });
//             if (existingStudent) {
//                 return res.status(409).json({
//                     message: `College Roll Number ${collegeRollNumber} already exists`,
//                 });
//             }

//             // Save student
//             const newStudent = new StudentSchema({ collegeRollNumber, email });
//             const savedStudent = await newStudent.save();
//             savedStudents.push(savedStudent);
//         }

//         res.status(201).json({ message: "Students added successfully", students: savedStudents });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add students", error: error.message });
//     }
// };

// module.exports = { registerMain };



const hackathonCreate = async (req, res) => {
  try {
    // Extract hackathon details from the request body


    const {
      hackathonName,
      teamSize,
      registrationTimeline,
      hackathonTimeline,
      allowVideoLink,
      allowLiveDeploymentLink,
      themes,
    } = req.body;

    // Validate required fields
    if (!hackathonName || !teamSize || !registrationTimeline || !hackathonTimeline || !themes) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Check registration and hackathon timelines
    if (new Date(registrationTimeline.start) > new Date(registrationTimeline.end)) {
      return res
        .status(400)
        .json({ error: "Registration start date cannot be later than the end date" });
    }

    if (new Date(hackathonTimeline.start) > new Date(hackathonTimeline.end)) {
      return res
        .status(400)
        .json({ error: "Hackathon start date cannot be later than the end date" });
    }
    const convertToIST = (date) => {
      const utcDate = new Date(date); // Input date as UTC
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      return new Date(utcDate.getTime() + offset);
    };

    const registrationTimelineIST = {
      start: convertToIST(registrationTimeline.start),
      end: convertToIST(registrationTimeline.end),
    };

    const hackathonTimelineIST = {
      start: convertToIST(hackathonTimeline.start),
      end: convertToIST(hackathonTimeline.end),
    };


    // Create a new hackathon instance
    const newHackathon = new HackathonSchema({
      hackName: hackathonName,
      tSize: teamSize,
      regTime: registrationTimelineIST,
      hackTime: hackathonTimelineIST,
      allVidLink: allowVideoLink,
      allLiveDepLink: allowLiveDeploymentLink,
      themes,
    });

    // Save the hackathon to the database
    const savedHackathon = await newHackathon.save();

    // Respond with the created hackathon
    res.status(201).json({
      message: "Hackathon created successfully",
      hackathon: savedHackathon,
    });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getThemes = async (req, res) => {

  try {
    const { id } = req.params;

    // Validate ObjectId


    const hackathon = await HackathonSchema.findById(id);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({ themes: hackathon.themes, tSize: hackathon.tSize });

  }
  catch (error) {
    console.error("Error fetching hackathon themes:", error);
    res.status(500).json({ message: "Server error" });
  }



}



const teamRegister = async (req, res) => {
  try {
    // Extract the hackathon ID from route parameters

    const { id } = req.params;

    // Extract the team registration data from the request body
    const {
      teamName,
      teamLeader,
      teamMembers,
      selectedProblem,

    } = req.body;


    // Validate the required fields
    if (!teamName || !teamLeader || !teamLeader.email || !selectedProblem) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Verify the hackathon exists in the CreateHackathon collection
    const hackathon = await HackathonSchema.findById(id);

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found.' });
    }
    const teamLeaderExists = await userSchema.findOne({ email: teamLeader.email });
    if (!teamLeaderExists) {
      return res.status(400).json({ error: "Team leader email is not registered." });
    }
    
    for (const member of teamMembers) {
      const memberExists = await userSchema.findOne({ email: member.email });
      if (!memberExists) {
        return res.status(400).json({ error: `Team member email ${member.email} is not registered.` });
      }
    }
    
    const teamNameExists = await userSchema.findOne({
      "hackhist.hackid": id,
      "hackhist.tName": teamName,
    });
    if (teamNameExists) {
      return res.status(400).json({
        error: `The team name '${teamName}' is already registered for this hackathon.`,
      });
    }

    const leaderExists = await userSchema.findOne({
      email: teamLeader.email,
      "hackhist.hackid": id, // Check if this hackathon ID already exists in hackhist
    });

    if (leaderExists) {
      return res.status(400).json({
        error: "Team leader is already registered for this hackathon.",
      });
    }
    console.log("yaha3");
    for (const member of teamMembers) {
      const memberExists = await userSchema.findOne({
        email: member.email,
        "hackhist.hackid": id,
      });

      if (memberExists) {
        return res.status(400).json({
          error: `Team member ${member.email} is already registered for this hackathon.`,
        });
      }
    }

    const tempHack = new HackHisSchema({
      hackid: id,
      tName: teamName,
      teamLeader,
      teamMembers,
      submiss: [
        {
          theme: selectedProblem,
          desc: "NA",
          githubLink: "NA",
          videoLink: "",
          liveLink: "",
          pname: "NA"
        },
      ]
    });
    
    if (teamMembers.length == 0) {
      await userSchema.findOneAndUpdate({ email: teamLeader.email }, {
        $push: {
          hackhist: {
            hackid: id,
            tName: teamName,
            teamLeader,
            teamMembers,
            submiss: [
              {
                theme: selectedProblem,
                desc: "NA",
                githubLink: "NA",
                videoLink: "",
                liveLink: "",
                pname: "NA"
              },
            ]
          }
        }
      }, { new: true, upsert: true });
      return res.status(200).json({ message: 'team  is registered successfully.' });
    }

    await tempHack.save();


    for (const member of teamMembers) {
      const notification = new Notification({
        userid: member.email,
        type: "team-register",
        text: `Do you want to register with the team '${teamName}' Created by '${teamLeader.email}' for the hackathon '${hackathon.hackName}'?`,
        hackid: id,
        tname: teamName
      });
      
      await notification.save();
      
      await sendEmail2(member.email, "New Notification at CODEBIT", "You have a new notification at CODEBIT. Click here to view: http://localhost:3000/notification");
    }

    // }

    return res.status(201).json({
      message: 'Team registered successfully.',

    });
  } catch (error) {
    console.error('Error during team registration:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }



};








// const getCurrentUser=async(req,res)=>{
//   const userEmail = req.user.email; // Assuming email is in req.user
//   try {
//       const user = await StudentRegisterSchema.findOne({ email: userEmail });
//       if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//       }
//       return res.status(200).json(user); // Send back user details
//   } catch (error) {
//       console.error("Error fetching current user:", error);
//       return res.status(500).json({ error: 'Server error' });
//   }

// }
const projectSubmit = async (req, res) => {
  console.log("yaha pe");

  const { projectName,
    description,
    githubLink,
    videoLink,
    liveLink,
    userId,
    hackathonId,
  } = req.body;

  try {
    const userRecord = await userSchema.findOne({
      "hackhist.hackid": hackathonId,
      "hackhist.teamLeader.email": userId,
    });

    if (!userRecord) {
      return res.status(404).json({ message: "Hackathon not found in user history or You'r not an Team Leader" });
    }

    const hackathon = userRecord.hackhist.find(
      (hack) => hack.hackid === hackathonId
    );

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon details not found" });
    }

    if (!hackathon.submiss || hackathon.submiss.length === 0) {
      return res
        .status(400)
        .json({ message: "No submissions found to update." });
    }
    const teamMembersEmails = [
      hackathon.teamLeader.email,
      ...hackathon.teamMembers.map((member) => member.email),
    ];

    const updatePromises = teamMembersEmails.map(async (email) => {
      const memberRecord = await userSchema.findOne({
        email,
        "hackhist.hackid": hackathonId,
      });

      if (memberRecord) {
        const memberHackathon = memberRecord.hackhist.find(
          (hack) => hack.hackid === hackathonId
        );

        if (memberHackathon) {
          if (!memberHackathon.submiss || memberHackathon.submiss.length === 0) {
            memberHackathon.submiss = [{}];
          }

          const memberSubmission = memberHackathon.submiss[0];
          memberSubmission.pname = projectName || memberSubmission.pname;
          memberSubmission.desc = description || memberSubmission.desc || "";
          memberSubmission.githubLink =
            githubLink || memberSubmission.githubLink || "";
          memberSubmission.videoLink =
            videoLink || memberSubmission.videoLink || "";
          memberSubmission.liveLink = liveLink || memberSubmission.liveLink || "";
          console.log("sub" + memberSubmission);
          await memberRecord.save();
        }
      }
    });
    await Promise.all(updatePromises);






    console.log("ho hi gya");
    res.status(200).json({
      message: "Project updated successfully!",

    });






  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.errors);
    } else {
      console.error('Error:', error);
    }
    res.status(500).json({ message: 'Error submitting project', error: error.message });
  }




}

const checkProjectSubmission = async (req, res) => {

  const { hackathonId, email } = req.query; // Accept hackathon ID and user email in the query params

  try {
    // Check if a project exists for the given hackathon and email
    const userRecord = await userSchema.findOne({
      $or: [
        { email }, // Match user by email
        { "hackhist.teamLeader.email": email }, // Match as team leader
        { "hackhist.teamMembers.email": email } // Match as a team member
      ],
      "hackhist.hackid": hackathonId // Match the hackathon ID
    });
    if (!userRecord) {
      return res.status(404).json({ message: "User or hackathon not found." });
    }

    // Find the relevant hackathon entry in the user's history
    const hackathon = userRecord.hackhist.find(
      (hack) => hack.hackid === hackathonId
    );
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon details not found." });
    }

    // Check if there's a submission
    const submission = hackathon.submiss.find(
      (sub) =>
        sub.desc !== "NA" &&
        sub.pname !== "NA" &&
        sub.githubLink !== "NA"
    );

    if (submission) {
      return res.status(200).json({ submitted: true, project: submission });
    } else {
      return res.status(200).json({ submitted: false });
    }


  } catch (error) {
    console.error("Error checking project submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
const createContest = async (req, res) => {

  try {
    // Extract data from request body
    const { contName, startTime, endTime, problems } = req.body;
    console.log(contName);
    console.log(startTime);
    console.log(endTime);
    console.log(problems);
    // Validate required fields
    if (!contName || !startTime || !endTime) {
      return res.status(400).json({ message: "Contest name, start time, and end time are required." });
    }
    const startTimeUTC = new Date(startTime);
    const endTimeUTC = new Date(endTime);
    if (isNaN(startTimeUTC) || isNaN(endTimeUTC)) {
      return res.status(400).json({ message: "Invalid start or end time format." });
    }
    const IST_OFFSET = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const startTimeIST = new Date(startTimeUTC.getTime() + IST_OFFSET);
    const endTimeIST = new Date(endTimeUTC.getTime() + IST_OFFSET);

    // Validate date ranges
    if (startTimeIST >= endTimeIST) {
      return res.status(400).json({ message: "Start time cannot be later than or equal to end time." });
    }

    const challenges = problems.map((challenge) => ({
      pnt: challenge.pnt || 0,
      desc: {
        probName: challenge.desc.probName,
        statement: challenge.desc.statement,
        inpForm: challenge.desc.inpForm,
        constraint: challenge.desc.constraint,
        outForm: challenge.desc.outForm,
      },
      exmp: challenge.exmp || [],
      testcs: challenge.testcs || [],
    }));
    console.log("ab to ");
    console.log(challenges);
    const newContest = new ContestSchema({
      contName: contName,
      startTime: startTimeIST,
      endTime: endTimeIST,
      problems,
    });

    // Save the contest to the database
    console.log(newContest);
    const savedContest = await newContest.save();
    console.log(savedContest);
    // Respond with the saved contest
    res.status(201).json({ message: "Contest created successfully", contest: savedContest });
  } catch (error) {
    console.error("Error creating contest:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }



}
const contestRegister = async (req, res) => {
  const { email, contestId } = req.body;
  try {
    console.log(email);
    console.log(contestId);
    // Check if user already registered
    const user = await userSchema.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const existingRegistration = user.cnthis.find((contest) => contest.cntid === contestId);
    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this contest." });
    }

    // Add the contest registration to the user's cnthis array
    user.cnthis.push({
      cntid: contestId,
      point: 0, // Default points (you can adjust this logic as needed)
      submiss: [], // Initialize an empty submissions array
    });

    // Register user

    await user.save({ validateModifiedOnly: true });
    console.log("Registration successful:", user);
    res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }




}
const excelUpload = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Keep file extensions
  form.multiples = false; // Expect a single file
  console.log("form", form);
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Error processing the form.' });
    }

    const uploadedFile = files.file;
    console.log("up", uploadedFile);
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      // Read the uploaded Excel file
      let fileBuffer;
      if (uploadedFile.buffer) {
        // If buffer exists, use it directly
        fileBuffer = uploadedFile.buffer;
      } else if (uploadedFile.filepath) {
        // If filepath exists, read the file (not needed if you don't store files)
        fileBuffer = await fs.promises.readFile(uploadedFile.filepath);
      } else {
        return res.status(400).json({ message: 'Uploaded file is invalid.' });
      }
      console.log("file", fileBuffer);
      // Parse the Excel file using xlsx
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      console.log("work", workbook);
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      console.log("sheet", sheetName);
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log("shtd", sheetData);
      // Extract specific fields (RollNumber and Email)
      const extractedData = sheetData.map((row) => ({
        rollNumber: row.CollegeRollNo || row['CollegeRollNo'], // Match column headers
        email: row.Email || row['Email'],
      }));
      console.log("ext", extractedData);
      // Send response back to the frontend
      return res.status(200).json({
        message: 'File processed successfully!',
        data: extractedData,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(500).json({ message: 'Failed to process the uploaded file.' });
    }
  });




}
const getContestProblems = async (req, res) => {
  const contestId = req.params.id;
  try {
    const contest = await ContestSchema.findById(contestId);
    res.json(contest); // Returns the contest data including problems
  } catch (err) {
    res.status(500).json({ message: "Failed to load contest problems" });
  }



}
const getHackathonHistory = async (req, res) => {
  const { hackathonId } = req.params;

  try {
    const users = await userSchema.find({ "hackhist.hackid": hackathonId });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Hackathon not found or no registrations found" });
    }

    // Extract the hackathon details for each user
    // const hackathonDetails = users.map(user =>
    //   user.hackhist.find(hack => hack.hackid === hackathonId)
    // );

    // console.log(hackathonDetails);
    // res.status(200).json(hackathonDetails);

    let hackathonDetails = users
      .flatMap(user => user.hackhist.filter(hack => hack.hackid === hackathonId));

    // Remove duplicates based on teamName
    const uniqueHackathonDetails = [];
    const seenTeamNames = new Set();

    hackathonDetails.forEach(detail => {
      if (!seenTeamNames.has(detail.tName)) {
        seenTeamNames.add(detail.tName);
        uniqueHackathonDetails.push(detail);
      }
    });


    res.status(200).json(uniqueHackathonDetails);
  }
  catch (error) {
    console.error("Error fetching hackathon history:", error);
    res.status(500).json({ message: "Server error" });
  }

}

const getContestHistory = async (req, res) => {
  const { contestId } = req.params;
  try {
    // Get the contest ID from request parameters

    // Find users that have the given contestId in their cnthis array
    const users = await userSchema.find({
      "cnthis.cntid": contestId,  // Look inside the cnthis array for matching cntid
    });

    // If no users found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Contest not found or no registrations found" });
    }

    const contestDetails = users.map(user => {
      const contestInfo = user.cnthis.find(hack => hack.cntid === contestId);
      return {
        email: user.email,
        roll: user.roll,
        ...contestInfo
      };
    });

    // Send the users' data as the response

    res.status(200).json(contestDetails);

  } catch (error) {
    console.error("Error fetching contest history:", error);
    res.status(500).json({ message: "Server Error" });
  }



}


const addEvents = async (req, res) => {
  try {
    const {
      tit,
      desc,
      deadline,
      org,
      anType, // Announcement type
      selEv,  // Selected event (ID)
      tNames, // Winner team names
    } = req.body;
    console.log(req.body);
    // Validate announcement type
    if (!["normal", "hackathon", "contest"].includes(anType)) {
      return res.status(400).json({ error: "Invalid announcement type." });
    }
    if (anType === "normal") {
      if (!tit || !desc || !deadline) {
        return res
          .status(400)
          .json({ error: "Title, description, and deadline are required for normal announcements." });
      }
    } else if (anType === "hackathon") {
      // Hackathon-specific validation
      if (!selEv || !tNames || !Array.isArray(tNames) || tNames.some((name) => !name)) {
        return res
          .status(400)
          .json({
            error: "Selected event and valid winner team names are required for hackathon announcements.",
          });
      }
    } else if (anType === "contest") {
      // Contest-specific validation
      if (!selEv) {
        return res
          .status(400)
          .json({ error: "Selected event is required for contest announcements." });
      }
    }

    // Validate organizers
    if (!Array.isArray(org) || org.some((o) => !o.name || !o.email || !o.phone)) {
      return res.status(400).json({
        error: "Organizers must be an array with each organizer having a name, email, and phone.",
      });
    }
    // Prepare event data
    const eventData = {
      tit,
      desc,
      deadline: anType === "normal" ? deadline : undefined,
      org,
      anType,
      selEv: ["hackathon", "contest"].includes(anType) ? selEv : undefined,
      tNames: ["hackathon"].includes(anType) ? tNames : undefined,
    };

    // Create and save event
    const event = new EventSchema(eventData);
    await event.save();
    res.status(201).json({ message: "Event created successfully!", event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Server error." });
  }




};

const getHackathonData = async (req, res) => {
  const { hackathonId } = req.params;

  try {
    // Find the hackathon by ID
    const hackathon = await HackathonSchema.findById(hackathonId);

    // If hackathon not found, return a 404 response
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    // Return the hackathon details
    res.status(200).json(hackathon);
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }



}

const editHackathon = async (req, res) => {
  const { hackathonId } = req.params;
  const updatedData = req.body;

  try {
    // Find the hackathon by ID
    const hackathon = await HackathonSchema.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }
    const convertToIST = (date) => {
      const utcDate = new Date(date); // Input date as UTC
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      return new Date(utcDate.getTime() + offset);
    };
    const registrationTimelineIST = {
      start: convertToIST(updatedData.registrationTimeline.start),
      end: convertToIST(updatedData.registrationTimeline.end),
    };

    const hackathonTimelineIST = {
      start: convertToIST(updatedData.hackathonTimeline.start),
      end: convertToIST(updatedData.hackathonTimeline.end),
    };
    // Update hackathon fields
    hackathon.hackName = updatedData.hackathonName;
    hackathon.tSize = updatedData.teamSize;
    hackathon.regTime = registrationTimelineIST;
    hackathon.hackTime = hackathonTimelineIST;
    hackathon.allVidLink = updatedData.allowVideoLink;
    hackathon.allLiveDepLink = updatedData.allowLiveDeploymentLink;
    hackathon.themes = updatedData.themes;

    // Save the updated hackathon
    await hackathon.save();

    res.status(200).json({ message: "Hackathon updated successfully", hackathon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating hackathon" });
  }
};
const deleteHackathon = async (req, res) => {
  const hackathonId = req.params.hackathonId;

  try {
    // Find and delete the hackathon
    const deletedHackathon = await HackathonSchema.findByIdAndDelete(hackathonId);

    if (!deletedHackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    return res.status(200).json({ message: "Hackathon deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }


}
const getContestData = async (req, res) => {
  const { hackathonId } = req.params;

  try {
    const contest = await ContestSchema.findById(hackathonId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json(contest);
  } catch (error) {
    console.error("Error fetching contest details:", error);
    res.status(500).json({ message: "Server error" });
  }



}
const editContest = async (req, res) => {
  const { hackathonId } = req.params;

  const { contestName, startTime, endTime, challenges } = req.body;

  if (!contestName || !startTime || !endTime || !Array.isArray(challenges)) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    // Find the contest by hackathonId
    const contest = await ContestSchema.findById(hackathonId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }
    const convertToIST = (date) => {
      const utcDate = new Date(date); // Input date as UTC
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      return new Date(utcDate.getTime() + offset);
    };
    const startTimeIST = convertToIST(new Date(startTime));
    const endTimeIST = convertToIST(new Date(endTime));

    // Update the contest details
    contest.contName = contestName;
    contest.startTime = startTimeIST;
    contest.endTime = endTimeIST;
    contest.problems = challenges.map(challenge => ({
      pnt: Number(challenge.points),
      desc: {
        probName: challenge.challengeName,
        statement: challenge.problemStatement,
        inpForm: challenge.inputFormat,
        constraint: challenge.constraints,
        outForm: challenge.outputFormat,
      },
      exmp: challenge.examples.map(ex => ({
        inp: ex.inp,
        out: ex.out
      })),
      testcs: challenge.testCases.map(tc => ({
        inp: tc.inp,
        expout: tc.expout
      }))
    }));


    // Save the updated contest
    const updatedContest = await contest.save();

    return res.status(200).json({ message: "Contest updated successfully!", updatedContest });
  } catch (error) {
    console.error("Error updating contest:", error);
    return res.status(500).json({ message: "Failed to update contest." });
  }



}
const deleteContest = async (req, res) => {
  const hackathonId = req.params.hackathonId;
  try {
    const contest = await ContestSchema.findByIdAndDelete(hackathonId);
    if (!contest) {
      return res.status(404).json({ message: `Contest with ID ${hackathonId} not found.` });
    }
    await userSchema.updateMany(
      { "cnthis.cntid": hackathonId }, // Filter for users who have the contest
      { $pull: { cnthis: { cntid: hackathonId } } } // Remove the contest from the `cnthis` array
    );

    // Step 3: Send a success response
    res.status(200).json({ message: `Contest with ID ${hackathonId} deleted successfully and removed from users.` });


  } catch (error) {
    console.error("Error deleting contest:", error);
    res.status(500).json({ message: "Error deleting contest" });

  }


}
const getEventData = async (req, res) => {
  const hackathonId = req.params.hackathonId;
  try {

    const event = await EventSchema.findById(hackathonId);
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }

    res.send(event);

  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }




}
const editEvent = async (req, res) => {
  console.log(req.params);
  const hackathonId = req.params.hackathonId;
  console.log(hackathonId);
  const {
    tit,
    desc,
    deadline,
    org,
    anType,
    tNames,
  } = req.body;
  try {
    // Find the event by hackathonId
    const event = await EventSchema.findById(hackathonId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Update event details
    event.tit = tit || event.tit;
    event.desc = desc || event.desc;
    event.deadline = deadline || event.deadline;
    event.org = org.length > 0 ? org : event.org;
    event.anType = anType || event.anType;
    event.tNames = tNames && tNames.length > 0 ? tNames : event.tNames;
    await event.save();

    // Send a success response
    res.status(200).json({ message: "Event updated successfully!" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "An error occurred while updating the event. Please try again." });
  }


}
const deleteEvent = async (req, res) => {
  const hackathonId = req.params.hackathonId;

  try {
    // Find and delete the event by ID
    const deletedEvent = await EventSchema.findByIdAndDelete(hackathonId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "An error occurred while deleting the event. Please try again." });
  }


}
const getProjectSubmission = async (req, res) => {
  const { hackathonId, userId } = req.params;

  try {
    // Validate required fields
    if (!hackathonId || !userId) {
      return res.status(400).json({ message: "Hackathon ID and User ID are required" });
    }

    // Find the hackathon submission
    const user = await userSchema.findOne(
      { email: userId, "hackhist.hackid": hackathonId },
      { "hackhist.$": 1 } // Use positional projection to retrieve only the relevant hackathon
    );

    if (!user || !user.hackhist || user.hackhist.length === 0) {
      return res.status(404).json({
        message: "No project submission found for the given Hackathon ID and User ID.",
      });
    }

    const hackathonData = user.hackhist[0]; // Extract the relevant hackathon data

    if (!hackathonData.submiss || hackathonData.submiss.length === 0) {
      return res.status(404).json({
        message: "No project submission found for the given Hackathon.",
      });
    }

    // Return the submission data
    res.status(200).json({
      message: "Project submission fetched successfully.",
      submission: hackathonData.submiss[0], // Assuming one submission per hackathon
      teamName: hackathonData.tName,

    });
  } catch (error) {
    console.error("Error fetching project submission:", error);
    res.status(500).json({ message: "Failed to fetch project submission.", error: error.message });
  }





}

const editSubmission = async (req, res) => {
  const { hackathonId, userId } = req.params; // userId is the email here
  const { pname, desc, githubLink, videoLink, liveLink } = req.body;

  try {
    // Validate required fields
    if (!pname || !desc || !githubLink) {
      return res.status(400).json({ message: "Project Name, Description, and GitHub Link are required." });
    }

    // Fetch the user who is attempting to edit
    const editingUser = await userSchema.findOne({ email: userId });
    if (!editingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the hackathon entry in the editing user's history
    const userHackathonIndex = editingUser.hackhist.findIndex(
      (entry) => entry.hackid.toString() === hackathonId
    );
    if (userHackathonIndex === -1) {
      return res.status(404).json({ message: "Hackathon not found in user's history." });
    }

    // Identify the team leader
    const teamLeaderEmail = editingUser.hackhist[userHackathonIndex].teamLeader.email;
    const leader = await userSchema.findOne({ email: teamLeaderEmail });

    if (!leader) {
      return res.status(404).json({ message: "Team leader not found." });
    }

    // Find the hackathon entry in the leader's history
    const leaderHackathonIndex = leader.hackhist.findIndex(
      (entry) => entry.hackid.toString() === hackathonId
    );
    if (leaderHackathonIndex === -1) {
      return res.status(404).json({ message: "Hackathon not found in leader's history." });
    }

    // Update the submission data for the leader
    leader.hackhist[leaderHackathonIndex].submiss[0] = {
      theme: leader.hackhist[leaderHackathonIndex].submiss[0]?.theme || "N/A", // Retain the existing theme if present
      pname,
      desc,
      githubLink,
      videoLink: videoLink || null, // Optional field
      liveLink: liveLink || null,   // Optional field
    };

    // Save the leader's updated data
    await leader.save();

    // Get the team members from the leader's hackathon data
    const { teamMembers } = leader.hackhist[leaderHackathonIndex];

    // Update submissions for all team members
    const updateTeamSubmissions = teamMembers.map(async (member) => {
      const teamMember = await userSchema.findOne({ email: member.email });
      if (teamMember) {
        const memberHackathonIndex = teamMember.hackhist.findIndex(
          (entry) => entry.hackid.toString() === hackathonId
        );

        if (memberHackathonIndex !== -1) {
          teamMember.hackhist[memberHackathonIndex].submiss[0] = {
            theme: teamMember.hackhist[memberHackathonIndex].submiss[0]?.theme || "N/A",
            pname,
            desc,
            githubLink,
            videoLink: videoLink || null,
            liveLink: liveLink || null,
          };

          await teamMember.save();
        }
      }
    });

    // Wait for all team members' submissions to be updated
    await Promise.all(updateTeamSubmissions);

    res.status(200).json({
      message: "Submission updated successfully for the leader and all team members.",
      submission: leader.hackhist[leaderHackathonIndex].submiss[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the submission.",
      error: error.message,
    });
  }
};




module.exports = {
  getMails,
  registerMain,
  hackathonCreate,
  getThemes,
  teamRegister,
  //   getCurrentUser,
  projectSubmit,
  checkProjectSubmission,
  createContest,
  contestRegister,
  excelUpload,
  getContestProblems,
  getHackathonHistory,
  getContestHistory,
  addEvents,
  getHackathonData,
  editHackathon,
  deleteHackathon,
  getContestData,
  editContest,
  deleteContest,
  getEventData,
  editEvent,
  deleteEvent,
  getProjectSubmission,
  editSubmission

};