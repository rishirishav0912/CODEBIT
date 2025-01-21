import './App.css';
import Navbar from './components/Navbar';
import NavigatingPage from './pages/NavigatingPage';
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App font-fira-codes font-source-code-pro">
      <BrowserRouter>
        <NavigatingPage />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
};

export default App;
