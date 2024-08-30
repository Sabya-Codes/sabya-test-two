import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dropdown from "./components/Dropdow"; // Ensure the correct file path

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Add route for the Dropdown component */}
        <Route path="/home/museum" element={<Dropdown />} />
      </Routes>
    </Router>
  );
}

export default App;
