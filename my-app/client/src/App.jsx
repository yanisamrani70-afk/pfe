import { Routes, Route } from "react-router-dom";
import Form from "./Form";
import Agent from "./Agent";
import Finance from "./Finance"; 
import Cassier from "./cassier"; 
import Login from "./login"; 
function App() {
  const role = localStorage.getItem("role");
  return (
    <Routes>
     
      <Route path="/" element={<Login/>} />
      {role === "agent" && <Route path="/agent" element={<Agent />}/>}
     <Route path="/finance" element={<Finance/>} />
      <Route path="/cassier" element={<Cassier/>} />
    <Route path="/ login" element={< Login/>} />
      Login
     </Routes>
  );
}

export default App;
