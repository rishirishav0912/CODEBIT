import { BrowserRouter, Routes, Route ,useLocation} from "react-router-dom";

import ContestHackathon from "./ContestHackathon";
import ProjectSubmission from "./ProjectSubmission";
import FormHackathon from "./FormHackathon";
import CreateHackathon from "./CreateHackathon";
import CreateContest from "./CreateContest";
import LeaderBoard from "../components/LeaderBoard";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Emailverify from "./Emailverify"; 
import HackathonmanagePage from "./HackathonmanagePage.js";
import ContestProblemPage from "./ContestProblemPage.js";
import ContestmanagePage from "./ContestmanagePage.js";
import EventForm from "./EventForm.js";
import PastHackathonManagePage from "./PastHackathonManagePage.js";
import EditHackathon from "./EditHackathon.js";
import EditContest from "./EditContest.js";
import EditEvent from "./EditEvent";
import CodeSubmission from "./CodeSubmission.js";
import EditSubmission from "./EditSubmission.jsx";
import Notifications from "./Notifications.jsx"

function NavigatingPage() {
   
    return (
        <div className="Navigating">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/projectsubmit" element={<ProjectSubmission />} /> */}
                {/* <Route path="/teamregister" element={<FormHackathon />} /> */}
                <Route path="/createhackathon" element={<CreateHackathon />} />
                <Route path="/createcontest" element={<CreateContest />} />
                
                <Route path="/:feat" element={<ContestHackathon />} />
                <Route path="/users/:id/verify/:token" element={<Emailverify />} />
                <Route path="/teamregister/:hackathonId" element={<FormHackathon />} />
                <Route path="/projectsubmit/:hackathonId" element={<ProjectSubmission />} />  
                <Route path="/contestleaderboard/:contestId" element={<LeaderBoard/>}/>    
                <Route path="/managehackathon/:hackathonId" element={<HackathonmanagePage />} /> 
                <Route path="/managecontest/:contestId" element={<ContestmanagePage/>}/>
                <Route path="/contestproblempage" element={<ContestProblemPage />} />  
                <Route path='/addevents' element={<EventForm />} />    
                <Route path="/hackathonleaderboard/:hackathonId" element={<PastHackathonManagePage/>}/>     
                <Route path="/edithackathon/:hackathonId" element={<EditHackathon/>}/> 
                <Route path="/editcontest/:hackathonId" element={<EditContest/>}/>
                <Route path="/editevent/:hackathonId" element={<EditEvent/>}/>
                <Route path="/:contestId/:problemId/codeEditor" element={<CodeSubmission />} />
                <Route path="/editsubmission/:hackathonId" element={<EditSubmission />}/>
                <Route path="/notification" element={<Notifications />}/>
            </Routes>
        </div>
    );
}

export default NavigatingPage;
