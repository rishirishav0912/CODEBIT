const VerificationSchema=require("../models/VerificationSchema");
const HackathonSchema =require("../models/HackathonSchema");
const userSchema=require("../models/userSchema");
const formidable = require('formidable');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const EventSchema=require("../models/EventSchema");
const ContestSchema=require("../models/ContestSchema");
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

const registerMain = async(req, res) => {
  
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
        
      

        // Create a new hackathon instance
        const newHackathon = new HackathonSchema({
          hackName:hackathonName,
          tSize: teamSize,
          regTime:registrationTimeline,
          hackTime: hackathonTimeline,
          allVidLink:allowVideoLink,
          allLiveDepLink:allowLiveDeploymentLink,
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

const getThemes=async(req,res)=>{
  
    try {
      const { id } = req.params;
       
      // Validate ObjectId
      

      const hackathon = await HackathonSchema.findById(id);
      if (!hackathon) {
          return res.status(404).json({ message: "Hackathon not found" });
      }

      res.status(200).json({ themes: hackathon.themes });
  
} 
catch (error) {
  console.error("Error fetching hackathon themes:", error);
  res.status(500).json({ message: "Server error" });
}



}


  
  const teamRegister = async (req, res) => {
      try {
          // Extract the hackathon ID from route parameters
          
          const { id} = req.params;
          
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
          const teamLeaderUpdate = {
            $push: {
              hackhist: {
                hackid: id,
                tName: teamName,
                teamLeader,
                teamMembers,
                submiss: [
                  {
                    theme: selectedProblem,
                    desc:"",
                    githubLink: "",
                    videoLink: "",
                    liveLink: "",
                  },
                ],
              },
            },
          };
          // // Ensure the team leader email is unique
          
          await userSchema.findOneAndUpdate({ email: teamLeader.email }, teamLeaderUpdate);
         
          for (const member of teamMembers) {
            const memberUpdate = {
              $push: {
                hackhist: {
                  hackid: id,
                  tName: teamName,
                  teamLeader,
                  teamMembers,
                  submiss: [],
                },
              },
            };
            await userSchema.findOneAndUpdate({ email: member.email }, memberUpdate);
          }
          
          
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
const projectSubmit=async(req,res)=>{
    console.log("yaha pe");
    
    const {  projectName,
      description,
      githubLink,
      videoLink,
      liveLink,
      userId,
      hackathonId,
      } = req.body;
    console.log(userId);
    try {
    
      const userRecord = await userSchema.findOne({
        "hackhist.hackid": hackathonId,
        "hackhist.teamLeader.email":  userId ,
    });

    if (!userRecord) {
        return res.status(404).json({ message: "Hackathon not found in user history" });
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

const submission = hackathon.submiss[0];
submission.pname=projectName||submission.pname;
submission.desc = description || submission.desc;
submission.githubLink = githubLink || submission.githubLink;
submission.videoLink = videoLink || submission.videoLink;
submission.liveLink = liveLink || submission.liveLink;

// Save the updated user record
await userRecord.save();




console.log("ho hi gya");
res.status(200).json({
  message: "Project updated successfully!",
  project: {
      projectName:submission.pname,
      description: submission.desc,
      githubLink: submission.githubLink,
      videoLink: submission.videoLink,
      liveLink: submission.liveLink,
      hackathonId,
      teamLeader: hackathon.teamLeader,
      teamMembers: hackathon.teamMembers,
  },
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
      sub.desc && sub.githubLink 
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
const createContest=async(req,res)=>{

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
      
        const challenges= problems.map((challenge) => ({
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
            contName:contName,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
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
const contestRegister=async(req,res)=>{
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
     
      await user.save();
      console.log("Registration successful:", user);
      res.status(201).json({ message: "Registered successfully." });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
  
  
  
  
  }
const excelUpload=async(req,res)=>{
  const form = new formidable.IncomingForm();
    form.keepExtensions = true; // Keep file extensions
    form.multiples = false; // Expect a single file
console.log("form",form);
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ message: 'Error processing the form.' });
        }
          
        const uploadedFile = files.file;
        console.log("up",uploadedFile);
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
             console.log("file",fileBuffer);
            // Parse the Excel file using xlsx
            const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
            console.log("work",workbook);
            const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
            console.log("sheet",sheetName);
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
             console.log("shtd",sheetData);
            // Extract specific fields (RollNumber and Email)
            const extractedData = sheetData.map((row) => ({
                rollNumber: row.CollegeRollNo || row['CollegeRollNo'], // Match column headers
                email: row.Email || row['Email'],
            }));
   console.log("ext",extractedData);
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
const getContestProblems=async(req,res)=>{
  const contestId = req.params.id;
  try {
    const contest = await ContestSchema.findById(contestId);
    res.json(contest); // Returns the contest data including problems
} catch (err) {
    res.status(500).json({ message: "Failed to load contest problems" });
}



}
const getHackathonHistory=async(req,res)=>{
  const { hackathonId } = req.params;
console.log(hackathonId);
try {
  const users = await userSchema.find({ "hackhist.hackid": hackathonId });

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "Hackathon not found or no registrations found" });
  }

  // Extract the hackathon details for each user
  const hackathonDetails = users.map(user =>
    user.hackhist.find(hack => hack.hackid === hackathonId)
  );

  console.log(hackathonDetails);
  res.status(200).json(hackathonDetails);
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
      
    }catch(error){
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
      }}
  
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

const getHackathonData=async(req,res)=>{
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

      // Update hackathon fields
      hackathon.hackName = updatedData.hackathonName;
        hackathon.tSize = updatedData.teamSize;
        hackathon.regTime = updatedData.registrationTimeline;
        hackathon.hackTime = updatedData.hackathonTimeline;
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
const deleteHackathon=async(req,res)=>{
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
const getContestData=async(req,res)=>{
  const { hackathonId} = req.params;

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
const editContest=async(req,res)=>{
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

    // Update the contest details
    contest.contName = contestName;
        contest.startTime = new Date(startTime);
        contest.endTime = new Date(endTime);
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
const deleteContest=async(req,res)=>{
  const hackathonId = req.params.hackathonId;
try{
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


}catch(error){
  console.error("Error deleting contest:", error);
        res.status(500).json({ message: "Error deleting contest" });

}


}
const getEventData=async(req,res)=>{
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
const editEvent=async(req,res)=>{
  console.log(req.params);
  const  hackathonId = req.params.hackathonId;
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
const deleteEvent=async(req,res)=>{
  const hackathonId  = req.params.hackathonId;

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
  deleteEvent

};