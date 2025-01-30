const express= require("express");
const router= express.Router();
const userSchema=require("../models/userSchema");
const Token=require("../models/tokenSchema");
const {registerStudent,loginUser,showHackathons,showContest,getUserRegisteredHackathons,
    getUserRegisteredContests,getEvents,getAnnouncement,getTeamDetails,checkRegistration,
    fetchLeaderboardData,
    getNotifications
}=require("../controllers/publiccontroller");
const { getContestProblems } = require("../controllers/admincontroller");
router.post("/registerstudent",registerStudent);
router.post("/login/:userType",loginUser);
router.get("/hackathons",showHackathons);
router.get("/contests",showContest);
router.get("/user-registrations", getUserRegisteredHackathons);
router.get("/user-registrationscontest",getUserRegisteredContests);
router.get("/events",getEvents);
router.get("/announcements/:announcementType/:eventId",getAnnouncement);
router.get("/teams",getTeamDetails);
router.get("/teams/check-registration",checkRegistration);
router.get("/leaderboard-data/:contestId", fetchLeaderboardData);
router.get("/contestproblems/:id",getContestProblems);
router.get("/notifications",getNotifications);
router.get("/users/:id/verify/:token",async(req,res)=>{
try{
    console.log("me yaha hu");
const user=await userSchema.findOne({_id:req.params.id});
console.log(user);

if(!user)return res.status(400).send({message:"Invalid Link"});
const token=await Token.findOne({
uId:user._id,
token:req.params.token
});
console.log("token ayega");
console.log(token);
if(!token)return res.status(400).send({message:"Invalid Link"});
await userSchema.updateOne(
    { _id: user._id },         // Filter
    { $set: { isVerified: true } } // Update
);

await Token.deleteOne({ _id: token._id });

    res.status(200).send({message:"Email verified successfully"});
}catch(error){
res.status(400).send("Internal server error");

}


})
module.exports= router;