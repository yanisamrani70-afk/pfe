import Form from "./Form";
import Agent from "./Agent";
import Finance from "./Finance"; 
import Cassier from "./cassier"; 
import Login from "./login"; 

import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {role === "agent" && (
        <Route path="/agent" element={<Agent />} />
      )}
      
       {role === "cassier" && (
      <Route
        path="/cassier"
        element={token ? <Cassier /> : <Navigate to="/login" />}
      />)}
        {role === "finance" && (
      <Route
        path="/finance"
        element={token ? <Finance /> : <Navigate to="/login" />}
      />)}

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;