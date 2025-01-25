const express = require("express");
const router= express.Router();
const { create, deleteIns } = require("../controllers/instanceController");
const { makeSubmission, runCustomIO } = require("../controllers/usercontroller");
const {registerMain,hackathonCreate,createContest,getThemes,teamRegister,projectSubmit,
checkProjectSubmission,contestRegister,excelUpload,getHackathonHistory,
getContestHistory,addEvents,getHackathonData,editHackathon,deleteHackathon,getContestData,
editContest,deleteContest,getEventData,editEvent,deleteEvent,getMails,
getProjectSubmission,
editSubmission}=require("../controllers/admincontroller");

router.get("/getprojectsubmission/:hackathonId/:userId",getProjectSubmission);
router.put("/projects/editsubmission/:hackathonId/:userId",editSubmission);
router.get("/mails",getMails);
router.post("/registermain",registerMain);
router.post("/hackathon/create",hackathonCreate);
router.get("/teamregister/:id",getThemes);
router.post("/teamregister/:id",teamRegister);
// router.get("/current-user",getCurrentUser);
router.post("/projects/submit",projectSubmit);

router.post("/register-contest",contestRegister);
router.get("/checkProjectSubmission", checkProjectSubmission);
router.post("/createcontest",createContest);
router.post("/upload-excel",excelUpload);
router.get("/hackathonhist/:hackathonId",getHackathonHistory);
router.get("/contesthist/:contestId",getContestHistory);
router.post("/addevents",addEvents);
router.get("/hackathondata/:hackathonId",getHackathonData);
router.post("/edit-hackathon/:hackathonId", editHackathon);
router.delete("/deletehackathon/:hackathonId",deleteHackathon);
router.get("/contestdata/:hackathonId",getContestData);
router.post("/edit-contest/:hackathonId",editContest);
router.delete("/deletecontest/:hackathonId",deleteContest);
router.get("/eventdata/:hackathonId",getEventData);
router.put("/edit-event/:hackathonId",editEvent);
router.delete("/deleteevent/:hackathonId",deleteEvent);
router.post("/customIO", runCustomIO);
router.post("/:userId/:contestId/:problemId",makeSubmission);
router.post('/create-instance', create);
router.post('/delete-instance', deleteIns);
module.exports= router;