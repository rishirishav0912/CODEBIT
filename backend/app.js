require("dotenv").config()
const express= require("express");
const mongoose= require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const authUsersRoutes = require("./routes/auth_user");
const publicRoutes= require("./routes/public");
const URL=process.env.DB;
mongoose.connect(URL).then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})
app.use(cors({
    "origin": "*",
    "allowedHeaders": ['Content-Type', 'Authorization'],
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
// app.use("/auth/*",function auth(req,res,next){
//     console.log("hello");
//     if(req.headers.authorization) {
//         let token = req.headers.authorization;
//          // Access Token
//         jwt.verify(token, "fingerprint_customer",(err,user)=>{
//             if(!err){
//                 req.user = user;
//                 next();
//             }
//             else{
//                 return res.status(403).json({message: "User not authenticated"})
//             }
//          });
//      } else {
//          return res.status(403).json({message: "User not logged in"})
//      }
    
//     });
app.use("/auth", authUsersRoutes);
app.use("/",publicRoutes);
app.listen(process.env.PORT,(req,res)=>{
    console.log("server is running at port ",process.env.PORT);
})