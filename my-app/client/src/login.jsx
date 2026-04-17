import { useState } from "react";
import './login.css';
import LogoFaderco from "./assets/Faderco_logo.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
;
  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");
if (!email || !password) {
      setError("Email and password are required");
      toast.error("Email and password are required");
      return;
    }


    try {

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {

        console.log("Logged in successfully:", data);
      toast.success("Logged in successfully");
        // حفظ التوكن
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // تحويل المستخدم حسب الدور
        if (data.role === "agent") {
          window.location.href = "/agent";
        }

        else if (data.role === "finance") {
          window.location.href = "/finance";
        }

        else if (data.role === "cassier") {
          window.location.href = "/cassier";
        }

      } else {
        //error incorrect message
    setError( "Email or password is incorrect");
    toast.error("Email or password is incorrect");
      }
         //add here the code 
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

  };

  return (
    <div className="login_container">
        <form className="login_form">

   <img className="login-logo" src={LogoFaderco}/>
             
    


      <h2>Welcome Back</h2>
      <p className="login-desc">Log in to your account to continue</p>
 <label htmlFor="email" className={error ? "label-error" : ""}>Email</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className={error ? "input-error" : ""}
        onChange={(e) => setEmail(e.target.value)}
        required
        
      />

    
<label htmlFor="password" className={error ? "label-error" : ""} >Password</label>
      <input   className={error ? "input-error" : ""}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        
      />

      

      <button onClick={handleLogin}>Login</button>
 <div className="login-error-slot" aria-live="polite">
      {error && <p style={{ color: "red" }}>{error}</p>}
   </div>     
   </form>
      <ToastContainer position="top-center" autoClose={3000} />  
    </div>
    
  );
}

export default Login;
