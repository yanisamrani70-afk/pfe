import { Routes, Route } from "react-router-dom";
import Form from "./Form";
import Agent from "./Agent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/agent" element={<Agent />} />
    </Routes>
  );
}

export default App;
