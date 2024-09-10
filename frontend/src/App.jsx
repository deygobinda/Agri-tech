import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Predictor from "./pages/Predictor"
import Weather from "./pages/Weather"

function App() {
  return <div>
    <Navbar />
    <Routes>
    <Route path="/" element={<Predictor />} />
    <Route path="/weather" element={<Weather />} />
    </Routes>
  </div>
}

export default App;
