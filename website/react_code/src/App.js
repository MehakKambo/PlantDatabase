import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import IllnessesPage from "./components/IllnessesPage";
import Navbar from "./components/NavBar";
import SymptomPage from "./components/SymptomPage";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/illnesses" element={<IllnessesPage />} />
        <Route path="/symptoms" element={<SymptomPage />} />
      </Routes>
    </Router>
  );
}

export default App;