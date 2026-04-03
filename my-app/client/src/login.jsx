import { useState } from "react";
import './login.css';
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
      }
         //add here the code 
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

  };

  return (
    <div className="login_container">
        <div className="login_form">


    


      <h2>LOGIN</h2>
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

      {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <h3>&copy; 2026 Prototype</h3>
    </div>
    
  );
}

export default Login;
