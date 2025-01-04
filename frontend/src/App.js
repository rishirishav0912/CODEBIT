import './App.css';
import Navbar from './components/Navbar';
import NavigatingPage from './pages/NavigatingPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {ToastContainer} from "react-toastify";
function App() {
  return (
    <div className="App">
       <BrowserRouter>
      <Navbar />
      
      <NavigatingPage />
      <ToastContainer />
      </BrowserRouter>
    </div>
  );
};

export default App;
