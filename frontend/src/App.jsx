import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Predictor from "./pages/Predictor";
import Weather from "./pages/Weather";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Predictor />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;